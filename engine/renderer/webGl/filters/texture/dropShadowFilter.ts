
import {AbstractFilter} from "../abstract/abstractFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Color} from "../../../common/color";
import {Game} from "@engine/core/game";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Size} from "@engine/geometry/size";


export class DropShadowFilter  extends AbstractFilter{


    private readonly color:string;
    private readonly shift:string;
    private readonly pixelWidth:string;
    private readonly pixelHeight:string;
    private readonly distance:string;

    private readonly shiftArr:[number,number] = [0,0];
    private shiftX:number = 12;
    private shiftY:number = 12;

    constructor(game:Game,private quality:number = 0.03 /*[0..1]*/,private dist:number = 25){
        super(game);

        this.quality = Math.pow(this.quality, 1/3);
        this.dist *= this.quality;

        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;

        this.color = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC4,'color');
        this.shift = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,'shift');
        this.pixelWidth = programGen.addFragmentUniform(GL_TYPE.FLOAT,'pixelWidth');
        this.pixelHeight = programGen.addFragmentUniform(GL_TYPE.FLOAT,'pixelHeight');
        this.distance = programGen.addFragmentUniform(GL_TYPE.FLOAT,'distance');
        //language=GLSL
        programGen.setFragmentMainFn(`
            #define PI ${Math.PI.toFixed(7)}
            #define MAX_DISTANCE ${this.dist.toFixed(7)}
            #define MAX_ANGLE ${(1 / this.quality / this.dist).toFixed(7)}
            vec2 px = vec2(pixelWidth, pixelHeight);
            
            void main(void){
                
                float totalAlpha = 0.;
                vec4 curColor;
                float cosAngle;
                float sinAngle;
                int cnt = 0;
                for (float angle = 0.; angle <= PI * 2.; angle += MAX_ANGLE) {
                   cosAngle = cos(angle);
                   sinAngle = sin(angle);
                   for (float curDistance = 1.; curDistance <= MAX_DISTANCE; curDistance++) {
                       vec2 texCoord = vec2(v_texCoord.x - shift.x +cosAngle * curDistance * px.x, v_texCoord.y - shift.y + sinAngle * curDistance * px.y);
                       if (texCoord.x<0. || texCoord.y<0. || texCoord.x>1. || texCoord.y>1.) discard; 
                       curColor = texture2D(texture,texCoord);
                       totalAlpha += curColor.a * curDistance/MAX_DISTANCE; // * force;
                       cnt++;
                   }
                }
                totalAlpha/=float(cnt);
                totalAlpha = clamp(totalAlpha,0.,1.);
               
                
                vec4 sampleShadow = color*totalAlpha;
                vec4 sampleOrig = texture2D(texture, v_texCoord);
    
                //result = src.rgb+dst.rgb(1-src.a)
                //result.a = src.a+dst.a(1-src.a)
                gl_FragColor.rgb = sampleOrig.rgb + sampleShadow.rgb*(1.0-sampleOrig.a);
                gl_FragColor.a = sampleOrig.a + sampleShadow.a*(1.0-sampleOrig.a);
            }
        `);
        this.setColor(Color.BLACK);
        this.setShift(this.shiftX,this.shiftY);
        this.simpleRectDrawer.initProgram();
    }


    public setColor(c:Color):void{
        this.setUniform(this.color,c.asGL());
    }

    public setShift(x:number,y:number = x):void{
        this.shiftX = x;
        this.shiftY = y;
    }

    public doFilter(destFrameBuffer:FrameBuffer):void{
        const size:Size = this.simpleRectDrawer.getAttachedTextureAt(0).size;
        this.shiftArr[0]  = this.shiftX / size.width;
        this.shiftArr[1]  = this.shiftY / size.height;
        this.setUniform(this.shift,this.shiftArr);
        this.setUniform(this.pixelWidth,1/(size.width*this.quality));
        this.setUniform(this.pixelHeight,1/(size.height*this.quality));
        super.doFilter(destFrameBuffer);
    }



}
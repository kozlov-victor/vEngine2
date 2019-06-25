
import {AbstractFilter} from "../abstract/abstractFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Color} from "../../../color";
import {Game} from "@engine/game";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Size} from "@engine/geometry/size";


export class DropShadowFilter  extends AbstractFilter{


    private readonly color:string;
    private readonly shift:string;
    private readonly inputSize:string;

    private readonly shiftArr:[number,number] = [undefined,undefined];
    private shiftX:number = 12;
    private shiftY:number = 12;

    constructor(game:Game){
        super(game);
        this.simpleRectDrawer.prepareShaderGenerator();

        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;

        this.color = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC4,'color');
        this.shift = programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,'shift');
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(void){
                vec4 sampleOffset = texture2D(texture, v_texCoord + shift);
                sampleOffset.rgb *= color.rgb;
                vec4 sampleOrig = texture2D(texture, v_texCoord);
    
                //result = src.rgb+dst.rgb(1-src.a)
                //result.a = src.a+dst.a(1-src.a)
                gl_FragColor.rgb = sampleOrig.rgb + sampleOffset.rgb*(1.0-sampleOrig.a);
                gl_FragColor.a = sampleOrig.a + sampleOffset.a*(1.0-sampleOrig.a);
            }
        `);
        this.simpleRectDrawer.initProgram();
        const col:Color = Color.BLACK.clone();
        col.setRGB(100,12,22);
        this.setColor(col);

        this.setShift(this.shiftX,this.shiftY);
    }


    public setColor(c:Color):void{
        this.setUniform(this.color,c.asGL());
    }



    public setShift(x:number,y:number = x):void{ // 0..1
        this.shiftX = x;
        this.shiftY = y;
    }

    public doFilter(destFrameBuffer:FrameBuffer):void{
        const size:Size = this.simpleRectDrawer.getAttachedTextureAt(0).size;
        this.shiftArr[0]  = this.shiftX / size.width;
        this.shiftArr[1]  = this.shiftY / size.height;
        this.setUniform(this.shift,this.shiftArr);
        //this.setUniform(this.inputSize,size.toArray());
        super.doFilter(destFrameBuffer);
    }



}
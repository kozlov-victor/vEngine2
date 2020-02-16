import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {Game} from "@engine/core/game";

// http://evanw.github.io/webgl-filter/

export class MotionBlurFilter extends AbstractGlFilter {

    private readonly center:string;
    private readonly strength:string;
    private readonly texSize:string;

    private centerArr:[number,number] = [0,0];

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.strength = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'strength');
        this.center = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'center');
        this.texSize = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC2,'texSize');


        //language=GLSL
        programGen.appendFragmentCodeBlock(`
            float rand(vec2 co){
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }
        `);
        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
            void main() {
                vec2 texCoord = v_texCoord;
                vec4 color=vec4(0.0);
                float total=0.0;
                vec2 toCenter=center-texCoord*texSize;
                float offset=rand(texCoord);
                for(float t=0.0;t<=40.0;t++) {
                    float percent=(t+offset)/40.0;
                    float weight=4.0*(percent-percent*percent);
                    vec4 sampl=texture2D(texture,texCoord+toCenter*percent*strength/texSize);
                    sampl.rgb*=sampl.a;
                    color+=sampl*weight;
                    total+=weight;
                }
                gl_FragColor = color/total;
                gl_FragColor.rgb /= gl_FragColor.a+0.00001;
            }
        `);
        this.setStrength(0.3);
        this.setCenter(this.game.size.width/2,this.game.size.height/2);
        this.simpleRectDrawer.initProgram();
    }


    public setStrength(val:number):void{
        this.setUniform(this.strength,val);
    }

    public setCenter(x:number,y:number):void{
        this.centerArr[0] = x;
        this.centerArr[1] = y;
        this.setUniform(this.center,this.centerArr);
    }



    public doFilter(destFrameBuffer:FrameBuffer):void{
        const sizeArr:[number,number] = this.simpleRectDrawer.getAttachedTextureAt(0).size.toArray();
        this.setUniform(this.texSize,sizeArr);
        super.doFilter(destFrameBuffer);
    }


}

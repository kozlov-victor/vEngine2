import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Game} from "@engine/core/game";

// https://prideout.net/barrel-distortion


export class SimpleBlurFilter extends AbstractGlFilter {


    private readonly blurSize:string;

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectPainter.gen;

        this.blurSize = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'blurSize');

        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`

            void main(){
                vec4 sum = vec4(0.0);
                vec4 substract = vec4(0,0,0,0);
                float alpha = texture2D(texture,v_texCoord).a;

                sum += texture2D(texture, v_texCoord - 4.0 * blurSize) * 0.05;
                sum += texture2D(texture, v_texCoord - 3.0 * blurSize) * 0.09;
                sum += texture2D(texture, v_texCoord - 2.0 * blurSize) * 0.12;
                sum += texture2D(texture, v_texCoord - 1.0 * blurSize) * 0.15;
                sum += texture2D(texture, v_texCoord                 ) * 0.16;
                sum += texture2D(texture, v_texCoord + 1.0 * blurSize) * 0.15;
                sum += texture2D(texture, v_texCoord + 2.0 * blurSize) * 0.12;
                sum += texture2D(texture, v_texCoord + 3.0 * blurSize) * 0.09;
                sum += texture2D(texture, v_texCoord + 4.0 * blurSize) * 0.05;

                vec4 temp = vec4(0,0,0,0);
                temp = (sum - substract);
                gl_FragColor = temp;
            }
            `
        );
        this.simpleRectPainter.initProgram();
        this.setSize(0.005);
    }


    public setSize(val:number):void { //0...1
        this.setUniform(this.blurSize,val);
    }


    public override doFilter(destFrameBuffer:FrameBuffer):void{
        super.doFilter(destFrameBuffer);
    }

}

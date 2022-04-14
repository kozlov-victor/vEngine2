import {AbstractGlFilter} from "../abstract/abstractGlFilter";
import {ShaderGenerator} from "../../shaderGenerator/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Game} from "@engine/core/game";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {ITexture} from "@engine/renderer/common/texture";

export class AlphaMaskFilter extends AbstractGlFilter{

    private readonly maskTexture:string;

    constructor(game:Game,private maskTextureGl:ITexture){
        super(game);

        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        this.maskTexture = programGen.addScalarFragmentUniform(GL_TYPE.SAMPLER_2D,'maskTexture');
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                vec4 alfaTextureColor = texture2D(maskTexture, v_texCoord);
                vec4 origColor = texture2D(texture, v_texCoord);
                float a = alfaTextureColor.r;
                gl_FragColor = origColor*a;
                gl_FragColor.a = a;
            }
        `);
        this.simpleRectPainter.initProgram();
    }

    public override doFilter(destFrameBuffer: FrameBuffer):void {
        this.simpleRectPainter.attachTexture(this.maskTexture,this.maskTextureGl as Texture);
        super.doFilter(destFrameBuffer);
    }

}

import {AbstractGlFilter} from "../abstract/abstractGlFilter";
import {ShaderGenerator} from "../../shaderGenerator/shaderGenerator";
import {GL_TYPE} from "../../base/program/shaderProgramUtils";
import {Game} from "@engine/core/game";
import {ITexture} from "@engine/renderer/common/texture";
import {Texture} from "@engine/renderer/webGl/base/texture/texture";
import {FrameBuffer} from "@engine/renderer/webGl/base/buffer/frameBuffer";

export class PalletOffsetFilter extends AbstractGlFilter{

    private readonly palletTexture:string;
    private readonly palletTextureWidth:string;
    private readonly palletOffset:string;

    private palletTextureGl:Texture;

    constructor(game:Game,pallet:ITexture){
        super(game);

        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        this.palletTexture = programGen.addScalarFragmentUniform(GL_TYPE.SAMPLER_2D,'palletTexture');
        this.palletTextureWidth = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'palletTextureWidth');
        this.palletOffset = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'palletOffset');
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                vec4 col = texture2D(texture, v_texCoord);
                float palletPoint = mod(col.r * palletTextureWidth + palletOffset,palletTextureWidth);
                float palletPointRelative = palletPoint/palletTextureWidth;
                gl_FragColor = texture2D(palletTexture, vec2(palletPointRelative,0.0));
                gl_FragColor.rgb*=col.a;
                gl_FragColor.a = col.a;
            }
        `);
        this.setPalletOffset(0);
        this.setPalletTexture(pallet as Texture);
        this.setUniform(this.palletTextureWidth,pallet.size.width);
        this.simpleRectPainter.initProgram();
    }

    public setPalletOffset(n:number):this { // 0 - txWidth
        this.setUniform(this.palletOffset,n);
        return this;
    }

    public setPalletTexture(tx:Texture):this {
        this.palletTextureGl = tx;
        return this;
    }

    public override doFilter(destFrameBuffer: FrameBuffer):void {
        this.simpleRectPainter.attachTexture(this.palletTexture,this.palletTextureGl);
        super.doFilter(destFrameBuffer);
    }
}

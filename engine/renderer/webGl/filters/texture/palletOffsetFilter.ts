import {AbstractFilter} from "../abstract/abstractFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Game} from "@engine/core/game";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {ITexture} from "@engine/renderer/common/texture";
import {Int} from "@engine/core/declarations";

export class PalletOffsetFilter extends AbstractFilter{

    private readonly palletTexture:string;
    private readonly palletTextureWidth:string;
    private readonly palletOffset:string;

    private palletTextureGl:Texture;

    constructor(game:Game,pallet:ITexture){
        super(game);

        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.palletTexture = programGen.addFragmentUniform(GL_TYPE.SAMPLER_2D,'palletTexture');
        this.palletTextureWidth = programGen.addFragmentUniform(GL_TYPE.FLOAT,'palletTextureWidth');
        this.palletOffset = programGen.addFragmentUniform(GL_TYPE.FLOAT,'palletOffset');
        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
            void main(){
                vec4 col = texture2D(texture, v_texCoord);
                float palletPoint = mod(col.r * palletTextureWidth + palletOffset,palletTextureWidth);
                float palletPointRelative = palletPoint/palletTextureWidth;
                gl_FragColor = texture2D(palletTexture, vec2(palletPointRelative,0.0));
                gl_FragColor.a = col.a;
            } 
        `);
        this.setPalletOffset(0);
        this.setPalletTexture(pallet as Texture);
        this.setUniform(this.palletTextureWidth,pallet.size.width);
        this.simpleRectDrawer.initProgram();
    }

    public setPalletOffset(n:number):void { // 0 - txWidth
        this.setUniform(this.palletOffset,n);
    }


    public doFilter(destFrameBuffer: FrameBuffer) {
        this.simpleRectDrawer.attachTexture(this.palletTexture,this.palletTextureGl);
        super.doFilter(destFrameBuffer);
    }

    private setPalletTexture(tx:Texture):void {
        this.palletTextureGl = tx;
    }
}
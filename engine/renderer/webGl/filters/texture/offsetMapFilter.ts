import {AbstractGlFilter} from "../abstract/abstractGlFilter";
import {ShaderGenerator} from "../../shaderGenerator/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Game} from "@engine/core/game";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {ITexture} from "@engine/renderer/common/texture";
import {Size} from "@engine/geometry/size";

export class OffsetMapFilter extends AbstractGlFilter{

    private readonly offsetTexture:string;
    private readonly offsetForce:string;
    private readonly pixelWidth:string;
    private readonly pixelHeight:string;

    constructor(game:Game,private offsetTextureGl:ITexture){
        super(game);

        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        this.offsetTexture = programGen.addScalarFragmentUniform(GL_TYPE.SAMPLER_2D,'offsetTexture');
        this.offsetForce = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'offsetForce');
        this.pixelWidth = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'pixelWidth');
        this.pixelHeight = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'pixelHeight');
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                float offsetPointX = texture2D(offsetTexture, v_texCoord).r - texture2D(offsetTexture, v_texCoord - vec2(v_texCoord.x - pixelWidth,v_texCoord.y)).r/2.;
                float offsetPointY = texture2D(offsetTexture, v_texCoord).r - texture2D(offsetTexture, v_texCoord - vec2(v_texCoord.x,v_texCoord.y - pixelHeight)).r/2.;
                offsetPointX*=offsetForce;
                offsetPointY*=offsetForce;
                vec2 pixelWithOffsetPoint = v_texCoord + vec2(offsetPointX,offsetPointY);
                gl_FragColor = texture2D(texture, pixelWithOffsetPoint);
                vec4 origColor = texture2D(texture, v_texCoord);
                gl_FragColor.a = origColor.a;
            }
        `);
        this.simpleRectPainter.initProgram();
        this.setForce(0.05);
    }

    public override doFilter(destFrameBuffer: FrameBuffer):void {
        this.simpleRectPainter.attachTexture(this.offsetTexture,this.offsetTextureGl as Texture);
        const size:Size = this.simpleRectPainter.getAttachedTextureAt(0).size;
        this.setUniform(this.pixelWidth,1/size.width);
        this.setUniform(this.pixelHeight,1/size.height);
        super.doFilter(destFrameBuffer);
    }

    private setForce(val:number):void {
        this.setUniform(this.offsetForce,val); // -infinity..infinity
    }
}

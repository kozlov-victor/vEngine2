
// http://www.geeks3d.com/20101029/shader-library-pixelation-post-processing-effect-glsl/
// adopted to webGl ES

import {AbstractGlFilter} from "../abstract/abstractGlFilter";
import {ShaderGenerator} from "../../shaderGenerator/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {FrameBuffer} from "../../base/frameBuffer";
import {Game} from "@engine/core/game";
import {Size} from "@engine/geometry/size";

export class PixelFilter extends AbstractGlFilter {

    private readonly rt_w:string;
    private readonly rt_h:string;
    private readonly pixel_w:string;
    private readonly pixel_h:string;

    constructor(game:Game) {
        super(game);

        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        this.rt_w = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        this.rt_h = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        this.pixel_w = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'pixel_w');
        this.pixel_h = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'pixel_h');
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                vec2 uv = v_texCoord.xy;
                float dx = pixel_w*(1./rt_w);
                float dy = pixel_h*(1./rt_h);
                vec2 coord = vec2(dx*floor(uv.x/dx),
                                  dy*floor(uv.y/dy));
                gl_FragColor = texture2D(texture, coord);
            }
            `
        );
        this.setPixelSize(5);
        this.simpleRectPainter.initProgram();
    }


    public setPixelWidth(n:number):void{
        this.setUniform(this.pixel_w,n);
    }

    public setPixelHeight(n:number):void{
        this.setUniform(this.pixel_h,n);
    }

    public setPixelSize(n:number):void {
        this.setPixelWidth(n);
        this.setPixelHeight(n);
    }

    public override doFilter(destFrameBuffer:FrameBuffer):void{
        const size:Size = this.simpleRectPainter.getAttachedTextureAt(0).size;
        this.setUniform(this.rt_w,size.width);
        this.setUniform(this.rt_h,size.height);
        super.doFilter(destFrameBuffer);
    }


}

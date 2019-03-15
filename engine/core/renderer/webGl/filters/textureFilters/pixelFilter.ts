
// http://www.geeks3d.com/20101029/shader-library-pixelation-post-processing-effect-glsl/
// adopted to webGl ES

import {AbstractFilter} from "../abstract/abstractFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {FrameBuffer} from "../../base/frameBuffer";
import {TextureInfo} from "../../programs/abstract/abstractDrawer";

export class PixelFilter extends AbstractFilter {

    private readonly rt_w:string;
    private readonly rt_h:string;
    private readonly pixel_w:string;
    private readonly pixel_h:string;

    constructor(gl: WebGLRenderingContext) {
        super(gl);
        this.simpleRectDrawer.prepareShaderGenerator();

        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.rt_w = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        this.rt_h = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        this.pixel_w = programGen.addFragmentUniform(GL_TYPE.FLOAT,'pixel_w');
        this.pixel_h = programGen.addFragmentUniform(GL_TYPE.FLOAT,'pixel_h');
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
        this.simpleRectDrawer.initProgram();
        this.setPixelSize(5);
    }


    doFilter(textureInfos:TextureInfo[],destFrameBuffer:FrameBuffer){
        this.setUniform(this.rt_w,textureInfos[0].texture.size.width);
        this.setUniform(this.rt_h,textureInfos[0].texture.size.height);
        super.doFilter(textureInfos,destFrameBuffer);
    }

    setPixelWidth(n:number){
        this.setUniform(this.pixel_w,n);
    }

    setPixelHeight(n:number){
        this.setUniform(this.pixel_h,n);
    }

    setPixelSize(n:number) {
        this.setPixelWidth(n);
        this.setPixelHeight(n);
    }

}
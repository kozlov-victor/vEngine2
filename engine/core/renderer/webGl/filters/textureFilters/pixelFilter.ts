
// http://www.geeks3d.com/20101029/shader-library-pixelation-post-processing-effect-glsl/
// adopted to webGl ES

import {AbstractFilter} from "../abstract/abstractFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Texture} from "../../base/texture";
import {FrameBuffer} from "../../base/frameBuffer";
import {TextureInfo} from "../../renderPrograms/abstract/abstractDrawer";

export class PixelFilter extends AbstractFilter {

    constructor(gl: WebGLRenderingContext) {
        super(gl);
    }

    prepare(programGen:ShaderGenerator){
        programGen.addFragmentUniform(GL_TYPE.FLOAT,' rt_w'); // render target width
        programGen.addFragmentUniform(GL_TYPE.FLOAT,' rt_h'); // render target height
        programGen.addFragmentUniform(GL_TYPE.FLOAT,' pixel_w');
        programGen.addFragmentUniform(GL_TYPE.FLOAT,' pixel_h');
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                vec2 uv = v_texCoord.xy;
                vec3 tc = vec3(1.0, 0.0, 0.0);
                float dx = pixel_w*(1./rt_w);
                float dy = pixel_h*(1./rt_h);
                vec2 coord = vec2(dx*floor(uv.x/dx),
                                  dy*floor(uv.y/dy));
                tc = texture2D(texture, coord).rgb;
                gl_FragColor = vec4(tc, 1.0);
            }
            `
        );
        this.setPixelSize(5);

    }

    doFilter(textureInfos:TextureInfo[],destFrameBuffer:FrameBuffer){
        this.setParam('rt_w',textureInfos[0].texture.size.width);
        this.setParam('rt_h',textureInfos[0].texture.size.height);
        super.doFilter(textureInfos,destFrameBuffer);
    }

    setPixelWidth(n:number){
        this.setParam('pixel_w',n);
    }

    setPixelHeight(n:number){
        this.setParam('pixel_h',n);
    }

    setPixelSize(n:number) {
        this.setPixelWidth(n);
        this.setPixelHeight(n);
    }

}
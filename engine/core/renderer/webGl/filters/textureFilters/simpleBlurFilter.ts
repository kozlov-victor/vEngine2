//https://github.com/Jam3/glsl-fast-gaussian-blur/blob/master/5.glsl

import {AbstractFilter} from "../abstract/abstractFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Texture} from "../../base/texture";
import {FrameBuffer} from "../../base/frameBuffer";
import {TextureInfo} from "../../renderPrograms/abstract/abstractDrawer";

export class SimpleBlurFilter extends AbstractFilter {

    constructor(gl: WebGLRenderingContext) {
        super(gl);
    }

    prepare(programGen:ShaderGenerator){
        programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        programGen.addFragmentUniform(GL_TYPE.FLOAT_VEC2,' u_direction'); // render target height
        //language=GLSL
        programGen.appendFragmentCodeBlock(`
              vec4 blur(vec2 uv) {
                  vec4 color = vec4(0.0);
                  vec2 resolution = vec2(rt_w,rt_h);
                  vec2 off1 = vec2(1.3846153846) * u_direction;
                  vec2 off2 = vec2(3.2307692308) * u_direction;
                  color += texture2D(texture, uv) * 0.2270270270;
                  color += texture2D(texture, uv + (off1 / resolution)) * 0.3162162162;
                  color += texture2D(texture, uv - (off1 / resolution)) * 0.3162162162;
                  color += texture2D(texture, uv + (off2 / resolution)) * 0.0702702703;
                  color += texture2D(texture, uv - (off2 / resolution)) * 0.0702702703;
                  return color;
              }
        `);
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                vec2 uv = vec2(gl_FragCoord.xy / vec2(rt_w,rt_h));
                gl_FragColor = blur(uv);
            }
            `
        );
        this.setParam("u_direction",[0.5,0.5]);
    }

    doFilter(textureInfos:TextureInfo[],destFrameBuffer:FrameBuffer){
        this.setParam('rt_w',textureInfos[0].texture.size.width);
        this.setParam('rt_h',textureInfos[0].texture.size.height);
        super.doFilter(textureInfos,destFrameBuffer);
    }

}
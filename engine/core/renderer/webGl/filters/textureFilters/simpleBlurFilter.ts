//https://github.com/Jam3/glsl-fast-gaussian-blur/blob/master/5.glsl

import {AbstractFilter} from "../abstract/abstractFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {FrameBuffer} from "../../base/frameBuffer";
import {TextureInfo} from "../../programs/abstract/abstractDrawer";

export class SimpleBlurFilter extends AbstractFilter {

    rt_w:string;
    rt_h:string;
    u_direction_x:string;
    u_direction_y:string;

    constructor(gl: WebGLRenderingContext) {
        super(gl);
        this.spriteRectDrawer.prepareShaderGenerator();
        const programGen:ShaderGenerator = this.spriteRectDrawer.gen;
        this.rt_w = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        this.rt_h = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        this.u_direction_x = programGen.addFragmentUniform(GL_TYPE.FLOAT,' u_direction_x');
        this.u_direction_y = programGen.addFragmentUniform(GL_TYPE.FLOAT,' u_direction_y');

        //language=GLSL
        programGen.appendFragmentCodeBlock(`
              vec4 blur(vec2 uv) {
                  vec4 color = vec4(0.0);
                  vec2 resolution = vec2(rt_w,rt_h);
                  vec2 direction = vec2(u_direction_x,u_direction_y);
                  vec2 off1 = vec2(1.3846153846) * direction;
                  vec2 off2 = vec2(3.2307692308) * direction;
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
        this.spriteRectDrawer.initProgram();
        this.setSize(0.5);
    }


    doFilter(textureInfos:TextureInfo[],destFrameBuffer:FrameBuffer){
        this.setUniform(this.rt_w,textureInfos[0].texture.size.width);
        this.setUniform(this.rt_h,textureInfos[0].texture.size.height);
        super.doFilter(textureInfos,destFrameBuffer);
    }

    setSize(n:number){
        this.setWidth(n);
        this.setHeight(n);
    }

    setWidth(n:number){
        this.setUniform(this.u_direction_x,n);
    }

    setHeight(n:number){
        this.setUniform(this.u_direction_y,n);
    }

}
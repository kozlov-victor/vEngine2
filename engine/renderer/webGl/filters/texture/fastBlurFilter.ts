//https://github.com/Jam3/glsl-fast-gaussian-blur/blob/master/5.glsl

import {AbstractGlFilter} from "../abstract/abstractGlFilter";
import {ShaderGenerator} from "../../shaderGenerator/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {FrameBuffer} from "../../base/frameBuffer";
import {Game} from "@engine/core/game";

export class FastBlurFilter extends AbstractGlFilter {

    private readonly rt_w:string;
    private readonly rt_h:string;
    private readonly u_direction_x:string;
    private readonly u_direction_y:string;

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        this.rt_w = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        this.rt_h = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        this.u_direction_x = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_direction_x');
        this.u_direction_y = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_direction_y');

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
        this.setSize(0.5);
        this.simpleRectPainter.initProgram();
    }


    public override doFilter(destFrameBuffer:FrameBuffer):void{
        const {width,height} = this.simpleRectPainter.getAttachedTextureAt(0).size;
        this.setUniform(this.rt_w,width);
        this.setUniform(this.rt_h,height);
        super.doFilter(destFrameBuffer);
    }

    public setSize(n:number):void{
        this.setWidth(n);
        this.setHeight(n);
    }

    public setWidth(n:number):void{
        this.setUniform(this.u_direction_x,n);
    }

    public setHeight(n:number):void{
        this.setUniform(this.u_direction_y,n);
    }

}

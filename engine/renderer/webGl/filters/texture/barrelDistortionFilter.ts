import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/program/shaderProgramUtils";
import {Game} from "@engine/core/game";
import {FrameBuffer} from "@engine/renderer/webGl/base/buffer/frameBuffer";

// https://clemz.io/article-retro-shaders-webgl.html


export class BarrelDistortionFilter extends AbstractGlFilter {

    private readonly rt_w:string;
    private readonly rt_h:string;
    private readonly u_distortion:string;

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        this.rt_w = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        this.rt_h = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        this.u_distortion = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_distortion');

        //language=GLSL
        programGen.appendFragmentCodeBlock(`
            vec4 barrel(vec2 uv) {
                vec2 pos = uv;
                pos -= vec2(0.5, 0.5);
                pos *= vec2(pow(length(pos), u_distortion));
                pos += vec2(0.5, 0.5);
                return texture2D(texture, pos);
            }
        `);
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                vec2 uv = vec2(gl_FragCoord.xy / vec2(rt_w,rt_h));
                gl_FragColor = barrel(uv);
            }
            `
        );
        this.setDistortion(0.1);
        this.simpleRectPainter.initProgram();
    }

    public setDistortion(val:number):this{
        this.setUniform(this.u_distortion,val);
        return this;
    }

    public override doFilter(destFrameBuffer:FrameBuffer):void{
        const {width,height} = this.simpleRectPainter.getAttachedTextureAt(0).size;
        this.setUniform(this.rt_w,width);
        this.setUniform(this.rt_h,height);
        super.doFilter(destFrameBuffer);
    }

}

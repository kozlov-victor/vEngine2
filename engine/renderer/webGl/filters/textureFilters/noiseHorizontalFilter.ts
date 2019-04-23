import {AbstractFilter} from "@engine/renderer/webGl/filters/abstract/abstractFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Game} from "@engine/game";
import {Size} from "@engine/geometry/size";

// https://clemz.io/article-retro-shaders-webgl.html

export class NoiseHorizontalFilter extends AbstractFilter {

    private readonly rt_w:string;
    private readonly rt_h:string;
    private readonly u_time:string;

    private time:number = 0;

    constructor(game:Game) {
        super(game);
        this.simpleRectDrawer.prepareShaderGenerator();
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.rt_w = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        this.rt_h = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        this.u_time = programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_time');

        //language=GLSL
        programGen.appendFragmentCodeBlock(`            
            vec4 noise(vec2 uv) {
                vec3 color = texture2D(texture, uv).rgb;
                color -= abs(sin(uv.y * 100.0 + u_time * 5.0)) * 0.08; 
                color -= abs(sin(uv.y * 300.0 - u_time * 10.0)) * 0.05;
                return vec4(color, 1.0).rgba;
            }
        `);
        //language=GLSL
        programGen.setFragmentMainFn(`
                void main(){
                    vec2 uv = vec2(gl_FragCoord.xy / vec2(rt_w,rt_h));
                    gl_FragColor = noise(uv);
                }
            `
        );
        this.simpleRectDrawer.initProgram();
    }


    doFilter(destFrameBuffer:FrameBuffer):void{
        const size:Size = this.simpleRectDrawer.getAttachedTextureAt(0).size;
        this.setUniform(this.rt_w,size.width);
        this.setUniform(this.rt_h,size.height);
        this.setUniform(this.u_time,this.time+=0.01);
        super.doFilter(destFrameBuffer);
    }

}
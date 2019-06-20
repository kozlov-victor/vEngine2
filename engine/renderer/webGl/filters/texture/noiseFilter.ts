import {AbstractFilter} from "@engine/renderer/webGl/filters/abstract/abstractFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Game} from "@engine/game";
import {Size} from "@engine/geometry/size";

// https://clemz.io/article-retro-shaders-webgl.html

export class NoiseFilter extends AbstractFilter {

    private readonly rt_w:string;
    private readonly rt_h:string;
    private readonly u_time:string;
    private readonly u_noise_intensity:string;

    private time:number = 0;

    constructor(game:Game) {
        super(game);
        this.simpleRectDrawer.prepareShaderGenerator();
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.rt_w = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_w'); // render target width
        this.rt_h = programGen.addFragmentUniform(GL_TYPE.FLOAT,'rt_h'); // render target height
        this.u_time = programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_time');
        this.u_noise_intensity = programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_noise_intensity');

        //language=GLSL
        programGen.appendFragmentCodeBlock(`
            float rand(vec2 co){
                return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }
            vec4 noise(vec2 uv) {
                vec4 colorOrig = texture2D(texture, uv);
                vec3 color = texture2D(texture, uv).rgb;

                // Random number.
                vec2 pos = uv;
                pos *= sin(u_time);
                float r = rand(pos);

                // Noise color using random number.
                vec3 noise = vec3(r);

                // Combined colors.
                color = mix(color, noise, u_noise_intensity);

                return vec4(color, colorOrig.a);
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
        this.setIntensivity(0.1);

    }


    public setIntensivity(val:number):void{
       this.setUniform(this.u_noise_intensity,val);
    }


    public doFilter(destFrameBuffer:FrameBuffer):void{
        const size:Size = this.simpleRectDrawer.getAttachedTextureAt(0).size;
        this.setUniform(this.rt_w,size.width);
        this.setUniform(this.rt_h,size.height);
        this.setUniform(this.u_time,this.time+=0.01);
        super.doFilter(destFrameBuffer);
    }

}
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Game} from "@engine/core/game";
import {Size} from "@engine/geometry/size";

export class NoiseFilter extends AbstractGlFilter {

    private readonly u_time:string;
    private readonly u_noise_intensity:string;

    private time:number = 0;

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.u_time = programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_time');
        this.u_noise_intensity = programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_noise_intensity');

        //language=GLSL
        programGen.appendFragmentCodeBlock(MACRO_GL_COMPRESS`
            float rand(vec2 st) {
                return fract(sin(dot(st, vec2(12.9898 + sin(u_time),78.233)))*43758.5453123);
            }
            vec3 noise() {
                vec3 color = texture2D(texture, v_texCoord).rgb;
                color -= vec3(rand(gl_FragCoord.xy))*u_noise_intensity;
                return color;
            }
        `);
        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
            void main(){
                gl_FragColor.rgb = noise();
                vec4 colorOrig = texture2D(texture, v_texCoord);
                gl_FragColor.a = colorOrig.a;
            }
            `
        );
        this.setIntensivity(0.1);
        this.simpleRectDrawer.initProgram();

    }


    public setIntensivity(val:number):void{
       this.setUniform(this.u_noise_intensity,val);
    }


    public doFilter(destFrameBuffer:FrameBuffer):void{
        this.setUniform(this.u_time,this.time+=0.01);
        super.doFilter(destFrameBuffer);
    }

}
import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Game} from "@engine/core/game";

export class NoiseFilter extends AbstractGlFilter {

    private readonly u_time:string;
    private readonly u_noise_intensity:string;

    private time:number = 0;

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.u_time = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_time');
        this.u_noise_intensity = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_noise_intensity');

        //language=GLSL
        programGen.appendFragmentCodeBlock(MACRO_GL_COMPRESS`
            float PHI = 1.61803398874989484820459;  // Φ = Golden Ratio
            float rand(vec2 xy,float seed) {
                return fract(tan(distance(xy*PHI, xy)*seed)*xy.x);
            }
            vec3 noise() {
                vec3 color = texture2D(texture, v_texCoord).rgb;
                color -= vec3(rand(gl_FragCoord.xy,u_time))*u_noise_intensity;
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

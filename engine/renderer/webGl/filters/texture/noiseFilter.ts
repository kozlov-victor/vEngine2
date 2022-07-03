import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {FrameBuffer} from "@engine/renderer/webGl/base/frameBuffer";
import {Game} from "@engine/core/game";

export class NoiseFilter extends AbstractGlFilter {

    private readonly u_time:string;
    private readonly u_noise_intensity:string;

    private time:number = 0;

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        this.u_time = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_time');
        this.u_noise_intensity = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_noise_intensity');

        //language=GLSL
        programGen.appendFragmentCodeBlock(`
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
        programGen.setFragmentMainFn(`
            void main(){
                gl_FragColor.rgb = noise();
                vec4 colorOrig = texture2D(texture, v_texCoord);
                gl_FragColor.a = colorOrig.a;
            }
            `
        );
        this.setIntensivity(0.1);
        this.simpleRectPainter.initProgram();

    }


    public setIntensivity(val:number):this{
       this.setUniform(this.u_noise_intensity,val);
       return this;
    }


    public override doFilter(destFrameBuffer:FrameBuffer):void{
        this.time+=0.01;
        if (this.time>100) this.time = 0;
        this.setUniform(this.u_time,this.time);
        super.doFilter(destFrameBuffer);
    }

}

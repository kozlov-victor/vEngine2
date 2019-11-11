
import {AbstractFilter} from "../abstract/abstractFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {FrameBuffer} from "../../base/frameBuffer";
import {Game} from "@engine/core/game";

export class WaveFilter extends AbstractFilter {

    private readonly u_time:string;
    private readonly u_amplitude:string;
    private readonly u_frequency:string;
    private time:number = 0;

    constructor(game:Game) {
        super(game);

        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
                    const float PI_MULT_2 = 2.0*3.14;
                    void main(){
                        float numOfPointsPassed = v_texCoord.y*v_texCoord.x + v_texCoord.x;
                        float offsetX = u_amplitude*cos((PI_MULT_2*u_frequency)*(u_time+numOfPointsPassed));
                        float offsetY = u_amplitude*sin((PI_MULT_2*u_frequency)*(u_time+numOfPointsPassed));
                        vec2 pos = v_texCoord + vec2(offsetX, offsetY);
                        gl_FragColor = texture2D(texture, pos);
                    }
            `
        );
        this.u_time = programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_time');
        this.u_amplitude = programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_amplitude');
        this.u_frequency = programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_frequency');
        this.setFrequency(1.5);
        this.setAmplitude(0.001);
        this.simpleRectDrawer.initProgram();
    }

    public setFrequency(val:number):void{
        this.setUniform(this.u_frequency,val);
    }

    public setAmplitude(val:number):void{
        this.setUniform(this.u_amplitude,val);
    }


    public doFilter(destFrameBuffer:FrameBuffer):void{
        this.setUniform(this.u_time,this.time+=0.01);
        super.doFilter(destFrameBuffer);
    }


}
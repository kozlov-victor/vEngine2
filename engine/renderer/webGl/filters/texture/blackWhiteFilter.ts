import {AbstractGlFilter} from "../abstract/abstractGlFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Game} from "@engine/core/game";

export class BlackWhiteFilter extends AbstractGlFilter{

    private readonly u_mixFactor:string;

    constructor(game:Game){
        super(game);

        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.u_mixFactor = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_mixFactor');
        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
            void main(){
                vec4 col = texture2D(texture, v_texCoord);
                float avg = (col.r+col.g+col.b)/3.0;
                vec4 bw = vec4(avg);
                vec4 result = mix(col,bw,vec4(u_mixFactor));
                result = vec4(result.rbg, col.a);
                gl_FragColor = result;
            } 
        `);
        this.setMixFactor(0.8);
        this.simpleRectDrawer.initProgram();
    }

    public setMixFactor(n:number):void {
        this.setUniform(this.u_mixFactor,n);
    }

}

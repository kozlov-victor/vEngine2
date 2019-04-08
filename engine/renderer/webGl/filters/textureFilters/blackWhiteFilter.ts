import {AbstractFilter} from "../abstract/abstractFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";
import {Game} from "@engine/game";

export class BlackWhiteFilter extends AbstractFilter{

    private readonly u_mixFactor:string;

    constructor(game:Game){
        super(game);
        this.simpleRectDrawer.prepareShaderGenerator();

        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        this.u_mixFactor = programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_mixFactor');
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                vec4 col = texture2D(texture, v_texCoord);
                float avg = (col.r+col.g+col.b)/3.0;
                vec4 bw = vec4(avg);
                vec4 result = mix(col,bw,vec4(u_mixFactor));
                result = vec4(result.rbg, col.a);
                gl_FragColor = result;
            } 
        `);
        this.simpleRectDrawer.initProgram();
        this.setMixFactor(0.8);
    }

    setMixFactor(n:number):void {
        this.setUniform(this.u_mixFactor,n);
    }

}
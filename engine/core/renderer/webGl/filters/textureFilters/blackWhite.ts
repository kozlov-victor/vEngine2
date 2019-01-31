


import {AbstractFilter} from "../abstract/abstractFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";

export class BlackWhiteFilter extends AbstractFilter{

    constructor(gl:WebGLRenderingContext){
        super(gl);
    }

    prepare(programGen:ShaderGenerator){
        programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_mixFactor');
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                vec4 col = texture2D(texture, v_texCoord);
                float avg = (col.r+col.g+col.b)/3.0;
                vec4 bw = vec4(avg);
                vec4 result = mix(col,bw,vec4(u_mixFactor));
                result.a = 1.0;
                gl_FragColor = result;
            } 
        `);
        this.setParam('u_mixFactor',0.8);
    }

}
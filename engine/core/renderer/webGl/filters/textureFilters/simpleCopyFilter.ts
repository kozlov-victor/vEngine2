
// this filter needs to copy texture to framebuffer

import {AbstractFilter} from "../abstract/abstractFilter";
import {ShaderGenerator} from "../../shaders/generators/shaderGenerator";
import {GL_TYPE} from "../../base/shaderProgramUtils";

export class SimpleCopyFilter extends AbstractFilter{

    constructor(gl:WebGLRenderingContext){
        super(gl);
    }

    prepare(programGen:ShaderGenerator){
        programGen.addFragmentUniform(GL_TYPE.FLOAT,'u_mixFactor');
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                gl_FragColor = texture2D(texture, v_texCoord);
            }
        `);
    }

}

import {GL_TYPE} from '../../../base/shaderProgramUtils'
import {ShaderGenerator} from '../shaderGenerator'

//position and color
export class ColorShaderGenerator extends ShaderGenerator{ // todo is used???

    constructor(){
        super();
        this.addAttribute(GL_TYPE.FLOAT_VEC4,'a_position');
        this.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_vertexMatrix');
        //language=GLSL
        this.setVertexMainFn(`
            void main(){
                gl_Position = u_vertexMatrix * a_position;   
            }
        `);
        this.addFragmentUniform(GL_TYPE.FLOAT,'u_alpha');
        this.addFragmentUniform(GL_TYPE.FLOAT_VEC4,'u_rgba');
        //language=GLSL
        this.setFragmentMainFn(`
            void main(){
                gl_FragColor = u_rgba;
            }
        `);
    }

}
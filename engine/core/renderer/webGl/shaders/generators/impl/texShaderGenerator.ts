
import {GL_TYPE} from '../../../base/shaderProgramUtils'
import {ShaderGenerator} from '../shaderGenerator'

//position and texture
export  class TexShaderGenerator extends ShaderGenerator{

    constructor(){
        super();
        this.addAttribute(GL_TYPE.FLOAT_VEC4,'a_position');
        this.addAttribute(GL_TYPE.FLOAT_VEC2,'a_texCoord');
        this.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_vertexMatrix');
        this.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_textureMatrix');
        this.addVarying(GL_TYPE.FLOAT_VEC2,'v_texCoord');
        //language=GLSL
        this.prependFragmentCodeBlock(`
            vec4 tint(vec4 srcColor,vec4 tintColor){
                vec3 r = vec3(srcColor) * (1.0 - tintColor.a) +
                    vec3(tintColor) * tintColor.a;
                vec4 result = vec4(r,srcColor.a);
                return result;    
            }
        `);
        //language=GLSL
        this.setVertexMainFn(`
            void main(){
                gl_Position = u_vertexMatrix * a_position;
                v_texCoord = (u_textureMatrix * vec4(a_texCoord, 0, 1)).xy;
            } 
        `);
        this.addFragmentUniform(GL_TYPE.SAMPLER_2D,'texture');
        this.addFragmentUniform(GL_TYPE.FLOAT,'u_alpha');
        //language=GLSL
        this.setFragmentMainFn(`
            void main(){
                gl_FragColor = texture2D(texture, v_texCoord);
                gl_FragColor.a *= u_alpha;
            }
        `);
    }

}
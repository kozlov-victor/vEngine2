


import {Plane} from '../../../primitives/plane'
import {ShaderProgram} from '../../../base/shaderProgram'
import {AbstractDrawer} from "../../abstract/abstractDrawer";
import {BufferInfo, BufferInfoDescription} from "../../../base/bufferInfo";
import {TexShaderGenerator} from "../../../shaders/generators/impl/texShaderGenerator";
import {ShaderGenerator} from "@engine/core/renderer/webGl/shaders/generators/shaderGenerator";
import {GL_TYPE} from "@engine/core/renderer/webGl/base/shaderProgramUtils";

export class SimpleRectDrawer extends AbstractDrawer { // todo delete

    a_position:string;

    constructor(gl:WebGLRenderingContext,program?:ShaderProgram) {
        super(gl);


        let gen:ShaderGenerator = new ShaderGenerator();
        this.a_position = gen.addAttribute(GL_TYPE.FLOAT_VEC4,'a_position');
        gen.addAttribute(GL_TYPE.FLOAT_VEC2,'a_texCoord');
        gen.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_vertexMatrix');
        gen.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_textureMatrix');
        gen.addVarying(GL_TYPE.FLOAT_VEC2,'v_texCoord');
        //language=GLSL
        gen.prependFragmentCodeBlock(`
            vec4 tint(vec4 srcColor,vec4 tintColor){
                vec3 r = vec3(srcColor) * (1.0 - tintColor.a) +
                    vec3(tintColor) * tintColor.a;
                vec4 result = vec4(r,srcColor.a);
                return result;    
            }
        `);
        //language=GLSL
        gen.setVertexMainFn(`
            void main(){
                gl_Position = u_vertexMatrix * a_position;
                v_texCoord = (u_textureMatrix * vec4(a_texCoord, 0, 1)).xy;
            } 
        `);
        gen.addFragmentUniform(GL_TYPE.SAMPLER_2D,'texture');
        gen.addFragmentUniform(GL_TYPE.FLOAT,'u_alpha');
        //language=GLSL
        gen.setFragmentMainFn(`
            void main(){
                gl_FragColor = texture2D(texture, v_texCoord);
                gl_FragColor.a *= u_alpha;
            }
        `);


        this.primitive = new Plane();
        this.program = new ShaderProgram(
            gl,
            gen.getVertexSource(),
            gen.getFragmentSource()
        );
        this.bufferInfo = new BufferInfo(gl, {
            posVertexInfo: {array: this.primitive.vertexArr, type: gl.FLOAT, size: 2, attrName: 'a_position'},
            posIndexInfo: {array: this.primitive.indexArr},
            texVertexInfo: {array: this.primitive.texCoordArr, type: gl.FLOAT, size: 2, attrName: 'a_texCoord'},
            drawMethod: this.gl.TRIANGLE_STRIP
        } as BufferInfoDescription);
    }


}
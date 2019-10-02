import {Plane} from "../../../../primitives/plane";
import {ShaderProgram} from "../../../../base/shaderProgram";
import {AbstractDrawer} from "../../../abstract/abstractDrawer";
import {BufferInfo, DRAW_METHOD, IBufferInfoDescription} from "../../../../base/bufferInfo";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {DebugError} from "@engine/debug/debugError";


export class SimpleRectDrawer extends AbstractDrawer {

    /**
     * @internal
     */
    public gen:ShaderGenerator;

    public a_position:string;
    public a_texCoord:string;
    public u_vertexMatrix:string;
    public u_textureMatrix:string;

    constructor(gl:WebGLRenderingContext) {
        super(gl);
    }

    public prepareShaderGenerator():void{
        this.gen = new ShaderGenerator();
        const gen:ShaderGenerator = this.gen;
        this.a_position = gen.addAttribute(GL_TYPE.FLOAT_VEC4,'a_position');
        this.a_texCoord = gen.addAttribute(GL_TYPE.FLOAT_VEC2,'a_texCoord');
        this.u_vertexMatrix = gen.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_vertexMatrix');
        this.u_textureMatrix = gen.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_textureMatrix');
        gen.addVarying(GL_TYPE.FLOAT_VEC2,'v_texCoord');
        //language=GLSL
        gen.setVertexMainFn(MACRO_GL_COMPRESS`            
            void main(){
                gl_Position = u_vertexMatrix * a_position;
                v_texCoord = (u_textureMatrix * vec4(a_texCoord, 0, 1)).xy;
            }
        `);
        gen.addFragmentUniform(GL_TYPE.SAMPLER_2D,'texture');
        //gen.addFragmentUniform(GL_TYPE.FLOAT,'u_alpha');
        //language=GLSL
        gen.setFragmentMainFn(MACRO_GL_COMPRESS`            
            void main(){
                gl_FragColor = texture2D(texture, v_texCoord);
            }
        `);
    }

    public initProgram():void{

        if (DEBUG) {
            if (!this.gen) throw new DebugError(
                `can not init simpleRectDrawer instance: prepareShaderGenerator method must be invoked`
            );
        }

        this.primitive = new Plane();
        this.program = new ShaderProgram(
            this.gl,
            this.gen.getVertexSource(),
            this.gen.getFragmentSource()
        );
        this.bufferInfo = new BufferInfo(this.gl, {
            posVertexInfo: {array: this.primitive.vertexArr, type: this.gl.FLOAT, size: 2, attrName: 'a_position'},
            posIndexInfo: {array: this.primitive.indexArr},
            texVertexInfo: {array: this.primitive.texCoordArr, type: this.gl.FLOAT, size: 2, attrName: 'a_texCoord'},
            drawMethod: DRAW_METHOD.TRIANGLE_STRIP
        } as IBufferInfoDescription);
    }


}
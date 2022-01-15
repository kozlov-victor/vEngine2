import {Plane} from "../../../../primitives/plane";
import {ShaderProgram} from "../../../../base/shaderProgram";
import {AbstractPainter} from "../../../abstract/abstractPainter";
import {BufferInfo, DRAW_METHOD, IBufferInfoDescription} from "../../../../base/bufferInfo";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {DebugError} from "@engine/debug/debugError";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";


export class SimpleRectPainter extends AbstractPainter {

    /**
     * @internal
     */
    public gen:ShaderGenerator;

    public readonly a_position:string;
    public readonly a_texCoord:string;
    public readonly u_vertexMatrix:string;
    public readonly u_textureMatrix:string;

    private readonly BATCH_SIZE = 1024;

    constructor(gl:WebGLRenderingContext) {
        super(gl);
        this.gen = new ShaderGenerator();
        const gen:ShaderGenerator = this.gen;
        this.a_position = gen.addAttribute(GL_TYPE.FLOAT_VEC4,'a_position');
        this.a_texCoord = gen.addAttribute(GL_TYPE.FLOAT_VEC2,'a_texCoord');
        this.u_vertexMatrix = gen.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_vertexMatrix');
        this.u_textureMatrix = gen.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_textureMatrix');
        gen.addVarying(GL_TYPE.FLOAT_VEC2,'v_texCoord');

        //language=GLSL
        gen.setVertexMainFn(`
            void main(){
                gl_Position = u_vertexMatrix * a_position;
                v_texCoord = (u_textureMatrix * vec4(a_texCoord, 0, 1)).xy;
            }
        `);
        gen.addScalarFragmentUniform(GL_TYPE.SAMPLER_2D,'texture');
        //language=GLSL
        gen.setFragmentMainFn(`
            void main(){
                gl_FragColor = texture2D(texture, v_texCoord);
            }
        `);
    }

    public initProgram():void{

        if (DEBUG) {
            if (!this.gen) throw new DebugError(
                `can not init simpleRectPainter instance: ShaderGenerator must be created`
            );
        }

        this.primitive = new Plane();
        this.program = new ShaderProgram(
            this.gl,
            this.gen.getVertexSource(),
            this.gen.getFragmentSource()
        );
        this.bufferInfo = new BufferInfo(this.gl, {
            posVertexInfo: {array: new Float32Array(this.primitive.vertexArr), type: this.gl.FLOAT, size: 2, attrName: 'a_position'},
            posIndexInfo: {array: this.primitive.indexArr},
            texVertexInfo: {array: new Float32Array(this.primitive.texCoordArr!), type: this.gl.FLOAT, size: 2, attrName: 'a_texCoord'},
            drawMethod: DRAW_METHOD.TRIANGLE_STRIP
        } as IBufferInfoDescription);
    }


}

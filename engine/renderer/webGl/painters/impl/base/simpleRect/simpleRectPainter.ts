import {Plane} from "../../../../primitives/plane";
import {ShaderProgram} from "../../../../base/program/shaderProgram";
import {AbstractPainter} from "../../../abstract/abstractPainter";
import {BufferInfo, DRAW_METHOD, IBufferInfoDescription} from "../../../../base/buffer/bufferInfo";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {DebugError} from "@engine/debug/debugError";
import {GL_TYPE} from "@engine/renderer/webGl/base/program/shaderProgramUtils";


export class SimpleRectPainter extends AbstractPainter {

    /**
     * @internal
     */
    public gen:ShaderGenerator;

    public readonly a_position:string;
    public readonly u_alpha:string;
    public readonly a_texCoord:string;
    public readonly u_flip:string;

    constructor(gl:WebGLRenderingContext) {
        super(gl);
        this.gen = new ShaderGenerator();
        const gen:ShaderGenerator = this.gen;
        this.a_position = gen.addAttribute(GL_TYPE.FLOAT_VEC4,'a_position');
        this.a_texCoord = gen.addAttribute(GL_TYPE.FLOAT_VEC2,'a_texCoord');
        this.u_alpha = gen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_alpha');
        this.u_flip = gen.addVertexUniform(GL_TYPE.BOOL,'u_flip');
        gen.addVarying(GL_TYPE.FLOAT_VEC2,'v_texCoord');

        //language=GLSL
        gen.setVertexMainFn(`
            void main(){
                gl_Position = vec4(
                    -1.0 + 2.0 * a_position.x,
                    -1.0 + 2.0 * a_position.y,
                     0.0,  1.0
                );
                float y;
                if (u_flip) y = 1.-a_texCoord.y;
                else y = a_texCoord.y;
                v_texCoord =  vec2(a_texCoord.x,y);
            }
        `);
        gen.addScalarFragmentUniform(GL_TYPE.SAMPLER_2D,'texture');
        //language=GLSL
        gen.setFragmentMainFn(`
            void main(){
                gl_FragColor = texture2D(texture, v_texCoord)*u_alpha;
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
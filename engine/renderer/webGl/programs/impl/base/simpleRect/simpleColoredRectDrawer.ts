import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {DebugError} from "@engine/debug/debugError";
import {Plane} from "@engine/renderer/webGl/primitives/plane";
import {ShaderProgram} from "@engine/renderer/webGl/base/shaderProgram";
import {BufferInfo, DRAW_METHOD, IBufferInfoDescription} from "@engine/renderer/webGl/base/bufferInfo";
import {AbstractDrawer} from "@engine/renderer/webGl/programs/abstract/abstractDrawer";

export class SimpleColoredRectDrawer extends AbstractDrawer {

    public gen:ShaderGenerator;
    public readonly u_vertexMatrix:string;
    public readonly u_color:string;
    public readonly u_alpha:string;


    constructor(gl:WebGLRenderingContext) {
        super(gl);
        this.gen = new ShaderGenerator();
        const gen:ShaderGenerator = this.gen;
        gen.addAttribute(GL_TYPE.FLOAT_VEC4,'a_position');
        this.u_vertexMatrix = gen.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_vertexMatrix');
        this.u_alpha = gen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_alpha');
        this.u_color = gen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC4,'u_color');
        //language=GLSL
        gen.setVertexMainFn(MACRO_GL_COMPRESS`
            void main(){
                gl_Position = u_vertexMatrix * a_position;
            }
        `);
        //language=GLSL
        gen.setFragmentMainFn(MACRO_GL_COMPRESS`
            void main(){
                vec4 color = vec4(
                    u_color.r*u_color.a,
                    u_color.g*u_color.a,
                    u_color.b*u_color.a,
                    u_color.a
                );
                gl_FragColor = color*u_alpha;
            }
        `);
        this.initProgram();
    }

    public initProgram():void{

        if (DEBUG) {
            if (!this.gen) throw new DebugError(
                `can not init simpleRectDrawer instance: ShaderGenerator must be created`
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
            drawMethod: DRAW_METHOD.TRIANGLE_STRIP
        } as IBufferInfoDescription);
    }

}

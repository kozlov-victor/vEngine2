import {AbstractPainter} from "@engine/renderer/webGl/painters/abstract/abstractPainter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/program/shaderProgramUtils";
    import {BufferInfo, DRAW_METHOD, IBufferInfoDescription} from "@engine/renderer/webGl/base/buffer/bufferInfo";
import {Plane} from "@engine/renderer/webGl/primitives/plane";
import {ShaderProgram} from "@engine/renderer/webGl/base/program/shaderProgram";

export class SkyBoxPainter extends AbstractPainter {

    public gen:ShaderGenerator;
    public readonly u_viewDirectionProjectionInverse:string;
    public readonly a_position:string;
    public readonly u_skybox:string;

    constructor(gl:WebGLRenderingContext) {
        super(gl);
        this.gen = new ShaderGenerator();
        const gen: ShaderGenerator = this.gen;

        this.a_position = gen.addAttribute(GL_TYPE.FLOAT_VEC4,'a_position');
        this.u_viewDirectionProjectionInverse = gen.addScalarFragmentUniform(GL_TYPE.FLOAT_MAT4,'u_viewDirectionProjectionInverse');
        this.u_skybox = gen.addScalarFragmentUniform(GL_TYPE.SAMPLER_CUBE,'u_skybox');
        gen.addVarying(GL_TYPE.FLOAT_VEC4,'v_position');

        //language=GLSL
        gen.setVertexMainFn(`
            void main() {
              vec4 pos = vec4(
                  -1.0 + 2.0 * a_position.x,
                   1.0 - 2.0 * a_position.y,
                   0.0,  1.0
              );
              v_position = pos;
              v_position.y = -pos.y;
              gl_Position = pos;
            }
        `);
        //language=GLSL
        gen.setFragmentMainFn(`
            void main() {
                vec4 t = u_viewDirectionProjectionInverse * v_position;
                gl_FragColor = textureCube(u_skybox, normalize(t.xyz / t.w));
            }
        `);

        this.program = new ShaderProgram(
            this.gl,
            this.gen.getVertexSource(),
            this.gen.getFragmentSource()
        );


        this.primitive = new Plane();

        this.bufferInfo = new BufferInfo(gl,{
            posVertexInfo:{
                array:new Float32Array(this.primitive.vertexArr),
                type:gl.FLOAT,size:2,
                attrName:this.a_position
            },
            posIndexInfo: {array: this.primitive.indexArr},
            drawMethod: DRAW_METHOD.TRIANGLE_STRIP,
        } as IBufferInfoDescription);


    }

}

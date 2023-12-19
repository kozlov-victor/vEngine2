import {AbstractPainter} from "@engine/renderer/webGl/painters/abstract/abstractPainter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/program/shaderProgramUtils";
import {Z_To_W_MATRIX_SOURCE} from "@engine/renderer/webGl/painters/misc";
import {ShaderProgram} from "@engine/renderer/webGl/base/program/shaderProgram";
import {Plane} from "@engine/renderer/webGl/primitives/plane";
import {BufferInfo, DRAW_METHOD, IBufferInfoDescription} from "@engine/renderer/webGl/base/buffer/bufferInfo";


export class SimpleImagePainter extends AbstractPainter {

    public gen:ShaderGenerator;
    public readonly a_position:string;
    public readonly u_vertexMatrix:string;
    public readonly u_projectionMatrix:string;
    public readonly u_texRect:string;
    public readonly u_color:string;
    public readonly u_alpha:string;

    constructor(gl:WebGLRenderingContext) {
        super(gl);
        this.gen = new ShaderGenerator();
        const gen:ShaderGenerator = this.gen;
        this.u_vertexMatrix = gen.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_vertexMatrix');
        this.u_projectionMatrix = gen.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_projectionMatrix');
        this.a_position = gen.addAttribute(GL_TYPE.FLOAT_VEC4,'a_position');
        this.u_alpha = gen.addScalarFragmentUniform(GL_TYPE.FLOAT,'u_alpha');
        this.u_color = gen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC4,'u_color');
        this.u_texRect = gen.addScalarFragmentUniform(GL_TYPE.FLOAT_VEC4,'u_texRect');
        gen.addScalarFragmentUniform(GL_TYPE.SAMPLER_2D,'texture');
        gen.addVarying(GL_TYPE.FLOAT_VEC4,'v_position');
        // language=glsl
        gen.prependVertexCodeBlock(`
            #define zToW_matrix mat4(${Z_To_W_MATRIX_SOURCE})
        `);
        //language=GLSL
        gen.setVertexMainFn(`
            void main(){
                v_position = a_position;
                gl_Position = zToW_matrix * u_projectionMatrix * u_vertexMatrix * a_position;
            }
        `);
        //language=GLSL
        gen.setFragmentMainFn(`

            vec4 mixTextureColorWithTint(vec4 textureCol, vec4 tint){
                return mix(textureCol,tint,tint.a)*textureCol.a;
            }

            void main(){
                float tx = u_texRect[0] + v_position.x * u_texRect[2];
                float ty = u_texRect[1] + v_position.y * u_texRect[3];
                vec4 color = texture2D(texture,vec2(tx,ty));
                color = mixTextureColorWithTint(color,u_color)*u_alpha;
                gl_FragColor = color;
            }
        `);
        this.initProgram();
    }

    private initProgram():void {
        const gl = this.gl;
        const gen = this.gen;
        this.program = new ShaderProgram(
            gl,
            gen.getVertexSource(),
            gen.getFragmentSource()
        );
        this.primitive = new Plane();

        this.bufferInfo = new BufferInfo(gl,{
            posVertexInfo:{array:new Float32Array(this.primitive.vertexArr),type:gl.FLOAT,size:2,attrName:this.a_position},
            posIndexInfo: {array: this.primitive.indexArr},
            drawMethod: DRAW_METHOD.TRIANGLE_STRIP,
        } as IBufferInfoDescription);
    }

}

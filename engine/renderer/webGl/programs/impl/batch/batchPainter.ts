import {AbstractPainter} from "@engine/renderer/webGl/programs/abstract/abstractPainter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";
import {ShaderProgram} from "@engine/renderer/webGl/base/shaderProgram";
import {BufferInfo, DRAW_METHOD, IBufferInfoDescription} from "@engine/renderer/webGl/base/bufferInfo";
import {Plane} from "@engine/renderer/webGl/primitives/plane";

// http://tmtg.nl/glesjs/glesjs-demo/game.js

export class BatchPainter extends AbstractPainter {

    private readonly aIdx: string;

    constructor(gl:WebGLRenderingContext) {
        super(gl);
        const gen: ShaderGenerator = new ShaderGenerator();

        this.aIdx = gen.addAttribute(GL_TYPE.FLOAT,'a_idx');
        //this.u_textureMatrix = gen.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_textureMatrix');
        //gen.addVarying(GL_TYPE.FLOAT_VEC2,'v_texCoord');

        //language=GLSL
        gen.setVertexMainFn(`
            precision mediump float;
            void main(){
                vec2 pos;
                if (int(a_idx)==0) {
                    pos = vec2(0.0, 0.0);
                } else if (int(a_idx)==1) {
                    pos = vec2(0.0, 1.0);
                } else if (int(a_idx)==2) {
                    pos = vec2(1.0, 0.0);
                } else {
                    pos = vec2(1.0, 1.0);
                }

                mat4 vertexMatrix = mat4(
                     0.38109755516052246,
                     0.,
                     0.,
                     0.,
                     0.,
                     1.6129032373428345,
                     0.,
                     0.,
                     0.,
                     0.,
                     -0.0010000000474974513,
                     0.,
                     -0.9847561120986938,
                     -1.454838752746582,
                     0.,
                     1.
                );

                gl_Position = vertexMatrix * vec4(pos,0.,1.);

                //gl_Position = vec4(pos,0.,0.);
                //v_texCoord = (u_textureMatrix * vec4(a_texCoord, 0, 1)).xy;
                //v_texCoord = a_idx;
            }
        `);

        //language=GLSL
        gen.setFragmentMainFn(`
            precision mediump float;
            void main(){
                // gl_FragColor = texture2D(texture, v_texCoord);
                gl_FragColor = vec4(1.,0.,1.,1.);
            }
        `);
        this.program = new ShaderProgram(
            gl,
            gen.getVertexSource(),
            gen.getFragmentSource()
        );
        const vertexArray = new Float32Array([
            // triangle 1
            0, 1, 3,
            // triangle 2
            0, 2, 3,
        ]);
        const bufferInfoDesc:IBufferInfoDescription = {
            posVertexInfo:{
                array:vertexArray, type:this.gl.FLOAT,
                size:1, attrName:this.aIdx,
            },
            drawMethod:DRAW_METHOD.TRIANGLES
        };
        this.bufferInfo = new BufferInfo(this.gl,bufferInfoDesc);
    }

}

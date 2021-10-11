import {AbstractPainter} from "@engine/renderer/webGl/programs/abstract/abstractPainter";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

// http://tmtg.nl/glesjs/glesjs-demo/game.js

export class BatchPainter extends AbstractPainter {

    private readonly aIdx: string;

    constructor(gl:WebGLRenderingContext) {
        super(gl);
        const gen: ShaderGenerator = new ShaderGenerator();

        this.aIdx = gen.addAttribute(GL_TYPE.INT,'a_idx');
        //this.u_textureMatrix = gen.addVertexUniform(GL_TYPE.FLOAT_MAT4,'u_textureMatrix');
        //gen.addVarying(GL_TYPE.FLOAT_VEC2,'v_texCoord');
        gen.addVarying(GL_TYPE.FLOAT_VEC2,'v_texCoord');

        //language=GLSL
        gen.setVertexMainFn(MACRO_GL_COMPRESS`
            void main(){
                v_position = a_position;
                gl_Position = u_vertexMatrix * a_position;
            }
        `);

        //language=GLSL
        gen.setFragmentMainFn(MACRO_GL_COMPRESS`
            void main(){
                gl_FragColor = texture2D(texture, v_texCoord);
            }
        `);
    }

}

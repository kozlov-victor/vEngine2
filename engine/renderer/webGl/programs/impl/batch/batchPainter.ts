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
                vec2 pos;
                if (a_id==0) {
                    pos = vec2(0.0, 0.0);
                } else if (a_id==1) {
                    pos = vec2(1.0, 0.0);
                } else if (a_id==2) {
                    pos = vec2(0.0, 1.0);
                } else {
                    pos = vec2(1.0, 1.0);
                }
                gl_Position = pos;
                //v_texCoord = (u_textureMatrix * vec4(a_texCoord, 0, 1)).xy;
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

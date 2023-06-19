import {AbstractGlFilter} from "@engine/renderer/webGl/filters/abstract/abstractGlFilter";
import {Game} from "@engine/core/game";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/program/shaderProgramUtils";

export abstract class AbstractColorMatrixFilter extends AbstractGlFilter {

    private readonly u_matrix:string;

    constructor(game:Game){
        super(game);

        const programGen:ShaderGenerator = this.simpleRectPainter.gen;
        this.u_matrix = programGen.addScalarFragmentUniform(GL_TYPE.FLOAT,'m[20]',true);
        //language=GLSL
        programGen.setFragmentMainFn(`
            void main(){
                vec4 c = texture2D(texture, v_texCoord);
                gl_FragColor.r = m[ 0] * c.r + m[ 1] * c.g + m[ 2] * c.b + m[ 3] * c.a + m[ 4];
                gl_FragColor.g = m[ 5] * c.r + m[ 6] * c.g + m[ 7] * c.b + m[ 8] * c.a + m[ 9];
                gl_FragColor.b = m[10] * c.r + m[11] * c.g + m[12] * c.b + m[13] * c.a + m[14];
                gl_FragColor.a = m[15] * c.r + m[16] * c.g + m[17] * c.b + m[18] * c.a + m[19];
            }
        `);
        this.updateMatrix(new Float32Array([
            1,0,0,0,0,
            0,1,0,0,0,
            0,0,1,0,0,
            0,0,0,1,0
        ]));
        this.simpleRectPainter.initProgram();
    }

    protected updateMatrix(val:Float32Array):void {
        this.setUniform(this.u_matrix,val);
    }

}

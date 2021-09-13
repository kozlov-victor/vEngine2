import {AbstractCompositionFilter} from "@engine/renderer/webGl/filters/composition/abstract/abstractCompositionFilter";
import {Game} from "@engine/core/game";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

// todo
export class EvenOddCompositionFilter extends AbstractCompositionFilter {

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        programGen.addScalarFragmentUniform(GL_TYPE.SAMPLER_2D,'destTexture');
        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
            void main(){
                vec4 destColor = texture2D(destTexture, v_texCoord);
                vec4 sourceColor = texture2D(texture, v_texCoord);
//                if (destColor.a>0.) gl_FragColor.a = 0.;
//                else gl_FragColor = sourceColor;
                gl_FragColor = vec4(
                    (destColor.r+sourceColor.r)/2.,
                    (destColor.r+sourceColor.g)/2.,
                    (destColor.r+sourceColor.b)/2.,
                    (destColor.a+sourceColor.a)/2.);
            }`
        );
        this.simpleRectDrawer.initProgram();
    }

}

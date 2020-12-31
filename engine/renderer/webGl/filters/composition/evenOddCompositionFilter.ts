import {AbstractCompositionFilter} from "@engine/renderer/webGl/filters/composition/abstract/abstractCompositionFilter";
import {Game} from "@engine/core/game";
import {ShaderGenerator} from "@engine/renderer/webGl/shaders/generators/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

// todo
export class EvenOddCompositionFilter extends AbstractCompositionFilter {

    constructor(game:Game) {
        super(game);
        const programGen:ShaderGenerator = this.simpleRectDrawer.gen;
        programGen.addScalarFragmentUniform(GL_TYPE.SAMPLER_2D,'texturePrev');
        //language=GLSL
        programGen.setFragmentMainFn(MACRO_GL_COMPRESS`
            void main(){
                vec4 prevColor = texture2D(texturePrev, v_texCoord);
                vec4 currColor = texture2D(texture, v_texCoord);
                if (prevColor.a>0.) gl_FragColor = vec4(0.,0.,0.,0.);
                else gl_FragColor = currColor;
//                gl_FragColor = vec4(
//                    (prevColor.r+currColor.r)/2.,
//                    (prevColor.r+currColor.g)/2.,
//                    (prevColor.r+currColor.b)/2.,
//                    (prevColor.a+currColor.a)/2.);
            }`
        );
        this.simpleRectDrawer.initProgram();
    }

}

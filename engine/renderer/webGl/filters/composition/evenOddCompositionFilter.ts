import {AbstractCompositionFilter} from "@engine/renderer/webGl/filters/composition/abstract/abstractCompositionFilter";
import {Game} from "@engine/core/game";
import {ShaderGenerator} from "@engine/renderer/webGl/shaderGenerator/shaderGenerator";
import {GL_TYPE} from "@engine/renderer/webGl/base/shaderProgramUtils";

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

                bool isDestColorSet = destColor.a>0.;
                bool isSourceColorSet = sourceColor.a>0.;

                if (isDestColorSet && isSourceColorSet) gl_FragColor = vec4(0., 0., 0., 0.);
                else if (isDestColorSet) gl_FragColor = destColor;
                else if (isSourceColorSet) gl_FragColor = sourceColor;
                else gl_FragColor = vec4(0., 0., 0., 0.);
                //                gl_FragColor = vec4(
                //                    (destColor.r+sourceColor.r)/2.,
                //                    (destColor.r+sourceColor.g)/2.,
                //                    (destColor.r+sourceColor.b)/2.,
                //                    (destColor.a+sourceColor.a)/2.);
                //                gl_FragColor = vec4(
                //                    min(destColor.r,sourceColor.r),
                //                    min(destColor.g,sourceColor.g),
                //                    min(destColor.b,sourceColor.b),
                //                    min(destColor.a,sourceColor.a));
            }`
        );
        this.simpleRectDrawer.initProgram();
    }

}

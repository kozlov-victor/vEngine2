import {AbstractCompositionFilter} from "@engine/renderer/webGl/filters/composition/abstract/abstractCompositionFilter";
import {Game} from "@engine/core/game";

export class EvenOddCompositionFilter extends AbstractCompositionFilter {

    constructor(game:Game) {
        super(game);
        //language=GLSL
        this.simpleRectPainter.gen.setFragmentMainFn(`
            void main(){
                vec4 destColor = texture2D(destTexture, v_texCoord);
                vec4 sourceColor = texture2D(texture, v_texCoord);

                bool isDestColorSet = destColor.a>0.;
                bool isSourceColorSet = sourceColor.a>0.;

                if (isDestColorSet && isSourceColorSet) gl_FragColor = vec4(0., 0., 0., 0.);
                else if (isDestColorSet) gl_FragColor = destColor;
                else if (isSourceColorSet) gl_FragColor = sourceColor;
                else gl_FragColor = vec4(0., 0., 0., 0.);
            }`
        );
        this.simpleRectPainter.initProgram();
    }

}

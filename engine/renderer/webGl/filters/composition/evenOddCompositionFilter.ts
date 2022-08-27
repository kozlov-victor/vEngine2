import {AbstractCompositionFilter} from "@engine/renderer/webGl/filters/composition/abstract/abstractCompositionFilter";
import {Game} from "@engine/core/game";

export class EvenOddCompositionFilter extends AbstractCompositionFilter {

    constructor(game:Game) {
        super(game);
    }

    protected getBlendFunctionCode(): string {
        //language=GLSL
        return `
            vec4 blend(vec4 destColor,vec4 sourceColor) {
                bool isDestColorSet = destColor.a>0.;
                bool isSourceColorSet = sourceColor.a>0.;

                if (isDestColorSet && isSourceColorSet) return vec4(0., 0., 0., 0.);
                else if (isDestColorSet) return destColor;
                else if (isSourceColorSet) return sourceColor;
                else return vec4(0., 0., 0., 0.);
            }
        `
    }

}

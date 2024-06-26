import {AbstractCompositionFilter} from "@engine/renderer/webGl/filters/composition/abstract/abstractCompositionFilter";
import {Game} from "@engine/core/game";

// https://www.w3.org/TR/compositing-1/#blendingcolordodge

export class ColorDodgeCompositionFilter extends AbstractCompositionFilter {

    constructor(game:Game) {
        super(game);
    }

    protected getBlendFunctionCode(): string {
        //language=GLSL
        return `
            vec4 blend(vec4 destColor,vec4 sourceColor) {
                return min(vec4(1.), destColor / (vec4(1.) - sourceColor));
            }
        `
    }

}

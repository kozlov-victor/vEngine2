import {AbstractCompositionFilter} from "@engine/renderer/webGl/filters/composition/abstract/abstractCompositionFilter";
import {Game} from "@engine/core/game";

// Retains the lightest pixels of both layers
export class LightenCompositionFilter extends AbstractCompositionFilter {

    constructor(game:Game) {
        super(game);
    }

    protected getBlendFunctionCode(): string {
        //language=GLSL
        return `
            vec4 blend(vec4 destColor,vec4 sourceColor) {
                return max(destColor,sourceColor);
            }
        `
    }

}

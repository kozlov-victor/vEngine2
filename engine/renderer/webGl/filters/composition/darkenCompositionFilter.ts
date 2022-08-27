import {AbstractCompositionFilter} from "@engine/renderer/webGl/filters/composition/abstract/abstractCompositionFilter";
import {Game} from "@engine/core/game";

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation

// Retains the darkest pixels of both layers
export class DarkenCompositionFilter extends AbstractCompositionFilter {

    constructor(game:Game) {
        super(game);
    }

    protected getBlendFunctionCode(): string {
        //language=GLSL
        return `
            vec4 blend(vec4 destColor,vec4 sourceColor) {
                return min(destColor,sourceColor);
            }
        `
    }

}

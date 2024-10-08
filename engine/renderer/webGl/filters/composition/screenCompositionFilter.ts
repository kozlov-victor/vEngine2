import {AbstractCompositionFilter} from "@engine/renderer/webGl/filters/composition/abstract/abstractCompositionFilter";
import {Game} from "@engine/core/game";

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation

// The pixels are inverted, multiplied, and inverted again.
export class ScreenCompositionFilter extends AbstractCompositionFilter {

    constructor(game:Game) {
        super(game);
    }

    protected getBlendFunctionCode(): string {
        //language=GLSL
        return `
            vec4 blend(vec4 destColor,vec4 sourceColor) {
                vec4 dest = vec4(1.) - destColor;
                vec4 source = vec4(1.) - sourceColor;
                return vec4(1.) - dest*source;
            }
        `
    }

}

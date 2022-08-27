import {AbstractCompositionFilter} from "@engine/renderer/webGl/filters/composition/abstract/abstractCompositionFilter";
import {Game} from "@engine/core/game";

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation

// Retains the darkest pixels of both layers
export class DissolveCompositionFilter extends AbstractCompositionFilter {

    constructor(game:Game) {
        super(game);
    }

    protected getBlendFunctionCode(): string {
        //language=GLSL
        return `
            vec4 blend(vec4 destColor,vec4 sourceColor) {
                float rand = fract(sin(dot(v_texCoord.xy ,vec2(12.9898,78.233))) * 43758.5453);
                if (rand < sourceColor.a) {
                    return sourceColor;
                } else {
                    return destColor;
                }
            }
        `
    }

}

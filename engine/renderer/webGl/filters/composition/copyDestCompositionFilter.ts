import {AbstractCompositionFilter} from "@engine/renderer/webGl/filters/composition/abstract/abstractCompositionFilter";
import {Game} from "@engine/core/game";

// just copy destination to source,
// use to combine with other filters
export class CopyDestCompositionFilter extends AbstractCompositionFilter {

    constructor(game:Game) {
        super(game);
        this.clearNextFrameBuffer = false;
    }

    protected getBlendFunctionCode(): string {
        //language=GLSL
        return `
            vec4 blend(vec4 destColor,vec4 sourceColor) {
                return destColor;
            }
        `
    }

}

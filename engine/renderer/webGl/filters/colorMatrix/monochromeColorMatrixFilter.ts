import {AbstractColorMatrixFilter} from "@engine/renderer/webGl/filters/colorMatrix/abstract/abstractColorMatrixFilter";
import {Game} from "@engine/core/game";

export class MonochromeColorMatrixFilter extends AbstractColorMatrixFilter {

    constructor(game: Game) {
        super(game);
        const m = 1.;
        const t = -2.5;
        this.updateMatrix(new Float32Array([
            m,0,0,1,t,
            0,m,0,1,t,
            0,0,m,1,t,
            0,0,0,1,0,
        ]));
    }

}

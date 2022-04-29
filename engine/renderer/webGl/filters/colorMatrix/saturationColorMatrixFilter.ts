import {AbstractColorMatrixFilter} from "@engine/renderer/webGl/filters/colorMatrix/abstract/abstractColorMatrixFilter";
import {Game} from "@engine/core/game";

export class SaturationColorMatrixFilter extends AbstractColorMatrixFilter {

    constructor(game: Game) {
        super(game);
        this.setSaturation(1);
    }

    public setSaturation(s:number):void {
        const x = (s || 0) * 2/3 + 1;
        const y = ((x-1) *-0.5);
        this.updateMatrix(new Float32Array([
            x, y, y, 0, 0,
            y, x, y, 0, 0,
            y, y, x, 0, 0,
            0, 0, 0, 1, 0
        ]))
    }

}

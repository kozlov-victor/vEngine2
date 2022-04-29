import {AbstractColorMatrixFilter} from "@engine/renderer/webGl/filters/colorMatrix/abstract/abstractColorMatrixFilter";
import {Game} from "@engine/core/game";

export class SepiaColorMatrixFilter extends AbstractColorMatrixFilter {

    constructor(game: Game) {
        super(game);
        this.updateMatrix(new Float32Array([
            0.393, 0.7689999, 0.18899999, 0, 0,
            0.349, 0.6859999, 0.16799999, 0, 0,
            0.272, 0.5339999, 0.13099999, 0, 0,
            0,0,0,1,0
        ]));
    }

}

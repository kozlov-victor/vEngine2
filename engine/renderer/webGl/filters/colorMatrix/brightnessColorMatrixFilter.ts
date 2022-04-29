import {AbstractColorMatrixFilter} from "@engine/renderer/webGl/filters/colorMatrix/abstract/abstractColorMatrixFilter";
import {Game} from "@engine/core/game";

export class BrightnessColorMatrixFilter extends AbstractColorMatrixFilter {

    constructor(game: Game) {
        super(game);
        this.setBrightness(1);
    }

    public setBrightness(b:number):void {
        this.updateMatrix(new Float32Array([
            b, 0, 0, 0, 0,
            0, b, 0, 0, 0,
            0, 0, b, 0, 0,
            0, 0, 0, 1, 0
        ]))
    }

}

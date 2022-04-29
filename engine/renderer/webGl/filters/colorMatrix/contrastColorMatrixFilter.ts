import {AbstractColorMatrixFilter} from "@engine/renderer/webGl/filters/colorMatrix/abstract/abstractColorMatrixFilter";
import {Game} from "@engine/core/game";

export class ContrastColorMatrixFilter extends AbstractColorMatrixFilter {

    constructor(game: Game) {
        super(game);
        this.setContrast(1);
    }

    public setContrast(c:number):void {
        const t = (1.0 - c) / 2.0;
        this.updateMatrix(new Float32Array([
            c,0,0,0,0,
            0,c,0,0,0,
            0,0,c,0,0,
            0,0,0,1,0,
            t,t,t,0,1
        ]))
    }

}

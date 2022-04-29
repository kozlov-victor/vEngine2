import {
    AbstractKernelAccumulativeFilter
} from "@engine/renderer/webGl/filters/kernel/abstract/abstractKernelFilter";
import {Game} from "@engine/core/game";

// https://webgl2fundamentals.org/webgl/lessons/webgl-image-processing.html
export class EmbossKernelFilter extends AbstractKernelAccumulativeFilter {

    constructor(game:Game) {
        super(game);
        this.setKernel([
            -2, -1,  0,
            -1,  1,  1,
             0,  1,  2
        ]);
    }

}

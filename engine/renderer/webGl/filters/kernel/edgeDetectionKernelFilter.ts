import {
    AbstractKernelAccumulativeFilter
} from "@engine/renderer/webGl/filters/kernel/abstract/abstractKernelFilter";
import {Game} from "@engine/core/game";

// https://webgl2fundamentals.org/webgl/lessons/webgl-image-processing.html
export class EdgeDetectionKernelFilter extends AbstractKernelAccumulativeFilter {

    constructor(game:Game) {
        super(game);
        this.setKernel([
            -1, -1, -1,
            -1, 8, -1,
            -1, -1, -1
        ]);
    }

}

import {
    AbstractKernelAccumulativeFilter
} from "@engine/renderer/webGl/filters/accumulative/abstract/abstractKernelFilter";
import {Game} from "@engine/core/game";

// https://webgl2fundamentals.org/webgl/lessons/webgl-image-processing.html
export class SharpenKernelFilter extends AbstractKernelAccumulativeFilter {

    constructor(game:Game) {
        super(game);
        this.setKernel([
             0, -1,  0,
            -1,  5, -1,
             0, -1,  0,
        ]);
    }

}

import {
    AbstractKernelAccumulativeFilter
} from "@engine/renderer/webGl/filters/accumulative/abstract/abstractKernelFilter";
import {Game} from "@engine/core/game";

// https://webgl2fundamentals.org/webgl/lessons/webgl-image-processing.html
export class BoxBlurKernelFilter extends AbstractKernelAccumulativeFilter {

    constructor(game:Game) {
        super(game);
        this.setKernel([
            0.111, 0.111, 0.111,
            0.111, 0.111, 0.111,
            0.111, 0.111, 0.111,
        ]);
    }

}

import {
    AbstractKernelAccumulativeFilter
} from "@engine/renderer/webGl/filters/accumulative/abstract/abstractKernelFilter";
import {Game} from "@engine/core/game";

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

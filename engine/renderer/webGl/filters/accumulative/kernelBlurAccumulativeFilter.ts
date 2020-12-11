import {AbstractKernelAccumulativeFilter} from "@engine/renderer/webGl/filters/accumulative/abstract/abstractKernelAccumulativeFilter";
import {Game} from "@engine/core/game";

export class KernelBlurAccumulativeFilter extends AbstractKernelAccumulativeFilter {

    constructor(game:Game) {
        super(game);
        this.setKernel(
            [
                1.0,    1.0,    1.0,
                1.0,    0.0,    1.0,
                1.0,    1.0,    1.0
            ]
        );
    }

}

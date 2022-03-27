import {
    AbstractKernelAccumulativeFilter
} from "@engine/renderer/webGl/filters/accumulative/abstract/abstractKernelFilter";
import {Game} from "@engine/core/game";

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

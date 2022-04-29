import {
    AbstractKernelAccumulativeFilter
} from "@engine/renderer/webGl/filters/kernel/abstract/abstractKernelFilter";
import {Game} from "@engine/core/game";

// https://setosa.io/ev/image-kernels/
export class OutlineKernelFilter extends AbstractKernelAccumulativeFilter {

    constructor(game:Game) {
        super(game);
        this.setKernel([
            -1, -1, -1,
            -1,  8, -1,
            -1, -1, -1,
        ]);
    }

}

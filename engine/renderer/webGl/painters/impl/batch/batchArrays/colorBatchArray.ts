import {
    AbstractBatchArray,
    NUM_OF_VERTICES_IN_QUAD
} from "@engine/renderer/webGl/painters/impl/batch/batchArrays/abstract/abstractBatchArray";
import {ColorEx} from "@engine/renderable/impl/general/image/batchedImage";

export class ColorBatchArray extends AbstractBatchArray<ColorEx> {

    constructor() {
        super(2);
    }

    protected onPutNextChunk(model: ColorEx, offset: number): void {
        const colorArray = model.getPackedColor();
        const rg = colorArray[0];
        const ba = colorArray[1];
        const array = this.array;
        for (let i=0;i<NUM_OF_VERTICES_IN_QUAD;++i) {
            array[offset++] = rg;
            array[offset++] = ba;
        }
    }

}

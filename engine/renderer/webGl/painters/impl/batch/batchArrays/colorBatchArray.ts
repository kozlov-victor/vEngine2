import {
    AbstractBatchArray,
    NUM_OF_VERTICES_IN_QUAD
} from "@engine/renderer/webGl/painters/impl/batch/batchArrays/abstract/abstractBatchArray";
import {Color} from "@engine/renderer/common/color";

export class ColorBatchArray extends AbstractBatchArray<Color> {

    constructor() {
        super(4);
    }

    protected onPutNextChunk(model: Color, offset: number): void {
        const colorArray = model.asGL();
        const r = colorArray[0];
        const g = colorArray[1];
        const b = colorArray[2];
        const a = colorArray[3];
        const array = this.array;
        for (let i=0;i<NUM_OF_VERTICES_IN_QUAD;++i) {
            array[offset++] = r;
            array[offset++] = g;
            array[offset++] = b;
            array[offset++] = a;
        }
    }

}

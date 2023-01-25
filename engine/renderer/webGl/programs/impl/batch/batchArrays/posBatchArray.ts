import {
    AbstractBatchArray,
    NUM_OF_VERTICES_IN_QUAD
} from "@engine/renderer/webGl/programs/impl/batch/batchArrays/abstract/abstractBatchArray";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";

export class PosBatchArray extends AbstractBatchArray<BatchedImage> {

    constructor() {
        super(4);
    }

    protected onPutNextChunk(model: BatchedImage, offset: number): void {
        const pos  = model.pos;
        const size = model.size;
        const width = size.width;
        const height = size.height;
        const x = pos.x + width/2;
        const y = pos.y + height/2;
        const array = this.array;
        for (let i=0;i<NUM_OF_VERTICES_IN_QUAD;++i) {
            array[offset++] = x;
            array[offset++] = y;
            array[offset++] = width;
            array[offset++] = height;
        }
    }

}

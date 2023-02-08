import {AbstractBatchArray} from "@engine/renderer/webGl/programs/impl/batch/batchArrays/abstract/abstractBatchArray";

export class AngleBatchArray extends AbstractBatchArray<number> {

    constructor() {
        super(1);
    }

    protected onPutNextChunk(model: number, offset: number): void {
        const array = this.array;
        array[  offset] =
        array[++offset] =
        array[++offset] =
        array[++offset] = model;
    }

}

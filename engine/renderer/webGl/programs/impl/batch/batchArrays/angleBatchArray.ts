import {AbstractBatchArray} from "@engine/renderer/webGl/programs/impl/batch/batchArrays/abstract/abstractBatchArray";

export class AngleBatchArray extends AbstractBatchArray<number> {

    constructor() {
        super(1);
        this.setOnPutNextChunkCallback((model,array,offset)=>{
            array[offset] = model;
        });
    }
}

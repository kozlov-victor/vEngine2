import {AbstractBatchArray} from "@engine/renderer/webGl/programs/impl/batch/batchArrays/abstract/abstractBatchArray";
import {VertexBuffer} from "@engine/renderer/webGl/base/vertexBuffer";

export class AngleBufferArray extends AbstractBatchArray<number> {
    constructor(buffer:VertexBuffer) {
        super(1, buffer);

        this.setOnPutNextChunkCallback((model,array,offset)=>{
            array[offset] = model;
        });

    }
}

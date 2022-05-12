import {AbstractBatchArray} from "@engine/renderer/webGl/programs/impl/batch/batchArrays/abstract/abstractBatchArray";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";
import {VertexBuffer} from "@engine/renderer/webGl/base/vertexBuffer";

export class posBufferArray extends AbstractBatchArray<BatchedImage> {

    constructor(buffer:VertexBuffer) {
        super(4, buffer);
        this.setOnPutNextChunkCallback((model,array,offset)=>{
            const pos  = model.pos;
            const size = model.size;
            array[offset  ] = pos.x + size.width/2;
            array[offset+1] = pos.y + size.height/2;
            array[offset+2] = size.width;
            array[offset+3] = size.height;
        });
    }

}

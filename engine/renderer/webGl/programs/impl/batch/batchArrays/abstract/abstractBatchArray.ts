import {BatchPainter} from "@engine/renderer/webGl/programs/impl/batch/batchPainter";
import {VertexBuffer} from "@engine/renderer/webGl/base/vertexBuffer";

export abstract class AbstractBatchArray<T> {

    private readonly array:Float32Array;
    private onPutNextChunkCallback:(model:T,array:Float32Array,offset:number)=>void;

    protected constructor(private size: number, private vertexBuffer:VertexBuffer) {
        this.array = new Float32Array(4*size*BatchPainter.NUM_OF_QUADS_IN_BATCH);
    }

    public setOnPutNextChunkCallback(cb:(model:T,array:Float32Array,offset: number)=>void): void {
        this.onPutNextChunkCallback = cb;
    }

    public putNextChunk(model:T,chunkIndex:number):void {
        const size = this.size;
        let offset = chunkIndex*size*4;
        for (let i=0;i<4;i++) {
            this.onPutNextChunkCallback(model,this.array,offset);
            offset+=size;
        }
    }

    public uploadToVertexBufferAndReset():void {
        this.vertexBuffer.updateData(this.array);
        this.array.fill(0);
    }


}


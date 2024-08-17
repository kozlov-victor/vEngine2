import {BatchPainter} from "@engine/renderer/webGl/painters/impl/batch/batchPainter";
import {VertexBuffer} from "@engine/renderer/webGl/base/buffer/vertexBuffer";

export const NUM_OF_VERTICES_IN_QUAD = 4;

export abstract class AbstractBatchArray<T> {

    protected readonly array:Float32Array;

    private dirty:boolean = false;
    private vertexBuffer:VertexBuffer;
    private currentOffset = 0;
    private readonly OFFSET_SIZE: number;

    protected constructor(private size: number) {
        this.array = new Float32Array(NUM_OF_VERTICES_IN_QUAD*size*BatchPainter.NUM_OF_QUADS_IN_BATCH);
        this.OFFSET_SIZE = size * NUM_OF_VERTICES_IN_QUAD;
    }

    public setVertexBuffer(vb:VertexBuffer):void {
        this.vertexBuffer = vb;
    }

    protected abstract onPutNextChunk(model:T,offset:number):void;

    public putNextChunk(model:T,chunkIndex:number):void {
        this.dirty = true;
        let offset = chunkIndex * this.OFFSET_SIZE;
        this.onPutNextChunk(model,offset);
        offset+=this.OFFSET_SIZE;
        this.currentOffset = offset;
    }

    public uploadToVertexBuffer(full = false):void {
        if (!this.dirty) return;
        this.dirty = false;
        if (full) this.vertexBuffer.updateData(this.array);
        else this.vertexBuffer.updateData(this.array.subarray(0,this.currentOffset));
    }

    public clearUnused():void {
        this.array.fill(0,this.currentOffset);
    }

    public getArray():Float32Array {
        return this.array;
    }


}


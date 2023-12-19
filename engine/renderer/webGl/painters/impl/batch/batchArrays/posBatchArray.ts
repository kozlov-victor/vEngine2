import {
    AbstractBatchArray,
    NUM_OF_VERTICES_IN_QUAD
} from "@engine/renderer/webGl/painters/impl/batch/batchArrays/abstract/abstractBatchArray";
import {BatchedImage} from "@engine/renderable/impl/general/image/batchedImage";
import {Point3d} from "@engine/geometry/point3d";

export class PosBatchArray extends AbstractBatchArray<BatchedImage> {

    constructor() {
        super(4);
    }

    protected onPutNextChunk(model: BatchedImage, offset: number): void {
        const pos  = model.pos;
        const size = model.size;
        const width = size.width;
        const height = size.height;
        const cameraPos = model.getScene()?.camera?.pos ?? new Point3d();
        const x = pos.x - cameraPos.x;
        const y = pos.y - cameraPos.y;
        const array = this.array;
        for (let i=0;i<NUM_OF_VERTICES_IN_QUAD;++i) {
            array[offset++] = x;
            array[offset++] = y;
            array[offset++] = width;
            array[offset++] = height;
        }
    }

}

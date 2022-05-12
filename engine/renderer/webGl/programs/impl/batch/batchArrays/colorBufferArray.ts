import {AbstractBatchArray} from "@engine/renderer/webGl/programs/impl/batch/batchArrays/abstract/abstractBatchArray";
import {Color} from "@engine/renderer/common/color";
import {VertexBuffer} from "@engine/renderer/webGl/base/vertexBuffer";

export class ColorBufferArray extends AbstractBatchArray<Color> {

    constructor(buffer:VertexBuffer) {
        super(4, buffer);
        this.setOnPutNextChunkCallback((model,array,offset)=>{
            const colorArray = model.asGL();
            array[offset  ] = colorArray[0];
            array[offset+1] = colorArray[1];
            array[offset+2] = colorArray[2];
            array[offset+3] = colorArray[3];
        });
    }

}

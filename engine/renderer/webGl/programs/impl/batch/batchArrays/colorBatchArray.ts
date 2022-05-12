import {AbstractBatchArray} from "@engine/renderer/webGl/programs/impl/batch/batchArrays/abstract/abstractBatchArray";
import {Color} from "@engine/renderer/common/color";

export class ColorBatchArray extends AbstractBatchArray<Color> {

    constructor() {
        super(4);
        this.setOnPutNextChunkCallback((model,array,offset)=>{
            const colorArray = model.asGL();
            array[offset  ] = colorArray[0];
            array[offset+1] = colorArray[1];
            array[offset+2] = colorArray[2];
            array[offset+3] = colorArray[3];
        });
    }

}

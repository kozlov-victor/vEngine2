import {Optional} from "@engine/core/declarations";
import {DRAW_METHOD} from "@engine/renderer/webGl/base/buffer/bufferInfo";

export interface IPrimitive {
    vertexArr:number[];
    normalArr: Optional<number[]>;
    vertexColorArr: Optional<number[]>;
    texCoordArr: Optional<number[]>;
    indexArr: Optional<number[]>;
    drawMethod:DRAW_METHOD;
    vertexItemSize:2|3;
}

export abstract class AbstractPrimitive implements IPrimitive {

    public vertexArr:number[];
    public normalArr:Optional<number[]>;
    public texCoordArr:Optional<number[]>;
    public indexArr:Optional<number[]>;
    public vertexColorArr:Optional<number[]>;
    public drawMethod:DRAW_METHOD;
    public vertexItemSize:2|3 = 3;

    protected constructor(){
    }

}

// remember, that we cant really define smth like textCoordIndexArr
// "should duplicate the vertex if the texture coord is different"
// https://community.khronos.org/t/texture-coordinates-per-face-index-instead-of-per-vertex/2484

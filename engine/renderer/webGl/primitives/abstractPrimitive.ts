import {Optional} from "@engine/core/declarations";
import {DRAW_METHOD} from "@engine/renderer/webGl/base/bufferInfo";

export interface IPrimitive {
    vertexArr:number[];
    normalArr: Optional<number[]>;
    texCoordArr: Optional<number[]>;
    indexArr: Optional<number[]>;
    drawMethod:DRAW_METHOD;
}

export abstract class AbstractPrimitive implements IPrimitive {

    public vertexArr:number[];
    public normalArr:Optional<number[]>;
    public texCoordArr:Optional<number[]>;
    public indexArr:Optional<number[]>;
    public drawMethod:number;

    constructor(){
    }

}

// remember, that we cant really define smth like textCoordIndexArr
// "should duplicate the vertex if the texture coord is different"
// https://community.khronos.org/t/texture-coordinates-per-face-index-instead-of-per-vertex/2484
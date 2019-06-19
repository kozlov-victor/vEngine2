
export interface IPrimitive {
    vertexArr:number[];
    normalArr: number[];
    texCoordArr: number[];
    indexArr: number[];
    drawMethod:number;
}

export class AbstractPrimitive implements IPrimitive {

    public vertexArr:number[];
    public normalArr:number[];
    public texCoordArr:number[];
    public indexArr:number[];
    public drawMethod:number;

    constructor(){
    }

}

// remember, that we cant really define smth like textCoordIndexArr
// "should duplicate the vertex if the texture coord is different"
// https://community.khronos.org/t/texture-coordinates-per-face-index-instead-of-per-vertex/2484
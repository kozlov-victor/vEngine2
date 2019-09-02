
export interface IPrimitive {
    vertexArr:number[];
    normalArr: number[]|undefined;
    texCoordArr: number[]|undefined;
    indexArr: number[]|undefined;
    drawMethod:number;
}

export abstract class AbstractPrimitive implements IPrimitive {

    public vertexArr:number[];
    public normalArr:number[]|undefined;
    public texCoordArr:number[]|undefined;
    public indexArr:number[]|undefined;
    public drawMethod:number;

    constructor(){
    }

}

// remember, that we cant really define smth like textCoordIndexArr
// "should duplicate the vertex if the texture coord is different"
// https://community.khronos.org/t/texture-coordinates-per-face-index-instead-of-per-vertex/2484
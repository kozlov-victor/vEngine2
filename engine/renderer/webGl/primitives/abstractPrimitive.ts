
export interface IPrimitive {
    vertexArr:number[],
    normalArr: number[],
    texCoordArr: number[],
    indexArr: number[]
    drawMethod:number
}

export class AbstractPrimitive implements IPrimitive {

    vertexArr:number[];
    normalArr:number[];
    texCoordArr:number[];
    indexArr:number[];
    drawMethod:number = undefined;

    constructor(){
    }

}
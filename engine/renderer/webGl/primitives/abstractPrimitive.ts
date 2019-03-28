
export interface IPrimitive {
    vertexArr:number[],
    normalArr: number[],
    texCoordArr: number[],
    indexArr: number[]
}

export class AbstractPrimitive implements IPrimitive {

    vertexArr:number[];
    normalArr:number[];
    texCoordArr:number[];
    indexArr:number[];

    constructor(){

    }

}
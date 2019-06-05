
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
    public drawMethod:number = undefined;

    constructor(){
    }

}
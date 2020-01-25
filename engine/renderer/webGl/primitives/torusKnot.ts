import {AbstractPrimitive, IPrimitive} from "./abstractPrimitive";

const prepareBuffers = ():IPrimitive=>{

    const vertices:number[] =  [];

    const textureCoords:number[] = [];

    const indices:number[] = [];

    const vertexNormals:number[] =  [];

    // todo

    return {
        vertexArr:vertices,
        normalArr: vertexNormals,
        texCoordArr: textureCoords,
        indexArr: indices
    } as IPrimitive;

};


export class Cube extends AbstractPrimitive {

    constructor(size:number = 10){
        super();
        const bufferArrs:IPrimitive = prepareBuffers();
        this.vertexArr = bufferArrs.vertexArr;
        this.normalArr = bufferArrs.normalArr;
        this.texCoordArr = bufferArrs.texCoordArr;
        this.indexArr = bufferArrs.indexArr;
    }

}

import {AbstractPrimitive, IPrimitive} from "./abstractPrimitive";


const prepareBuffers = (radius:number,bands:number):IPrimitive=>{
    const latitudeBands:number = bands;
    const longitudeBands:number = bands;

    const vertexArr:number[] = [];
    const normalArr:number[] = [];
    const texCoordArr:number[] = [];
    for (let latNumber=0; latNumber <= latitudeBands; latNumber++) {
        const theta:number = latNumber * Math.PI / latitudeBands;
        const sinTheta:number = Math.sin(theta);
        const cosTheta:number = Math.cos(theta);

        for (let longNumber=0; longNumber <= longitudeBands; longNumber++) {
            const phi:number = longNumber * 2 * Math.PI / longitudeBands;
            const sinPhi:number = Math.sin(phi);
            const cosPhi:number = Math.cos(phi);

            const x:number = cosPhi * sinTheta;
            const y:number = cosTheta;
            const z:number = sinPhi * sinTheta;
            const u:number = 1 - (longNumber / longitudeBands);
            const v:number = 1 - (latNumber / latitudeBands);

            normalArr.push(x);
            normalArr.push(y);
            normalArr.push(z);
            texCoordArr.push(u);
            texCoordArr.push(v);
            vertexArr.push(radius * x);
            vertexArr.push(radius * y);
            vertexArr.push(radius * z);
        }
    }

    const indexArr:number[] = [];
    for (let latNumber=0; latNumber < latitudeBands; latNumber++) {
        for (let longNumber=0; longNumber < longitudeBands; longNumber++) {
            const first:number = (latNumber * (longitudeBands + 1)) + longNumber;
            const second:number = first + longitudeBands + 1;
            indexArr.push(first);
            indexArr.push(second);
            indexArr.push(first + 1);

            indexArr.push(second);
            indexArr.push(second + 1);
            indexArr.push(first + 1);
        }
    }

    return {
        vertexArr,
        normalArr,
        texCoordArr,
        indexArr
    } as IPrimitive;

};


export class Sphere extends AbstractPrimitive {

    constructor(radius:number = 10,bands:number = 30){
        super();
        const bufferArrs:IPrimitive = prepareBuffers(radius,bands);
        this.vertexArr = bufferArrs.vertexArr;
        this.normalArr = bufferArrs.normalArr;
        this.texCoordArr = bufferArrs.texCoordArr;
        this.indexArr = bufferArrs.indexArr;
    }

}







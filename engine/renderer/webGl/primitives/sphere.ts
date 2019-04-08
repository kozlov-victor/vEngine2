import {AbstractPrimitive, IPrimitive} from "./abstractPrimitive";


const prepareBuffers = (radius:number,bands:number):IPrimitive=>{
    const latitudeBands:number = bands;
    const longitudeBands:number = bands;

    const vertexArr:number[] = [];
    const normalArr:number[] = [];
    const texCoordArr:number[] = [];
    for (let latNumber=0; latNumber <= latitudeBands; latNumber++) {
        let theta:number = latNumber * Math.PI / latitudeBands;
        let sinTheta:number = Math.sin(theta);
        let cosTheta:number = Math.cos(theta);

        for (let longNumber=0; longNumber <= longitudeBands; longNumber++) {
            let phi:number = longNumber * 2 * Math.PI / longitudeBands;
            let sinPhi:number = Math.sin(phi);
            let cosPhi:number = Math.cos(phi);

            let x:number = cosPhi * sinTheta;
            let y:number = cosTheta;
            let z:number = sinPhi * sinTheta;
            let u:number = 1 - (longNumber / longitudeBands);
            let v:number = 1 - (latNumber / latitudeBands);

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
            let first:number = (latNumber * (longitudeBands + 1)) + longNumber;
            let second:number = first + longitudeBands + 1;
            indexArr.push(first);
            indexArr.push(second);
            indexArr.push(first + 1);

            indexArr.push(second);
            indexArr.push(second + 1);
            indexArr.push(first + 1);
        }
    }

    return {
        vertexArr:vertexArr,
        normalArr: normalArr,
        texCoordArr: texCoordArr,
        indexArr: indexArr
    } as IPrimitive

};


export class Sphere extends AbstractPrimitive {

    constructor(radius:number = 10,bands:number = 30){
        super();
        let bufferArrs:IPrimitive = prepareBuffers(radius,bands);
        this.vertexArr = bufferArrs.vertexArr;
        this.normalArr = bufferArrs.normalArr;
        this.texCoordArr = bufferArrs.texCoordArr;
        this.indexArr = bufferArrs.indexArr;
    }

}







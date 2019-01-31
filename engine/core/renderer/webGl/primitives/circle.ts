import {AbstractPrimitive} from './abstractPrimitive'

export class Circle extends AbstractPrimitive {

    constructor(){
        super();
        this.vertexArr = [];
        //this.indexArr = [];
        //let i = 0;
        let Pi2 = Math.PI*2;
        this.vertexArr.push(0.5);
        this.vertexArr.push(0.5);
        for (let a=0,max=Pi2;a<max;a+=0.1) {
            this.vertexArr.push(Math.cos(a)/2 + 0.5);
            this.vertexArr.push(Math.sin(a)/2 + 0.5);
            //this.indexArr.push(i++);
        }
        this.vertexArr.push(Math.cos(Pi2)/2 + 0.5);
        this.vertexArr.push(Math.sin(Pi2)/2 + 0.5);
    }

}
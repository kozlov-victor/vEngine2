
import {AbstractPrimitive} from './abstractPrimitive'

export class Line extends AbstractPrimitive {

    constructor(){
        super();
        this.vertexArr = [
            0, 0,
            1, 1
        ];
        this.indexArr = [0,1];
    }

}
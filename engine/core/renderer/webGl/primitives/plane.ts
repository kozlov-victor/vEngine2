
import {AbstractPrimitive} from './abstractPrimitive'

export class Plane extends AbstractPrimitive {

    constructor(){
        super();
        this.vertexArr = [
            0, 0,
            0, 1,
            1, 0,
            1, 1
        ];
        this.indexArr = [0,1,2,3];
        this.texCoordArr = [
            0, 0,
            0, 1,
            1, 0,
            1, 1
        ];
    }

}

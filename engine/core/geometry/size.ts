
import {ObjectPool} from "../misc/objectPool";

export class Size {

    width:number;
    height:number;

    private static rectPool:ObjectPool<Size> = new ObjectPool<Size>(Size);

    constructor(width:number = 0,height:number = 0){
        this.width = width;
        this.height = height;
    }

    setW(width:number):Size{
        this.width = width;
        return this;
    }
    setH(height:number):Size{
        this.height = height;
        return this;
    }

    setWH(width:number,height:number):Size{
        this.width = width;
        this.height = height;
        return this;
    }

    set(another:Size){
        this.width = another.width;
        this.height = another.height;
        return this;
    }

    static fromPool():Size {
        return Size.rectPool.getNextObject();
    }


}
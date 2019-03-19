
import {ObjectPool, Releasealable} from "../misc/objectPool";

export class Size implements Releasealable{

    width:number;
    height:number;

    private static rectPool:ObjectPool<Size> = new ObjectPool<Size>(Size);

    constructor(width:number = 0,height:number = 0){
        this.width = width;
        this.height = height;
    }

    private _captured:boolean = false;

    capture(): void {
        this._captured = true;
    }

    isCaptured(): boolean {
        return this._captured;
    }

    release(): void {
        this._captured = false;
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
        return Size.rectPool.getFreeObject();
    }


}
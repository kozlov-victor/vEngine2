import {DebugError} from "../debug/debugError";
import {Clazz, Optional} from "@engine/core/declarations";


export class ObjectPool<T> {

    private _pool:T[] = [];

    constructor(private Class:Clazz<T>, readonly initialCapacity = 4){
        if (DEBUG && !Class) throw new DebugError(`can not instantiate ObjectPool: class is not provided in the constructor`);
        for (let i=0;i<initialCapacity;i++) {
            this._pool.push(new this.Class());
        }
    }

    public get():T{
        return this._pool.pop() ?? new this.Class();
    }

    public recycle(obj:T):void{
        this._pool.push(obj);
    }

}

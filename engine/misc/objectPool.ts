import {DebugError} from "../debug/debugError";
import {Clazz, Optional} from "@engine/core/declarations";


export interface IReleasealable {
    release():this;
    capture(i:number):this;
    isCaptured():boolean;
    getCapturedIndex():number;
}

export class ObjectPool<T extends IReleasealable> {

    private _ptr:number = 0;
    private _pool:T[] = [];

    constructor(private Class:Clazz<T>, private readonly numberOfInstances = 32){
        if (DEBUG && !Class) throw new DebugError(`can not instantiate ObjectPool: class not provided in constructor`);
    }

    public getFreeObject(silently:boolean = false):Optional<T>{
        for (let i:number=this._ptr,max=this.numberOfInstances;i<max;i++) {
            const possible = this._getFreeObjectAt(i);
            if (possible!==undefined) {
                this._ptr = (++i)%this.numberOfInstances;
                return possible;
            }
        }
        for (let i:number=0;i<this._ptr;i++) {
            const possible = this._getFreeObjectAt(i);
            if (possible!==undefined) {
                this._ptr = (++i)%this.numberOfInstances;
                return possible;
            }
        }
        if (DEBUG && !silently) {
            console.trace(this._pool);
            throw new DebugError(`can not get free object: no free object in pool`);
        }
        return undefined;
    }

    public releaseObject(obj:T):void{
        const indexOf:number = obj.getCapturedIndex();
        if (DEBUG && indexOf===-1) {
            throw new DebugError(`can not release the object: it does not belong to the pool`);
        }
        this._pool[indexOf].release();
    }

    public releaseAll():void{
        for (const item of this._pool) {
            if (item!==undefined) item.release();
        }
        this._ptr = 0;
    }

    private _getFreeObjectAt(i:number):Optional<T>{
        let current:T = this._pool[i];
        if (current===undefined) {
            current = this._pool[i] = new this.Class();
            current.capture(i);
            return current;
        }
        else if (!current.isCaptured()) {
            current.capture(i);
            return current;
        }
        else return undefined;
    }


}

import {DebugError} from "../debug/debugError";
import {Clazz, Optional} from "@engine/core/declarations";


export interface IReleasealable {
    release():this;
    capture():this;
    isCaptured():boolean;
}

export class ObjectPool<T extends IReleasealable> {

    private _ptr:number = 0;
    private _pool:T[] = [];

    constructor(private Class:Clazz<T>, private numberOfInstances = 16){
        if (DEBUG && !Class) throw new DebugError(`can not instantiate ObjectPool: class not provided in constructor`);
    }

    public getFreeObject(silently:boolean = false):Optional<T>{
        let cnt:number = 0;
        while (cnt<this.numberOfInstances){
            let current:T = this._pool[this._ptr];
            if (current===undefined) {
                current = this._pool[this._ptr] = new this.Class();
                current.capture();
                return current;
            }
            else if (!current.isCaptured()) {
                current.capture();
                return current;
            }
            cnt++;
            this._ptr = (++this._ptr) % this.numberOfInstances;
        }
        if (DEBUG && !silently) throw new DebugError(`can not get free object: no free object in pool`);
        return undefined;
    }

    public releaseObject(obj:T):void{
        const indexOf:number = this._pool.indexOf(obj);
        if (DEBUG && indexOf===-1) {
            console.error(obj);
            throw new DebugError(`can not release the object: it does not belong to the pool`);
        }
        this._pool[indexOf].release();
    }

    public releaseAll():void{
        for (let i:number=0;i<this.numberOfInstances;i++) {
            const current:Optional<IReleasealable> = this._pool[i];
            if (current!==undefined) {
                current.release();
            }
        }
    }


}

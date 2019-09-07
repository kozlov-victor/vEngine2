import {DebugError} from "../debug/debugError";
import {Clazz} from "@engine/core/declarations";


export interface IReleasealable {
    release():this;
    capture():this;
    isCaptured():boolean;
}

export class ObjectPool<T extends IReleasealable> {

    private _pool:T[] = [];
    /**
     * 16 - nice magic value for default pool size
     * @param Class
     * @param {number} numberOfInstances
     */
    constructor(private Class:Clazz<T>, private numberOfInstances = 16){
        if (DEBUG && !Class) throw new DebugError(`can not instantiate ObjectPool: class not provided in constructor`);
    }

    public getFreeObject(silently:boolean = false):Optional<T>{

        for (let i:number=0;i<this.numberOfInstances;i++) {
            let current:T = this._pool[i];
            if (current===undefined) {
                current = this._pool[i] = new this.Class();
                current.capture();
                return current;
            }
            else if (!current.isCaptured()) {
                current.capture();
                return current;
            }
        }
        if (DEBUG && !silently) throw new DebugError(`can not get free object: no free object in pool`);
        return undefined;
    }

    public releaseObject(obj:T){
        const indexOf:number = this._pool.indexOf(obj);
        if (DEBUG && indexOf===-1) {
            console.error(obj);
            throw new DebugError(`can not release the object: it does not belong to the pool`);
        }
        this._pool[indexOf].release();
    }


}
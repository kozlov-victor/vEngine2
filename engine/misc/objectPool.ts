import {DebugError} from "../debug/debugError";


export interface Releasealable {
    release():void,
    capture():void,
    isCaptured():boolean
}

export class ObjectPool<T extends Releasealable> {

    private _pool:T[] = [];
    /**
     * 16 - nice magic value for default pool size
     * @param Class
     * @param {number} numberOfInstances
     */
    constructor(private Class:any, private numberOfInstances = 16){
        if (DEBUG && !Class) throw new DebugError(`can not instantiate ObjectPool: class not provided in constructor`);
    }

    getFreeObject():T{

        let c=0;
        for (let i:number=0;i<this.numberOfInstances;i++) {
            if (this._pool[i]  && this._pool[i].isCaptured()) c++;
        }
        if (c>=this.numberOfInstances-1) throw "";

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
        if (DEBUG) throw new DebugError(`can not get free object: no free object in pool`);
        return undefined;
    }

    releaseObject(obj:T){
        const indexOf:number = this._pool.indexOf(obj);
        if (DEBUG && indexOf==-1) {
            console.error(obj);
            throw new DebugError(`can not release the object: it does not belong to the pool`);
        }
        this._pool[indexOf].release();
    }


}
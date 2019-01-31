import {DebugError} from "../../debugError";




export class ObjectPool<T> {

    private _pool:T[] = [];
    private _cnt = 0;
    private readonly _numberOfInstances:number;

    /**
     * 16 - nice magic value for default pool size
     * @param Class
     * @param {number} numberOfInstances
     * @param {boolean} lazy -  if true array populated on demand
     */
    constructor(private Class:any, numberOfInstances = 16,lazy:boolean = true){
        this._numberOfInstances = numberOfInstances;
        if (DEBUG && !Class) throw new DebugError(`can not instantiate ObjectPool: class not provided in constructor`);
        if (!lazy) {
            for (let i=0;i<numberOfInstances;i++){
                this._pool.push(new Class());
            }
        }

    }

    getNextObject():T{
        let index:number = this._cnt++ % this._numberOfInstances;
        if (this._pool[index]===undefined) this._pool[index] = new this.Class();
        return this._pool[index];
    }

}
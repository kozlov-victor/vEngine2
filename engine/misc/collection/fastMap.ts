/**
 * it allows fast iterate through map keys without new array creation
 */
import {Optional} from "@engine/core/declarations";

export class FastMap<T,U> {

    private readonly _keys:T[] = [];
    private readonly _values:U[] = [];

    public put(key:T,value:U):void {
        const index:number = this._keys.indexOf(key);
        if (index===-1) {
            this._keys.push(key);
            this._values.push(value);
        } else {
            this._values[index] = value;
        }
    }

    public get(key:T):Optional<U>{
        const index:number = this._keys.indexOf(key);
        if (index===-1) return undefined;
        return this._values[index];
    }

    public has(key:T):boolean{
        const index:number = this._keys.indexOf(key);
        return index>-1;
    }

    public remove(key:T):void{
        const index:number = this._keys.indexOf(key);
        if (index===-1) return;
        this._keys.splice(index,1);
        this._values.splice(index,1);
    }

    public getKeys():T[]{
        return this._keys;
    }

    public getValues():U[]{
        return this._values;
    }

    public size():number{
        return this._keys.length;
    }

}


// let fm:FastMap<string,number> = new FastMap<string, number>();
// let obj:IKeyVal<number> = {};
// let max = 9999;
//
//
// let mem = (performance as  any).memory.usedJSHeapSize;
//
// console.time('obj');
// for (let i:number=0;i<max;i++) {
//     obj[i+'']=i;
// }
// for (let i:number=0;i<max;i++) {
//     let keys = Object.keys(obj);
//     //console.log(keys);
// }
// console.timeEnd('obj');
// console.log((performance as  any).memory.usedJSHeapSize - mem);
//
//
//
//
//
// let mem = (performance as  any).memory.usedJSHeapSize;
// console.time('fm ');
// for (let i:number=0;i<max;i++) {
//     fm.put(i+'',i);
// }
// for (let i:number=0;i<max;i++) {
//     fm.getKeys();
//     //console.log(keys);
// }
// console.timeEnd('fm ');
// console.log((performance as  any).memory.usedJSHeapSize - mem);


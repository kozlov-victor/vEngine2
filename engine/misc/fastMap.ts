/**
 * it allows fast iterate through map keys without new array creation
 */
import {IKeyVal} from "@engine/misc/object";

export class FastMap<T,U> {

    private readonly keys:T[] = [];
    private readonly values:U[] = [];

    put(key:T,value:U) {
        const index:number = this.keys.indexOf(key);
        if (index===-1) {
            this.keys.push(key);
            this.values.push(value);
        } else {
            this.values[index] = value;
        }
    }

    get(key:T):U{
        const index:number = this.keys.indexOf(key);
        if (index===-1) return null;
        return this.values[index];
    }

    remove(key:T):void{
        const index:number = this.keys.indexOf(key);
        if (index===-1) return;
        this.keys.splice(index,1);
        this.values.splice(index,1);
    }

    getKeys():T[]{
        return this.keys;
    }

    getValues():U[]{
        return this.values;
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
import {FastMap} from "@engine/misc/collection/fastMap";

export class LruMap<T,U> extends FastMap<T, U>{

    private keys:T[] = new Array<T>(this.capacity);

    constructor(private readonly capacity:number = 16) {
        super();
    }

    public put(key:T,value:U):void {
        this.keys.push(key);
        if (this.keys.length>this.capacity) {
            this.remove(this.keys[0]);
            this.keys.splice(0,1);
        }
        super.put(key,value);
    }

}

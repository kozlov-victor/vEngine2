import {DebugError} from "@engine/debug/debugError";

export class ResourceLink<T> {

    constructor(private url:string){}

    private target:T;

    getUrl():string{
        return this.url;
    }

    setTarget(t:T):void{
        this.target = t;
    }

    getTarget():T{
        if (DEBUG && this.target===undefined) throw new DebugError(`no target associated with resource link`);
        return this.target;
    }

}
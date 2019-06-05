import {DebugError} from "@engine/debug/debugError";

export class ResourceLink<T> {

    private target:T;

    constructor(public readonly url:string){}

    public getUrl():string{
        return this.url;
    }

    public setTarget(t:T):void{
        this.target = t;
    }

    public getTarget():T{
        if (DEBUG && this.target===undefined) throw new DebugError(`no target associated with resource link`);
        return this.target;
    }

}
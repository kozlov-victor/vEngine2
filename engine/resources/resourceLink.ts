import {Optional} from "@engine/core/declarations";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {DebugError} from "@engine/debug/debugError";

export const enum ResourceLinkState {
    CREATED = 'CREATED',
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    PENDING_ERROR = 'PENDING_ERROR'
}

class PromiseHolder<T> {

    public promise:Promise<T>;
    public resolve:(arg:T)=>void;
    public reject:()=>void;

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject;
        });
    }

}

export class ResourceLink<T> {

    public static create<T>(target:T):ResourceLink<T>{
        const url:string = 'url'+Math.random()+'_'+Math.random();
        const link:ResourceLink<T> = new ResourceLink<T>(url);
        link.setTarget(target);
        return link;
    }

    public type:'ResourceLink';
    private _state:ResourceLinkState = ResourceLinkState.CREATED;

    private _target:T;
    private _promiseHolder:Optional<PromiseHolder<T>>;
    private _loader:Optional<ResourceLoader>;

    constructor(public readonly url:string){}

    public getUrl():string{
        return this.url;
    }

    public setAsPending():void {
        this._state = ResourceLinkState.COMPLETED;
    }

    public setTarget(t:T):void{
        this._target = t;
        this._state = ResourceLinkState.COMPLETED;
        if (this._promiseHolder!==undefined) {
            this._promiseHolder.resolve(this._target);
        }
    }

    public setResourceLoader(loader:ResourceLoader):void {
        this._loader = loader;
    }

    public rejectTarget():void {
        this._state = ResourceLinkState.PENDING_ERROR;
    }

    public getTarget():T{
        return this._target;
    }

    public getState():ResourceLinkState {
        return this._state;
    }

    public asPromise():Promise<T>{
        if (DEBUG && !this._loader) {
            throw new DebugError(`resourceLoader must be set for asPromise() method`);
        }
        setTimeout(()=>{
            this._loader!.q.start();
        },1);
        if (this._state===ResourceLinkState.COMPLETED) {
            return Promise.resolve(this._target);
        }
        else if (this._state===ResourceLinkState.PENDING_ERROR) {
            return Promise.reject();
        }
        else {
            this._promiseHolder = new PromiseHolder<T>();
            return this._promiseHolder.promise;
        }
    }

}

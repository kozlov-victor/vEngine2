
const enum States {
    PENDING,
    FULFILLED,
    REJECTED
}

interface ICallBack<T> {
    fulfilled?: (result:T)=>void;
    rejected?: (result:T)=>void;
    next: PromisePolyfill<T>;
}

class PromisePolyfill<T> {

    constructor(executor:(resolve:(result:T)=>void,reject:(result:T)=>void)=>void) {
        this.state = States.PENDING;
        this.value = undefined!;
        this.callbacks = [];

        try {
            executor(this._resolve.bind(this), this._reject.bind(this));
        } catch (error) {
            console.log(error);
            this._reject(error);
        }
    }

    private state:States = States.PENDING;
    private callbacks:ICallBack<T>[] = [];
    private value:any;

    public static resolve<T>(result?:T):PromisePolyfill<T> {
        return new PromisePolyfill((resolve)=>{
           resolve(result!);
        });
    }

    public static reject<T>():PromisePolyfill<T> {
        return new PromisePolyfill((resolve,reject)=>{
            reject(undefined!);
        });
    }

    private static _findCallBackByState<T>(cb:ICallBack<T>,state:States):((result:T)=>void)|undefined{
        if (state===States.FULFILLED) return cb.fulfilled;
        else if (state===States.REJECTED) return cb.rejected;
        else return undefined;
    }

    public then(onFulfilled?:(result:T)=>void, onRejected?:(result:any)=>void):PromisePolyfill<T> {
        const next = new PromisePolyfill<T>(() => {});
        this.callbacks.push({
            fulfilled: onFulfilled,
            rejected: onRejected,
            next
        });
        return next;
    }

    public catch(onrejected:(result:T)=>void):PromisePolyfill<T> {
        return this.then(undefined, onrejected);
    }

    private _handleState(newState:States, result:any):void {
        if (result && typeof result.then === 'function') {
            return result.then(this._resolve.bind(this), this._reject.bind(this));
        }

        setTimeout(()=>{
            if (this.state === States.PENDING) {
                this.state = newState;
                this.value = result;
                this.callbacks.forEach(cb => {
                    const callback:((result:any)=>void)|undefined = PromisePolyfill._findCallBackByState(cb,this.state);
                    const next = cb.next;

                    if (typeof callback === 'function') {
                        this.state = States.FULFILLED;
                        try {
                            this.value = callback(result);
                        } catch(error) {
                            next._reject(error);
                        }
                    }

                    if (this.state === States.FULFILLED) {
                        return next._resolve(this.value);
                    }

                    if (this.state === States.REJECTED) {
                        return next._reject(this.value);
                    }
                });
            }
        },1);
    }

    private _resolve(result:any):void {
        this._handleState(States.FULFILLED, result);
    }

    private _reject(reason:any):void {
        this._handleState(States.REJECTED, reason);
    }
}

(window as any).Promise = PromisePolyfill;

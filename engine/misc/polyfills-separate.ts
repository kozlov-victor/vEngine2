
enum States {
    PENDING,
    FULFILLED,
    REJECTED
}

interface ICallBack {
    fulfilled?: (result:any)=>void;
    rejected?: (result:any)=>void;
    next: PromisePolyfill;
}

class PromisePolyfill {

    constructor(executor:(resolve:(result:any)=>void,reject:(result:any)=>void)=>void) {
        this.state = States.PENDING;
        this.value = undefined;
        this.callbacks = [];

        try {
            executor(this._resolve.bind(this), this._reject.bind(this));
        } catch (error) {
            console.log(error);
            this._reject(error);
        }
    }

    private state:States = States.PENDING;
    private callbacks:ICallBack[] = [];
    private value:any;

    private static _findCallBackByState(cb:ICallBack,state:States):((result:any)=>void)|undefined{
        if (state===States.FULFILLED) return cb.fulfilled;
        else if (state===States.REJECTED) return cb.rejected;
        else return undefined;
    }

    public then(onfulfilled?:(result:any)=>void, onrejected?:(result:any)=>void):PromisePolyfill {
        const next = new PromisePolyfill(() => {});
        this.callbacks.push({
            fulfilled: onfulfilled,
            rejected: onrejected,
            next
        });
        return next;
    }

    public catch(onrejected:(result:any)=>void):PromisePolyfill {
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
        },0);
    }

    private _resolve(result:any):void {
        this._handleState(States.FULFILLED, result);
    }

    private _reject(reason:any):void {
        this._handleState(States.REJECTED, reason);
    }
}

(window as any).Promise = PromisePolyfill;

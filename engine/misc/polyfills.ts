

if (DEBUG) {
    window.__POLYFILLS_INCLUDED__ = true;
}

if (typeof globalThis === 'undefined') (window as unknown as {globalThis:Window}).globalThis = window;

const rafPolyfill = (f:FrameRequestCallback):number=>{
    return (setTimeout(f,17) as unknown) as number;
};

globalThis.requestAnimationFrame =
    globalThis.requestAnimationFrame||
    globalThis.webkitRequestAnimationFrame||
    rafPolyfill;

if (!globalThis.cancelAnimationFrame) {
    globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
}

if (!Array.prototype.find) {
    // tslint:disable-next-line:typedef
    Array.prototype.find = function(predicate:(value:any,i:number,list:any)=>any) {
        if (!this && DEBUG) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function' && DEBUG) {
            throw new TypeError('predicate must be a function');
        }
        const list = Object(this);
        const length = list.length >>> 0;
        const thisArg = arguments[1];
        let value;

        for (let i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

if (!Array.prototype.findIndex) {
    // tslint:disable-next-line:typedef
    Array.prototype.findIndex = function(predicate) {
        if (this == null) {
            throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        const list = Object(this);
        const length:number = list.length >>> 0;
        const thisArg = arguments[1];
        let value:number;

        for (let i:number = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return i;
            }
        }
        return -1;
    };
}

if (!Float32Array.prototype.slice) {
    // tslint:disable-next-line:typedef
    Float32Array.prototype.slice = function(begin:number, end:number) {
        (this as any).slicedPortion = (this as any).slicedPortion || [];
        let cnt:number = 0;
        (this as any).slicedPortion.length = 0;
        for (let i:number=begin;i<end;i++) {
            (this as any).slicedPortion[cnt++] = this[i];
        }
        return (this as any).slicedPortion;
    };
}

if (!Float32Array.from) {
    // @ts-ignore
    Float32Array.from = (arr:number[])=> {
        return new Float32Array(arr);
    };
}


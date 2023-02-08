

if (DEBUG) {
    window.__POLYFILLS_INCLUDED__ = true;
}

if (typeof globalThis === 'undefined') (window as unknown as {globalThis:Window}).globalThis = window;

const rafPolyfill = (f:FrameRequestCallback):number=>{
    return (setTimeout(f,17) as unknown) as number;
};

globalThis.requestAnimationFrame =
    globalThis.requestAnimationFrame||
    (globalThis as any).webkitRequestAnimationFrame||
    rafPolyfill;

if (!globalThis.cancelAnimationFrame) {
    globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
}


if (!Array.prototype.findIndex) {
    Array.prototype.findIndex = function(predicate) {
        if (!this && DEBUG) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function' && DEBUG) {
            throw new TypeError('predicate must be a function');
        }
        const list = Object(this);
        const length = list.length >>> 0;
        // eslint-disable-next-line prefer-rest-params
        const thisArg = arguments[1];
        let value;

        for (let i = 0; i < length; ++i) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}

if (!Array.prototype.find) {
    Array.prototype.find = function(predicate:(value:any,i:number,list:any)=>any) {
        const index = this.findIndex(predicate);
        return this[index];
    };
}

if (!Array.prototype.fill) {
    (Array as any).prototype.fill = function(val:number) {
        for (let i=0;i<this.length;++i) {
            this[i] = val;
        }
    }
}

if (!Float32Array.prototype.fill) {
    (Float32Array as any).prototype.fill = Array.prototype.fill;
}

if (!Float32Array.prototype.join) {
    (Float32Array as any).prototype.join = Array.prototype.join;
}


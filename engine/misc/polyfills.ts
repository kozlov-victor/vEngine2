/* tslint:disable:no-string-literal ban-types*/


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

if (DEBUG) {
    window.__POLYFILLS_INCLUDED__ = true;
}



if (!Array.prototype['find']) {
    Array.prototype['find'] = function(predicate:Function) {
        if (!this && DEBUG) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function' && DEBUG) {
            throw new TypeError('predicate must be a function');
        }
        const list = Object(this);
        const length = list['length'] >>> 0;
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

// if (!Object.keys) {
//     Object.keys = (function() {
//         'use strict';
//         let hasOwnProperty = Object.prototype.hasOwnProperty,
//             hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
//             dontEnums = [
//                 'toString',
//                 'toLocaleString',
//                 'valueOf',
//                 'hasOwnProperty',
//                 'isPrototypeOf',
//                 'propertyIsEnumerable',
//                 'constructor'
//             ],
//             dontEnumsLength = dontEnums.length;
//
//         return function(obj) {
//             if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
//                 throw new TypeError('Object.keys called on non-object');
//             }
//
//             let result = [], prop, i;
//
//             for (prop in obj) {
//                 if (hasOwnProperty.call(obj, prop)) {
//                     result.push(prop);
//                 }
//             }
//
//             if (hasDontEnumBug) {
//                 for (i = 0; i < dontEnumsLength; i++) {
//                     if (hasOwnProperty.call(obj, dontEnums[i])) {
//                         result.push(dontEnums[i]);
//                     }
//                 }
//             }
//             return result;
//         };
//     }());
// }

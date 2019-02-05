


(window as any).requestAnimationFrame =
    window.requestAnimationFrame||
    window.webkitRequestAnimationFrame||
    function(f:Function){setTimeout(f,17)};

if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = (id) => clearTimeout(id);
}

// if (!Array.prototype['find']) {
//     Array.prototype['find'] = function(predicate:Function) {
//         if (this == null && DEBUG) {
//             throw new TypeError('Array.prototype.find called on null or undefined');
//         }
//         if (typeof predicate !== 'function' && DEBUG) {
//             throw new TypeError('predicate must be a function');
//         }
//         let list = Object(this);
//         let length = list['length'] >>> 0;
//         let thisArg = arguments[1];
//         let value;
//
//         for (let i = 0; i < length; i++) {
//             value = list[i];
//             if (predicate.call(thisArg, value, i, list)) {
//                 return value;
//             }
//         }
//         return undefined;
//     };
// }

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

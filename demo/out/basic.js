/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 79);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var DebugError = (function (_super) {
    tslib_1.__extends(DebugError, _super);
    function DebugError(message) {
        var _this = _super.call(this, message) || this;
        if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, _this.constructor);
        }
        else {
            _this.stack = (new Error()).stack;
        }
        _this.name = 'DebugError';
        _this.errorMessage = message;
        return _this;
    }
    DebugError.prototype.toString = function () {
        return this.errorMessage;
    };
    return DebugError;
}(Error));
exports.DebugError = DebugError;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __exportStar(m, exports) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var objectPool_1 = __webpack_require__(9);
var observableEntity_1 = __webpack_require__(15);
var Point2d = (function (_super) {
    tslib_1.__extends(Point2d, _super);
    function Point2d(x, y, onChangedFn) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = _super.call(this) || this;
        _this._x = 0;
        _this._y = 0;
        _this._x = x;
        _this._y = y;
        if (onChangedFn)
            _this.addListener(onChangedFn);
        return _this;
    }
    Point2d.fromPool = function () {
        return Point2d.pool.getFreeObject();
    };
    Object.defineProperty(Point2d.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this.setX(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Point2d.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this.setY(value);
        },
        enumerable: true,
        configurable: true
    });
    Point2d.prototype.setXY = function (x, y) {
        if (y === void 0) { y = x; }
        this._x = x;
        this._y = y;
        this.triggerObservable();
        return this;
    };
    Point2d.prototype.setX = function (x) {
        this._x = x;
        this.triggerObservable();
        return this;
    };
    Point2d.prototype.setY = function (y) {
        this._y = y;
        this.triggerObservable();
        return this;
    };
    Point2d.prototype.set = function (another) {
        this.setXY(another._x, another._y);
        this.triggerObservable();
        return this;
    };
    Point2d.prototype.add = function (another) {
        this.addXY(another._x, another._y);
        this.triggerObservable();
        return this;
    };
    Point2d.prototype.substract = function (another) {
        this.addXY(-another._x, -another._y);
        this.triggerObservable();
        return this;
    };
    Point2d.prototype.multiply = function (n) {
        this._x *= n;
        this._y *= n;
        this.triggerObservable();
        return this;
    };
    Point2d.prototype.addXY = function (x, y) {
        this._x += x;
        this._y += y;
        this.triggerObservable();
        return this;
    };
    Point2d.prototype.addX = function (x) {
        this._x += x;
        this.triggerObservable();
        return this;
    };
    Point2d.prototype.addY = function (y) {
        this._y += y;
        this.triggerObservable();
        return this;
    };
    Point2d.prototype.negative = function () {
        this._x = -this._x;
        this._y = -this._y;
        this.triggerObservable();
        return this;
    };
    Point2d.prototype.equal = function (val) {
        return this._x === val && this._y === val;
    };
    Point2d.prototype.equalXY = function (x, y) {
        return this._x === x && this._y === y;
    };
    Point2d.prototype.equalPoint = function (point) {
        return this._x === point._x && this._y === point._y;
    };
    Point2d.prototype.clone = function () {
        return new Point2d(this._x, this._y);
    };
    Point2d.prototype.fromJSON = function (json) {
        this.setXY(json.x, json.y);
    };
    Point2d.prototype.toJSON = function () {
        return { x: this._x, y: this._y };
    };
    Point2d.prototype.toArray = function () {
        if (!this._arr)
            this._arr = new Array(2);
        this._arr[0] = this._x;
        this._arr[1] = this._y;
        return this._arr;
    };
    Point2d.pool = new objectPool_1.ObjectPool(Point2d, 4);
    return Point2d;
}(observableEntity_1.ObservableEntity));
exports.Point2d = Point2d;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var size_1 = __webpack_require__(4);
var point2d_1 = __webpack_require__(2);
var objectPool_1 = __webpack_require__(9);
var observableEntity_1 = __webpack_require__(15);
var Rect = (function (_super) {
    tslib_1.__extends(Rect, _super);
    function Rect(x, y, width, height, onChangedFn) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        var _this = _super.call(this) || this;
        _this.point = new point2d_1.Point2d();
        _this.size = new size_1.Size();
        if (onChangedFn)
            _this.addListener(onChangedFn);
        _this.setXYWH(x, y, width, height);
        return _this;
    }
    Rect.fromPool = function () {
        return Rect.rectPool.getFreeObject();
    };
    Rect.prototype.observe = function (onChangedFn) {
        this.addListener(onChangedFn);
    };
    Rect.prototype.revalidate = function () {
        this._right = this.point.x + this.size.width;
        this._bottom = this.point.y + this.size.height;
        this.triggerObservable();
    };
    Rect.prototype.setXYWH = function (x, y, width, height) {
        this.point.setXY(x, y);
        this.size.setWH(width, height);
        this.revalidate();
        return this;
    };
    Rect.prototype.setXY = function (x, y) {
        this.point.setXY(x, y);
        this.revalidate();
        return this;
    };
    Rect.prototype.setWH = function (width, height) {
        this.size.setWH(width, height);
        this.revalidate();
        return this;
    };
    Rect.prototype.set = function (another) {
        this.setPoint(another.point);
        this.setSize(another.size);
        return this;
    };
    Rect.prototype.setSize = function (s) {
        this.size.setWH(s.width, s.height);
        return this;
    };
    Rect.prototype.setPoint = function (p) {
        this.point.setXY(p.x, p.y);
        return this;
    };
    Rect.prototype.addXY = function (x, y) {
        this.point.addXY(x, y);
        return this;
    };
    Rect.prototype.addPoint = function (another) {
        this.addXY(another.x, another.y);
        return this;
    };
    Rect.prototype.clone = function () {
        return new Rect(this.point.x, this.point.y, this.size.width, this.size.height);
    };
    Rect.prototype.toJSON = function () {
        return {
            x: this.point.x,
            y: this.point.y,
            width: this.size.width,
            height: this.size.height
        };
    };
    Object.defineProperty(Rect.prototype, "right", {
        get: function () {
            return this._right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "bottom", {
        get: function () {
            return this._bottom;
        },
        enumerable: true,
        configurable: true
    });
    Rect.prototype.fromJSON = function (jsonObj) {
        this.setXYWH(jsonObj.x, jsonObj.y, jsonObj.width, jsonObj.height);
    };
    Rect.rectPool = new objectPool_1.ObjectPool(Rect);
    return Rect;
}(observableEntity_1.ObservableEntity));
exports.Rect = Rect;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var objectPool_1 = __webpack_require__(9);
var observableEntity_1 = __webpack_require__(15);
var Size = (function (_super) {
    tslib_1.__extends(Size, _super);
    function Size(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        var _this = _super.call(this) || this;
        _this._width = width;
        _this._height = height;
        return _this;
    }
    Size.fromPool = function () {
        return Size.rectPool.getFreeObject();
    };
    Size.prototype.setW = function (width) {
        this._width = width;
        this.triggerObservable();
        return this;
    };
    Size.prototype.setH = function (height) {
        this._height = height;
        this.triggerObservable();
        return this;
    };
    Size.prototype.setWH = function (width, height) {
        if (height === void 0) { height = width; }
        this._width = width;
        this._height = height;
        this.triggerObservable();
        return this;
    };
    Size.prototype.set = function (another) {
        this._width = another._width;
        this._height = another._height;
        this.triggerObservable();
        return this;
    };
    Object.defineProperty(Size.prototype, "width", {
        get: function () {
            return this._width;
        },
        set: function (val) {
            this._width = val;
            this.triggerObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Size.prototype, "height", {
        get: function () {
            return this._height;
        },
        set: function (val) {
            this._height = val;
            this.triggerObservable();
        },
        enumerable: true,
        configurable: true
    });
    Size.rectPool = new objectPool_1.ObjectPool(Size);
    return Size;
}(observableEntity_1.ObservableEntity));
exports.Size = Size;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var objectPool_1 = __webpack_require__(9);
var Color = (function () {
    function Color(r, g, b, a) {
        this._arr = null;
        this.type = 'Color';
        this._captured = false;
        this.setRGBA(r, g, b, a);
    }
    Color.prototype.normalizeToZeroOne = function () {
        this.rNorm = this.r / 0xff;
        this.gNorm = this.g / 0xff;
        this.bNorm = this.b / 0xff;
        this.aNorm = this.a / 0xff;
    };
    Color.prototype.setRGBA = function (r, g, b, a) {
        if (a === void 0) { a = 255; }
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.normalizeToZeroOne();
    };
    Color.prototype.setRGB = function (r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = 255;
        this.normalizeToZeroOne();
    };
    Color.prototype.setR = function (val) {
        this.r = val;
        this.normalizeToZeroOne();
    };
    Color.prototype.setG = function (val) {
        this.g = val;
        this.normalizeToZeroOne();
    };
    Color.prototype.setB = function (val) {
        this.b = val;
        this.normalizeToZeroOne();
    };
    Color.prototype.setA = function (val) {
        this.a = val;
        this.normalizeToZeroOne();
    };
    Color.prototype.set = function (another) {
        this.setRGBA(another.r, another.g, another.b, another.a);
    };
    Color.prototype.clone = function () {
        return new Color(this.r, this.g, this.b, this.a);
    };
    Color.prototype.capture = function () {
        this._captured = true;
    };
    Color.prototype.isCaptured = function () {
        return this._captured;
    };
    Color.prototype.release = function () {
        this._captured = false;
    };
    Color.getFromPool = function () {
        if (Color.objectPool === undefined)
            Color.objectPool = new objectPool_1.ObjectPool(Color);
        return Color.objectPool.getFreeObject();
    };
    Color.RGB = function (r, g, b, a) {
        var c = new Color(0, 0, 0);
        c.setRGBA(r, g, b, a);
        return c;
    };
    Color.prototype.asGL = function () {
        if (this._arr === null)
            this._arr = new Array(3);
        this._arr[0] = this.rNorm;
        this._arr[1] = this.gNorm;
        this._arr[2] = this.bNorm;
        this._arr[3] = this.aNorm;
        return this._arr;
    };
    Color.prototype.asCSS = function () {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
    };
    Color.prototype.toJSON = function () {
        return { r: this.r, g: this.g, b: this.b, a: this.a };
    };
    Color.prototype.fromJSON = function (json) {
        this.setRGBA(json.r, json.g, json.b, json.a);
    };
    Color.WHITE = Color.RGB(255, 255, 255);
    Color.GREY = Color.RGB(127, 127, 127);
    Color.BLACK = Color.RGB(0, 0, 0);
    Color.NONE = Color.RGB(0, 0, 0, 0);
    return Color;
}());
exports.Color = Color;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(44);
var camera_1 = __webpack_require__(25);
var point2d_1 = __webpack_require__(2);
var lightArray_1 = __webpack_require__(45);
var colliderEngine_1 = __webpack_require__(47);
var debugError_1 = __webpack_require__(0);
var SCALE_STRATEGY;
(function (SCALE_STRATEGY) {
    SCALE_STRATEGY[SCALE_STRATEGY["NO_SCALE"] = 0] = "NO_SCALE";
    SCALE_STRATEGY[SCALE_STRATEGY["FIT"] = 1] = "FIT";
    SCALE_STRATEGY[SCALE_STRATEGY["STRETCH"] = 2] = "STRETCH";
})(SCALE_STRATEGY = exports.SCALE_STRATEGY || (exports.SCALE_STRATEGY = {}));
var Game = (function () {
    function Game() {
        this._lastTime = 0;
        this._currTime = 0;
        this._deltaTime = 0;
        this._running = false;
        this._destroyed = false;
        this._controls = [];
        this.scale = new point2d_1.Point2d(1, 1);
        this.pos = new point2d_1.Point2d(0, 0);
        this.width = 320;
        this.height = 240;
        this.gravityConstant = 0;
        this.fps = 0;
        this.scaleStrategy = SCALE_STRATEGY.FIT;
        this._cnt = 0;
        this.collider = new colliderEngine_1.ColliderEngine(this);
        this.camera = new camera_1.Camera(this);
        this.lightArray = new lightArray_1.LightArray(this);
        Game.instance = this;
        if (true)
            window['game'] = this;
    }
    Game.getInstance = function () {
        return Game.instance;
    };
    Game.prototype.addControl = function (C) {
        var instance = new C(this);
        if (true) {
            for (var _i = 0, _a = this._controls; _i < _a.length; _i++) {
                var c = _a[_i];
                if (c.type === instance.type) {
                    throw new debugError_1.DebugError("control with type \"" + c.type + "\" added already");
                }
            }
        }
        this._controls.push(instance);
        instance.listenTo();
    };
    Game.prototype.setAudioPLayer = function (p) {
        this.audioPlayer = new p(this);
    };
    Game.prototype.getAudioPlayer = function () {
        if ( true && !this.audioPlayer) {
            throw new debugError_1.DebugError('audio player is not set');
        }
        return this.audioPlayer;
    };
    Game.prototype.isOfType = function (instance, C) {
        return instance instanceof C;
    };
    Game.prototype.getControl = function (T) {
        for (var _i = 0, _a = this._controls; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c instanceof T) {
                if (this.isOfType(c, T))
                    return c;
            }
        }
        if (true)
            throw new debugError_1.DebugError('no such control');
    };
    Game.prototype.hasControl = function (type) {
        for (var _i = 0, _a = this._controls; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.type === type) {
                return true;
            }
        }
        return false;
    };
    Game.prototype.getTime = function () {
        return this._lastTime;
    };
    Game.prototype.getDeltaTime = function () {
        return this._deltaTime;
    };
    Game.prototype.log = function (args) {
        if (true)
            this._renderer.log(args);
    };
    Game.prototype.clearLog = function () {
        if (true)
            this._renderer.clearLog();
    };
    Game.prototype.setRenderer = function (Renderer) {
        this._renderer = new Renderer(this);
    };
    Game.prototype.getRenderer = function () {
        return this._renderer;
    };
    Game.prototype.debug2 = function () {
        var val = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            val[_i] = arguments[_i];
        }
        this._cnt++;
        if (this._cnt > 10)
            throw new debugError_1.DebugError('too many logs');
    };
    Game.prototype.runScene = function (scene) {
        var _this = this;
        this._currentScene = scene;
        this.revalidate();
        scene.onPreloading();
        scene.resourceLoader.onProgress(function () {
            scene.onProgress(scene.resourceLoader.getProgress());
        });
        scene.resourceLoader.startLoading();
        if (!this._running)
            this.update();
        this._running = true;
        scene.resourceLoader.onCompleted(function () {
            _this._currentScene.onReady();
        });
    };
    Game.prototype.getCurrScene = function () {
        if ( true && !this._currentScene)
            throw new debugError_1.DebugError("current scene is not set yet");
        return this._currentScene;
    };
    Game.prototype.update = function () {
        if (this._destroyed)
            return;
        this._lastTime = this._currTime;
        this._currTime = Date.now();
        var currTimeCopy = this._currTime;
        if (!this._lastTime)
            this._lastTime = this._currTime;
        this._deltaTime = this._currTime - this._lastTime;
        if (true) {
            this.fps = ~~(1000 / this._deltaTime);
            var renderError = this._renderer.getError();
            if (renderError)
                throw new debugError_1.DebugError("render error with code " + renderError);
        }
        var numOfLoops = (~~(this._deltaTime / Game.UPDATE_TIME_RATE)) || 1;
        var currTime = this._currTime - numOfLoops * Game.UPDATE_TIME_RATE;
        var loopCnt = 0;
        do {
            this._currentScene.update();
            for (var _i = 0, _a = this._controls; _i < _a.length; _i++) {
                var c = _a[_i];
                c.update();
            }
            currTime += Game.UPDATE_TIME_RATE;
            loopCnt++;
            if (loopCnt > 10) {
                this._lastTime = this._currTime = currTimeCopy;
                break;
            }
        } while (loopCnt < numOfLoops);
        this._currentScene.render();
        requestAnimationFrame(this.update.bind(this));
    };
    Game.prototype.destroy = function () {
        this._destroyed = true;
        for (var _i = 0, _a = this._controls; _i < _a.length; _i++) {
            var c = _a[_i];
            c.destroy();
        }
        this._renderer.cancelFullScreen();
        this._renderer.destroy();
    };
    Game.prototype.revalidate = function () {
        if ( true && !this._renderer)
            throw new debugError_1.DebugError("game renderer is not set");
        this.camera.revalidate();
    };
    Game.UPDATE_TIME_RATE = 20;
    return Game;
}());
exports.Game = Game;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var debugError_1 = __webpack_require__(0);
var parseErrors = function (log) {
    if (false)
        {}
    var logs = [];
    var result;
    while (!!(result = log.match(/ERROR\:([^\n]+)/))) {
        log = log.slice(result.index + 1);
        var line = result[1].trim();
        var seps = line.split(':');
        var message = seps.slice(2).join(':').trim();
        var lineNum = parseInt(seps[1], 10);
        logs.push({ message: message, lineNum: lineNum });
    }
    return logs;
};
exports.compileShader = function (gl, shaderSource, shaderType) {
    if (true) {
        if (!shaderSource)
            throw new debugError_1.DebugError("can not compile shader: shader source not specified for type " + shaderType);
    }
    var shader = gl.createShader(shaderType);
    if ( true && !shader)
        throw new debugError_1.DebugError("can not allocate memory for shader: gl.createShader(shaderType)");
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        var lastError = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        if (true) {
            var parsedLogs = parseErrors(lastError);
            var lines_1 = shaderSource.split('\n');
            var errorMsg_1 = '';
            var arrow_1 = '----->';
            parsedLogs.forEach(function (inf) {
                var i = inf.lineNum - 1;
                if (lines_1[i].indexOf(arrow_1) == -1)
                    lines_1[i] = arrow_1 + " " + lines_1[i];
                errorMsg_1 += lines_1[i] + " <----" + inf.message + "\n";
            });
            console.log(lines_1.join('\n'));
            throw new debugError_1.DebugError("Error compiling shader: " + (errorMsg_1 ? errorMsg_1 : lastError));
        }
        else {}
    }
    return shader;
};
exports.createProgram = function (gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    if ( true && !program)
        throw new debugError_1.DebugError("can not allocate memory for gl.createProgram()");
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        gl.deleteProgram(program);
        var lastError = gl.getProgramInfoLog(program);
        if (true) {
            var status = gl.getProgramParameter(program, gl.VALIDATE_STATUS);
            console.error('VALIDATE_STATUS', status);
            throw new debugError_1.DebugError("Error in program linking " + lastError);
        }
        else {}
    }
    return program;
};
var GL_TABLE = null;
exports.GL_TYPE = {
    FLOAT: 'float',
    FLOAT_VEC2: 'vec2',
    FLOAT_VEC3: 'vec3',
    FLOAT_VEC4: 'vec4',
    INT: 'int',
    INT_VEC2: 'ivec2',
    INT_VEC3: 'ivec3',
    INT_VEC4: 'ivec4',
    BOOL: 'bool',
    BOOL_VEC2: 'bvec2',
    BOOL_VEC3: 'bvec3',
    BOOL_VEC4: 'bvec4',
    FLOAT_MAT2: 'mat2',
    FLOAT_MAT3: 'mat3',
    FLOAT_MAT4: 'mat4',
    SAMPLER_2D: 'sampler2D',
};
var mapType = function (gl, type) {
    if (!GL_TABLE) {
        var typeNames = Object.keys(exports.GL_TYPE);
        GL_TABLE = {};
        for (var i = 0; i < typeNames.length; ++i) {
            var tn = typeNames[i];
            GL_TABLE[gl[tn]] = exports.GL_TYPE[tn];
        }
    }
    return GL_TABLE[type];
};
exports.normalizeUniformName = function (s) {
    if ( true && s.indexOf(' ') > -1)
        throw new debugError_1.DebugError("bad uniform name: \"" + s + "\"");
    if (s.indexOf('[') > -1)
        return s.split('[')[0];
    else
        return s;
};
exports.extractUniforms = function (gl, program) {
    var glProgram = program.getProgram();
    var activeUniforms = gl.getProgramParameter(glProgram, gl.ACTIVE_UNIFORMS);
    var uniforms = {};
    for (var i = 0; i < activeUniforms; i++) {
        var uniformData = gl.getActiveUniform(glProgram, i);
        if ( true && !uniformData)
            throw new debugError_1.DebugError("can not receive active uniforms info: gl.getActiveUniform()");
        var type = mapType(gl, uniformData.type);
        var name = exports.normalizeUniformName(uniformData.name);
        var location = gl.getUniformLocation(glProgram, name);
        uniforms[name] = {
            type: type,
            size: uniformData.size,
            location: location,
            setter: getUniformSetter(uniformData.size, type)
        };
    }
    return uniforms;
};
exports.extractAttributes = function (gl, program) {
    var glProgram = program.getProgram();
    var activeAttributes = gl.getProgramParameter(glProgram, gl.ACTIVE_ATTRIBUTES);
    var attrMap = {};
    for (var i = 0; i < activeAttributes; i++) {
        var attrData = gl.getActiveAttrib(glProgram, i);
        if ( true && !attrData)
            throw new debugError_1.DebugError("can not receive active attribute info: gl.getActiveAttrib()");
        var location = gl.getAttribLocation(glProgram, attrData.name);
        if ( true && location < 0) {
            console.log(program);
            throw new debugError_1.DebugError("error finding attribute location: " + attrData.name);
        }
        attrMap[attrData.name] = location;
    }
    return attrMap;
};
var TypeNumber = {
    check: function (val) {
        if (isNaN(parseFloat(val)) || !isFinite(val))
            throw new debugError_1.DebugError("can not set uniform with value " + val + ": expected argument of type number");
    }
};
var TypeInt = {
    check: function (val) {
        TypeNumber.check(val);
        if (val !== ~~val)
            throw new debugError_1.DebugError("can not set uniform with value " + val + ": expected argument of integer type, but " + val + " found");
    }
};
var TypeBool = {
    check: function (val) {
        if (!(val == true || val == false))
            throw new debugError_1.DebugError("can not set uniform with value " + val + ": expected argument of boolean type, but " + val + " found");
    }
};
var TypeArray = function (checker, size) {
    return {
        check: function (val) {
            if (!val)
                throw new debugError_1.DebugError("can not set uniform  value: " + val);
            if (!val.splice) {
                console.error('Can not set uniform value', val);
                throw new debugError_1.DebugError("can not set uniform with value [" + val + "]: expected argument of type Array");
            }
            if (size !== undefined && val.length !== size)
                throw new debugError_1.DebugError("can not set uniform with value [" + val + "]: expected array with size " + size + ", but " + val.length + " found");
            for (var i = 0; i < val.length; i++) {
                try {
                    checker.check(val[i]);
                }
                catch (e) {
                    console.error('Can not set uniform array item', val);
                    throw new debugError_1.DebugError("can not set uniform array item with value [" + val + "]: unexpected array element type: " + val[i]);
                }
            }
        }
    };
};
var expect = function (value, typeChecker) {
    typeChecker.check(value);
};
var getUniformSetter = function (size, type) {
    if (size === 1) {
        switch (type) {
            case exports.GL_TYPE.FLOAT: return function (gl, location, value) {
                 true && expect(value, TypeNumber);
                gl.uniform1f(location, value);
            };
            case exports.GL_TYPE.FLOAT_VEC2: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeNumber, 2));
                gl.uniform2f(location, value[0], value[1]);
            };
            case exports.GL_TYPE.FLOAT_VEC3: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeNumber, 3));
                gl.uniform3f(location, value[0], value[1], value[2]);
            };
            case exports.GL_TYPE.FLOAT_VEC4: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeNumber, 4));
                gl.uniform4f(location, value[0], value[1], value[2], value[3]);
            };
            case exports.GL_TYPE.INT: return function (gl, location, value) {
                 true && expect(value, TypeInt);
                gl.uniform1i(location, value);
            };
            case exports.GL_TYPE.INT_VEC2: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeInt, 2));
                gl.uniform2i(location, value[0], value[1]);
            };
            case exports.GL_TYPE.INT_VEC3: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeInt, 3));
                gl.uniform3i(location, value[0], value[1], value[2]);
            };
            case exports.GL_TYPE.INT_VEC4: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeInt, 4));
                gl.uniform4i(location, value[0], value[1], value[2], value[3]);
            };
            case exports.GL_TYPE.BOOL: return function (gl, location, value) {
                 true && expect(value, TypeBool);
                gl.uniform1i(location, value);
            };
            case exports.GL_TYPE.BOOL_VEC2: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeBool, 2));
                gl.uniform2i(location, value[0], value[1]);
            };
            case exports.GL_TYPE.BOOL_VEC3: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeBool, 3));
                gl.uniform3i(location, value[0], value[1], value[2]);
            };
            case exports.GL_TYPE.BOOL_VEC4: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeBool, 4));
                gl.uniform4i(location, value[0], value[1], value[2], value[3]);
            };
            case exports.GL_TYPE.FLOAT_MAT2: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeNumber, 2 * 2));
                gl.uniformMatrix2fv(location, false, value);
            };
            case exports.GL_TYPE.FLOAT_MAT3: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeNumber, 3 * 3));
                gl.uniformMatrix3fv(location, false, value);
            };
            case exports.GL_TYPE.FLOAT_MAT4: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeNumber, 4 * 4));
                gl.uniformMatrix4fv(location, false, value);
            };
            case exports.GL_TYPE.SAMPLER_2D: return function (gl, location, value) {
                 true && expect(value, TypeInt);
                gl.uniform1i(location, value);
            };
            default:
                if (true)
                    throw new debugError_1.DebugError("can not set uniform for type " + type + " and size " + size);
                break;
        }
    }
    else {
        switch (type) {
            case exports.GL_TYPE.FLOAT: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeNumber, size));
                gl.uniform1fv(location, value);
            };
            case exports.GL_TYPE.FLOAT_VEC2: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeNumber, size * 2));
                gl.uniform2fv(location, value);
            };
            case exports.GL_TYPE.FLOAT_VEC3: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeNumber, size * 3));
                gl.uniform3fv(location, value);
            };
            case exports.GL_TYPE.FLOAT_VEC4: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeNumber, size * 4));
                gl.uniform4fv(location, value);
            };
            case exports.GL_TYPE.INT: return function (gl, location, value) {
                 true && expect(value, TypeInt);
                gl.uniform1iv(location, value);
            };
            case exports.GL_TYPE.INT_VEC2: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeInt, size * 2));
                gl.uniform2iv(location, value);
            };
            case exports.GL_TYPE.INT_VEC3: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeInt, size * 3));
                gl.uniform3iv(location, value);
            };
            case exports.GL_TYPE.INT_VEC4: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeInt, size * 4));
                gl.uniform4iv(location, value);
            };
            case exports.GL_TYPE.BOOL: return function (gl, location, value) {
                 true && expect(value, TypeBool);
                gl.uniform1iv(location, value);
            };
            case exports.GL_TYPE.BOOL_VEC2: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeBool, size * 2));
                gl.uniform2iv(location, value);
            };
            case exports.GL_TYPE.BOOL_VEC3: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeBool, size * 3));
                gl.uniform3iv(location, value);
            };
            case exports.GL_TYPE.BOOL_VEC4: return function (gl, location, value) {
                 true && expect(value, TypeArray(TypeBool, size * 4));
                gl.uniform4iv(location, value);
            };
            case exports.GL_TYPE.SAMPLER_2D: return function (gl, location, value) {
                 true && expect(value, TypeInt);
                gl.uniform1iv(location, value);
            };
            default:
                if (true)
                    throw new debugError_1.DebugError("can not set uniform for type " + type + " and size " + size);
                break;
        }
    }
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var point2d_1 = __webpack_require__(2);
var mat4_1 = __webpack_require__(11);
var MathEx;
(function (MathEx) {
    MathEx.isPointInRect = function (point, rect, angle) {
        return point.x > rect.point.x &&
            point.x < (rect.point.x + rect.size.width) &&
            point.y > rect.point.y &&
            point.y < (rect.point.y + rect.size.height);
    };
    MathEx.overlapTest = function (a, b) {
        return (a.point.x < b.point.x + b.size.width) &&
            (a.point.x + a.size.width > b.point.x) &&
            (a.point.y < b.point.y + b.size.height) &&
            (a.point.y + a.size.height > b.point.y);
    };
    MathEx.radToDeg = function (rad) {
        return rad * 180 / Math.PI;
    };
    MathEx.degToRad = function (deg) {
        return deg * Math.PI / 180;
    };
    MathEx.rectToPolar = function (point, center) {
        var radius = Math.sqrt(point.x * point.x + center.y * center.y);
        var angle = Math.atan2(center.y - point.y, center.x - point.x);
        return { radius: radius, angle: angle };
    };
    MathEx.polarToRect = function (radius, angle, center) {
        var x = radius * Math.cos(angle);
        var y = radius * Math.sin(angle);
        return new point2d_1.Point2d(center.x - x, center.y - y);
    };
    MathEx.getDistanceSquared = function (p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    };
    MathEx.closeTo = function (a, b, epsilon) {
        if (epsilon === void 0) { epsilon = 0.01; }
        return Math.abs(a - b) <= epsilon;
    };
    MathEx.getDistance = function (p1, p2) {
        return Math.sqrt(MathEx.getDistanceSquared(p1, p2));
    };
    MathEx.getAngle = function (p1, p2) {
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        return Math.atan2(dy, dx);
    };
    MathEx.random = function (min, max) {
        if (min > max) {
            var tmp = min;
            min = max;
            max = tmp;
        }
        var res = ~~(Math.random() * (max + 1 - min)) + min;
        if (res > max)
            res = max;
        else if (res < min)
            res = min;
        return res;
    };
    MathEx.unProject = function (winPoint, width, height, viewProjectionMatrix) {
        var x = 2.0 * winPoint.x / width - 1;
        var y = 2.0 * winPoint.y / height - 1;
        var viewProjectionInverse = mat4_1.mat4.inverse(viewProjectionMatrix);
        var point3D = [x, y, 0, 1];
        var res = mat4_1.mat4.multMatrixVec(viewProjectionInverse, point3D);
        res[0] = (res[0] / 2 + 0.5) * width;
        res[1] = (res[1] / 2 + 0.5) * height;
        return new point2d_1.Point2d(res[0], res[1]);
    };
})(MathEx = exports.MathEx || (exports.MathEx = {}));


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var debugError_1 = __webpack_require__(0);
var ObjectPool = (function () {
    function ObjectPool(Class, numberOfInstances) {
        if (numberOfInstances === void 0) { numberOfInstances = 16; }
        this.Class = Class;
        this.numberOfInstances = numberOfInstances;
        this._pool = [];
        if ( true && !Class)
            throw new debugError_1.DebugError("can not instantiate ObjectPool: class not provided in constructor");
    }
    ObjectPool.prototype.getFreeObject = function () {
        var c = 0;
        for (var i = 0; i < this.numberOfInstances; i++) {
            if (this._pool[i] && this._pool[i].isCaptured())
                c++;
        }
        if (c >= this.numberOfInstances - 1)
            throw "";
        for (var i = 0; i < this.numberOfInstances; i++) {
            var current = this._pool[i];
            if (current === undefined) {
                current = this._pool[i] = new this.Class();
                current.capture();
                return current;
            }
            else if (!current.isCaptured()) {
                current.capture();
                return current;
            }
        }
        if (true)
            throw new debugError_1.DebugError("can not get free object: no free object in pool");
        return undefined;
    };
    ObjectPool.prototype.releaseObject = function (obj) {
        var indexOf = this._pool.indexOf(obj);
        if ( true && indexOf == -1) {
            console.error(obj);
            throw new debugError_1.DebugError("can not release the object: it does not belong to the pool");
        }
        this._pool[indexOf].release();
    };
    return ObjectPool;
}());
exports.ObjectPool = ObjectPool;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MOUSE_EVENTS = {
    click: 'click',
    mouseDown: 'mouseDown',
    mouseMove: 'mouseMove',
    mouseLeave: 'mouseLeave',
    mouseEnter: 'mouseEnter',
    mouseUp: 'mouseUp',
    doubleClick: 'doubleClick',
    scroll: 'scroll'
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var debugError_1 = __webpack_require__(0);
var mat4;
(function (mat4) {
    mat4.makeIdentity = function () {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    };
    mat4.makeZToWMatrix = function (fudgeFactor) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, fudgeFactor,
            0, 0, 0, 1
        ];
    };
    mat4.make2DProjection = function (width, height, depth) {
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1
        ];
    };
    mat4.ortho = function (left, right, bottom, top, near, far) {
        var lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
        var out = new Array(16);
        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 2 * nf;
        out[11] = 0;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;
        return out;
    };
    mat4.perspective = function (fovy, aspect, near, far) {
        var f = 1.0 / Math.tan(fovy / 2), nf = 1 / (near - far);
        var out = new Array(16);
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = (2 * far * near) * nf;
        out[15] = 0;
        return out;
    };
    mat4.makeTranslation = function (tx, ty, tz) {
        return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            tx, ty, tz, 1
        ];
    };
    mat4.makeXRotation = function (angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ];
    };
    mat4.makeYRotation = function (angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ];
    };
    mat4.makeZRotation = function (angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ];
    };
    mat4.makeScale = function (sx, sy, sz) {
        return [
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        ];
    };
    mat4.matrixMultiply = function (a, b) {
        var r = new Array(16);
        r[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12];
        r[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13];
        r[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14];
        r[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15];
        r[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12];
        r[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13];
        r[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14];
        r[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15];
        r[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12];
        r[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13];
        r[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14];
        r[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15];
        r[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12];
        r[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13];
        r[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14];
        r[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15];
        return r;
    };
    mat4.multMatrixVec = function (matrix, inp) {
        var out = new Array(16);
        for (var i = 0; i < 4; i++) {
            out[i] =
                inp[0] * matrix[0 * 4 + i] +
                    inp[1] * matrix[1 * 4 + i] +
                    inp[2] * matrix[2 * 4 + i] +
                    inp[3] * matrix[3 * 4 + i];
        }
        return out;
    };
    mat4.inverse = function (m) {
        var r = new Array(16);
        r[0] = m[5] * m[10] * m[15] - m[5] * m[14] * m[11] - m[6] * m[9] * m[15] + m[6] * m[13] * m[11] + m[7] * m[9] * m[14] - m[7] * m[13] * m[10];
        r[1] = -m[1] * m[10] * m[15] + m[1] * m[14] * m[11] + m[2] * m[9] * m[15] - m[2] * m[13] * m[11] - m[3] * m[9] * m[14] + m[3] * m[13] * m[10];
        r[2] = m[1] * m[6] * m[15] - m[1] * m[14] * m[7] - m[2] * m[5] * m[15] + m[2] * m[13] * m[7] + m[3] * m[5] * m[14] - m[3] * m[13] * m[6];
        r[3] = -m[1] * m[6] * m[11] + m[1] * m[10] * m[7] + m[2] * m[5] * m[11] - m[2] * m[9] * m[7] - m[3] * m[5] * m[10] + m[3] * m[9] * m[6];
        r[4] = -m[4] * m[10] * m[15] + m[4] * m[14] * m[11] + m[6] * m[8] * m[15] - m[6] * m[12] * m[11] - m[7] * m[8] * m[14] + m[7] * m[12] * m[10];
        r[5] = m[0] * m[10] * m[15] - m[0] * m[14] * m[11] - m[2] * m[8] * m[15] + m[2] * m[12] * m[11] + m[3] * m[8] * m[14] - m[3] * m[12] * m[10];
        r[6] = -m[0] * m[6] * m[15] + m[0] * m[14] * m[7] + m[2] * m[4] * m[15] - m[2] * m[12] * m[7] - m[3] * m[4] * m[14] + m[3] * m[12] * m[6];
        r[7] = m[0] * m[6] * m[11] - m[0] * m[10] * m[7] - m[2] * m[4] * m[11] + m[2] * m[8] * m[7] + m[3] * m[4] * m[10] - m[3] * m[8] * m[6];
        r[8] = m[4] * m[9] * m[15] - m[4] * m[13] * m[11] - m[5] * m[8] * m[15] + m[5] * m[12] * m[11] + m[7] * m[8] * m[13] - m[7] * m[12] * m[9];
        r[9] = -m[0] * m[9] * m[15] + m[0] * m[13] * m[11] + m[1] * m[8] * m[15] - m[1] * m[12] * m[11] - m[3] * m[8] * m[13] + m[3] * m[12] * m[9];
        r[10] = m[0] * m[5] * m[15] - m[0] * m[13] * m[7] - m[1] * m[4] * m[15] + m[1] * m[12] * m[7] + m[3] * m[4] * m[13] - m[3] * m[12] * m[5];
        r[11] = -m[0] * m[5] * m[11] + m[0] * m[9] * m[7] + m[1] * m[4] * m[11] - m[1] * m[8] * m[7] - m[3] * m[4] * m[9] + m[3] * m[8] * m[5];
        r[12] = -m[4] * m[9] * m[14] + m[4] * m[13] * m[10] + m[5] * m[8] * m[14] - m[5] * m[12] * m[10] - m[6] * m[8] * m[13] + m[6] * m[12] * m[9];
        r[13] = m[0] * m[9] * m[14] - m[0] * m[13] * m[10] - m[1] * m[8] * m[14] + m[1] * m[12] * m[10] + m[2] * m[8] * m[13] - m[2] * m[12] * m[9];
        r[14] = -m[0] * m[5] * m[14] + m[0] * m[13] * m[6] + m[1] * m[4] * m[14] - m[1] * m[12] * m[6] - m[2] * m[4] * m[13] + m[2] * m[12] * m[5];
        r[15] = m[0] * m[5] * m[10] - m[0] * m[9] * m[6] - m[1] * m[4] * m[10] + m[1] * m[8] * m[6] + m[2] * m[4] * m[9] - m[2] * m[8] * m[5];
        var det = m[0] * r[0] + m[1] * r[4] + m[2] * r[8] + m[3] * r[12];
        if ( true && det === 0) {
            console.error(m);
            throw new debugError_1.DebugError("can not invert matrix");
        }
        for (var i = 0; i < 16; i++)
            r[i] /= det;
        return r;
    };
    mat4.IDENTITY = mat4.makeIdentity();
})(mat4 = exports.mat4 || (exports.mat4 = {}));


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = __webpack_require__(13);
var debugError_1 = __webpack_require__(0);
var AbstractDrawer = (function () {
    function AbstractDrawer(gl) {
        this.program = null;
        this.uniformCache = {};
        this.gl = gl;
        AbstractDrawer.instances.push(this);
    }
    AbstractDrawer.prototype.bind = function () {
        if ( true && !this.program) {
            console.error(this);
            throw new debugError_1.DebugError("can not init drawer: initProgram method must be invoked!");
        }
        if (AbstractDrawer.currentInstance !== null &&
            AbstractDrawer.currentInstance !== this) {
            AbstractDrawer.currentInstance.unbind();
        }
        AbstractDrawer.currentInstance = this;
        this.bufferInfo.bind(this.program);
    };
    AbstractDrawer.prototype.unbind = function () {
        this.bufferInfo.unbind();
    };
    AbstractDrawer.prototype.destroy = function () {
        if (this.bufferInfo)
            this.bufferInfo.destroy();
        this.program.destroy();
    };
    AbstractDrawer.destroyAll = function () {
        AbstractDrawer.instances.forEach(function (it) {
            it.destroy();
        });
    };
    AbstractDrawer.prototype.setUniform = function (name, value) {
        if ( true && !name) {
            console.trace();
            throw new debugError_1.DebugError("can not set uniform witn value " + value + ": name is not provided");
        }
        if (object_1.isEqual(this.uniformCache[name], value))
            return;
        if (object_1.isArray(value)) {
            if (!this.uniformCache[name])
                this.uniformCache[name] = Array(value.length);
            for (var i = 0, max = value.length; i < max; i++) {
                this.uniformCache[name][i] = value[i];
            }
        }
        else {
            this.uniformCache[name] = value;
        }
    };
    AbstractDrawer.prototype._setUniform = function (name, value) {
        this.program.setUniform(name, value);
    };
    AbstractDrawer.prototype.drawElements = function () {
        this.bufferInfo.draw();
    };
    AbstractDrawer.prototype.draw = function (textureInfos) {
        var _this = this;
        this.bind();
        Object.keys(this.uniformCache).forEach(function (name) { return _this._setUniform(name, _this.uniformCache[name]); });
        if (textureInfos) {
            textureInfos.forEach(function (t, i) {
                t.texture.bind(t.name, i, _this.program);
            });
        }
        this.drawElements();
    };
    AbstractDrawer.currentInstance = null;
    AbstractDrawer.instances = [];
    return AbstractDrawer;
}());
exports.AbstractDrawer = AbstractDrawer;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObjectMatch = function (obj, query) {
    if (!(obj && query))
        return false;
    var match = true;
    var keys = Object.keys(query);
    if (!keys.length)
        return false;
    keys.some(function (key) {
        if (obj[key] != query[key]) {
            match = false;
            return true;
        }
    });
    return match;
};
exports.isObject = function (obj) {
    return obj === Object(obj);
};
exports.isArray = function (a) {
    return !!(a.splice);
};
var isEqualArray = function (a, b) {
    for (var i = 0, max = a.length; i < max; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
};
var isEqualObject = function (a, b) {
    throw 'not implemented';
};
exports.isEqual = function (a, b) {
    if (a === undefined)
        return false;
    if (exports.isArray(a) && exports.isArray(b))
        return isEqualArray(a, b);
    else if (exports.isObject(a) && exports.isObject(b))
        return isEqualObject(a, b);
    return a === b;
};
exports.removeFromArray = function (arr, predicate) {
    var i = _this.length;
    var cnt = 0;
    while (i--) {
        if (predicate(arr[i])) {
            arr.splice(i, 1);
            cnt++;
        }
    }
    return cnt;
};
exports.noop = function (arg) { };


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var easing_1 = __webpack_require__(43);
var game_1 = __webpack_require__(6);
var accessByPath = function (obj, path) {
    var pathArr = path.split('.');
    if (pathArr.length === 1)
        return { targetObj: obj, targetKey: path };
    var lastPath = pathArr.pop();
    pathArr.forEach(function (p) {
        obj = obj[p];
    });
    return { targetObj: obj, targetKey: lastPath };
};
var setValByPath = function (obj, path, val) {
    var _a = accessByPath(obj, path), targetObj = _a.targetObj, targetKey = _a.targetKey;
    targetObj[targetKey] = val;
};
var getValByPath = function (obj, path) {
    var _a = accessByPath(obj, path), targetObj = _a.targetObj, targetKey = _a.targetKey;
    return targetObj[targetKey];
};
var Tween = (function () {
    function Tween(tweenDesc) {
        this._propsToChange = [];
        this._startedTime = 0;
        this._currTime = 0;
        this._completed = false;
        this._target = tweenDesc.target;
        this._progressFn = tweenDesc.progress;
        this._completeFn = tweenDesc.complete;
        this._easeFn = tweenDesc.ease || easing_1.Easing.linear;
        this._tweenTime = tweenDesc.time || 1000;
        this._desc = this.normalizeDesc(tweenDesc);
    }
    Tween.prototype.reuse = function (newTweenDesc) {
        var _this = this;
        this._startedTime = this._currTime;
        this._completed = false;
        Object.keys(newTweenDesc).forEach(function (key) {
            _this._desc[key] = newTweenDesc[key];
        });
        this._desc = this.normalizeDesc(newTweenDesc);
    };
    Tween.prototype.normalizeDesc = function (tweenDesc) {
        var _this = this;
        tweenDesc.from = tweenDesc.from || {};
        tweenDesc.to = tweenDesc.to || {};
        var allPropsMap = {};
        Object.keys(tweenDesc.from).forEach(function (keyFrom) {
            allPropsMap[keyFrom] = true;
        });
        Object.keys(tweenDesc.to).forEach(function (keyTo) {
            allPropsMap[keyTo] = true;
        });
        this._propsToChange = Object.keys(allPropsMap);
        this._propsToChange.forEach(function (prp) {
            if (tweenDesc.from[prp] === undefined)
                tweenDesc.from[prp] = getValByPath(_this._target, prp);
            if (tweenDesc.to[prp] === undefined)
                tweenDesc.to[prp] = getValByPath(_this._target, prp);
        });
        return tweenDesc;
    };
    Tween.prototype.update = function () {
        if (this._completed)
            return;
        var currTime = game_1.Game.getInstance().getTime();
        this._currTime = currTime;
        if (!this._startedTime)
            this._startedTime = currTime;
        var curTweenTime = currTime - this._startedTime;
        if (curTweenTime > this._tweenTime) {
            this.complete();
            return;
        }
        var l = this._propsToChange.length;
        while (l--) {
            var prp = this._propsToChange[l];
            var valFrom = this._desc.from[prp];
            var valTo = this._desc.to[prp];
            var fn = this._easeFn;
            var valCurr = fn(curTweenTime, valFrom, valTo - valFrom, this._tweenTime);
            setValByPath(this._target, prp, valCurr);
        }
        this._progressFn && this._progressFn(this._target);
    };
    Tween.prototype.progress = function (_progressFn) {
        this._progressFn = _progressFn;
    };
    Tween.prototype.reset = function () {
        this._startedTime = null;
        this._completed = false;
    };
    Tween.prototype.complete = function () {
        if (this._completed)
            return;
        var l = this._propsToChange.length;
        while (l--) {
            var prp = this._propsToChange[l];
            var valCurr = this._desc.to[prp];
            setValByPath(this._target, prp, valCurr);
        }
        this._progressFn && this._progressFn(this._target);
        this._completeFn && this._completeFn(this._target);
        this._completed = true;
    };
    Tween.prototype.isCompleted = function () {
        return this._completed;
    };
    Tween.prototype.getTarget = function () {
        return this._target;
    };
    Tween.prototype.getTweenTime = function () {
        return this._tweenTime;
    };
    return Tween;
}());
exports.Tween = Tween;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var object_1 = __webpack_require__(13);
var ObservableEntity = (function () {
    function ObservableEntity() {
        this._onChanged = [];
        this._captured = false;
        this._silent = false;
    }
    ObservableEntity.prototype.capture = function () {
        this._captured = true;
    };
    ObservableEntity.prototype.silent = function (val) {
        this._silent = val;
        return this;
    };
    ObservableEntity.prototype.isCaptured = function () {
        return this._captured;
    };
    ObservableEntity.prototype.release = function () {
        this._captured = false;
    };
    ObservableEntity.prototype.triggerObservable = function () {
        if (this._silent)
            return;
        for (var _i = 0, _a = this._onChanged; _i < _a.length; _i++) {
            var fn = _a[_i];
            fn();
        }
    };
    ObservableEntity.prototype.forceTriggerChange = function () {
        for (var _i = 0, _a = this._onChanged; _i < _a.length; _i++) {
            var fn = _a[_i];
            fn();
        }
    };
    ObservableEntity.prototype.addListener = function (f) {
        this._onChanged.push(f);
    };
    ObservableEntity.prototype.removeListener = function (f) {
        object_1.removeFromArray(this._onChanged, function (it) { return it === f; });
    };
    ObservableEntity.prototype.observe = function (onChangedFn) {
        this.addListener(onChangedFn);
    };
    return ObservableEntity;
}());
exports.ObservableEntity = ObservableEntity;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var debugError_1 = __webpack_require__(0);
var shaderProgramUtils_1 = __webpack_require__(7);
var ShaderProgram = (function () {
    function ShaderProgram(gl, vertexSource, fragmentSource) {
        var vShader = shaderProgramUtils_1.compileShader(gl, vertexSource, gl.VERTEX_SHADER);
        var fShader = shaderProgramUtils_1.compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER);
        this.program = shaderProgramUtils_1.createProgram(gl, vShader, fShader);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);
        this.uniforms = shaderProgramUtils_1.extractUniforms(gl, this);
        this.attributes = shaderProgramUtils_1.extractAttributes(gl, this);
        this.gl = gl;
    }
    ShaderProgram.prototype.getProgram = function () {
        return this.program;
    };
    ShaderProgram.prototype.bind = function () {
        this.gl.useProgram(this.program);
        ShaderProgram.currentProgram = this;
    };
    ShaderProgram.prototype.setUniform = function (name, value) {
        if ( true && !name) {
            throw new debugError_1.DebugError("no uniform name was provided!");
        }
        var uniform = this.uniforms[name];
        if ( true && !uniform) {
            return;
        }
        if (true) {
            if (ShaderProgram.currentProgram !== this) {
                console.error(this);
                throw new debugError_1.DebugError("can not set uniform: target program is inactive");
            }
        }
        uniform.setter(this.gl, uniform.location, value);
    };
    ShaderProgram.prototype.bindBuffer = function (buffer, attrName) {
        if (true) {
            if (!attrName)
                throw new debugError_1.DebugError("can not found attribute location: attrLocationName not defined");
            if (this.attributes[attrName] === undefined) {
                console.log(this);
                throw new debugError_1.DebugError("can not found attribute location for  " + attrName);
            }
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.getGlBuffer());
        var attrLocation = this.attributes[attrName];
        this.gl.enableVertexAttribArray(attrLocation);
        this.gl.vertexAttribPointer(attrLocation, buffer.getItemSize(), buffer.getItemType(), false, 0, 0);
    };
    ShaderProgram.prototype.destroy = function () {
        this.gl.deleteProgram(this.program);
    };
    ShaderProgram.currentProgram = null;
    return ShaderProgram;
}());
exports.ShaderProgram = ShaderProgram;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var debugError_1 = __webpack_require__(0);
var vertexBuffer_1 = __webpack_require__(52);
var indexBuffer_1 = __webpack_require__(53);
var BufferInfo = (function () {
    function BufferInfo(gl, description) {
        this.posVertexBuffer = null;
        this.posIndexBuffer = null;
        this.texVertexBuffer = null;
        this.normalBuffer = null;
        this.drawMethod = null;
        this.numOfElementsToDraw = 0;
        this.gl = gl;
        if ( true && description.drawMethod === undefined)
            throw new debugError_1.DebugError("can not create BufferInfo: drawMethod not defined");
        this.drawMethod = description.drawMethod;
        if ( true && !description.posVertexInfo)
            throw new debugError_1.DebugError("can not create BufferInfo: posVertexInfo is mandatory");
        this.posVertexBuffer = new vertexBuffer_1.VertexBuffer(gl);
        this.posVertexBuffer.setData(description.posVertexInfo.array, description.posVertexInfo.type, description.posVertexInfo.size);
        this.posVertexBuffer.setAttrName(description.posVertexInfo.attrName);
        if (description.posIndexInfo) {
            this.posIndexBuffer = new indexBuffer_1.IndexBuffer(gl);
            this.posIndexBuffer.setData(description.posIndexInfo.array);
        }
        else
            this.numOfElementsToDraw = this._getNumOfElementsToDraw(this.drawMethod);
        if (description.texVertexInfo) {
            this.texVertexBuffer = new vertexBuffer_1.VertexBuffer(gl);
            this.texVertexBuffer.setData(description.texVertexInfo.array, description.texVertexInfo.type, description.texVertexInfo.size);
            this.texVertexBuffer.setAttrName(description.texVertexInfo.attrName);
        }
        if (description.normalInfo) {
            this.normalBuffer = new vertexBuffer_1.VertexBuffer(gl);
            this.normalBuffer.setData(description.normalInfo.array, description.normalInfo.type, description.normalInfo.size);
            this.normalBuffer.setAttrName(description.normalInfo.attrName);
        }
    }
    BufferInfo.prototype.bind = function (program) {
        program.bind();
        if (this.posIndexBuffer)
            this.posIndexBuffer.bind();
        if (this.posVertexBuffer)
            this.posVertexBuffer.bind(program);
        if (this.texVertexBuffer)
            this.texVertexBuffer.bind(program);
        if (this.normalBuffer)
            this.normalBuffer.bind(program);
    };
    BufferInfo.prototype.unbind = function () {
        if (this.posIndexBuffer)
            this.posIndexBuffer.unbind();
        if (this.posVertexBuffer)
            this.posVertexBuffer.unbind();
        if (this.texVertexBuffer)
            this.texVertexBuffer.unbind();
        if (this.normalBuffer)
            this.normalBuffer.unbind();
    };
    BufferInfo.prototype.destroy = function () {
        if (this.posVertexBuffer)
            this.posVertexBuffer.destroy();
        if (this.posIndexBuffer)
            this.posIndexBuffer.destroy();
        if (this.texVertexBuffer)
            this.texVertexBuffer.destroy();
        if (this.normalBuffer)
            this.normalBuffer.destroy();
    };
    BufferInfo.prototype._getNumOfElementsToDraw = function (drawMethod) {
        switch (drawMethod) {
            case this.gl.LINE_STRIP:
            case this.gl.TRIANGLE_FAN:
                return this.posVertexBuffer.getBufferLength() / 2;
            default:
                throw new debugError_1.DebugError("unknown draw method: " + drawMethod);
        }
    };
    BufferInfo.prototype.draw = function () {
        if (this.posIndexBuffer !== null) {
            this.gl.drawElements(this.drawMethod, this.posIndexBuffer.getBufferLength(), this.gl.UNSIGNED_SHORT, 0);
        }
        else {
            this.gl.drawArrays(this.drawMethod, 0, this.numOfElementsToDraw);
        }
    };
    return BufferInfo;
}());
exports.BufferInfo = BufferInfo;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var resource_1 = __webpack_require__(21);
var debugError_1 = __webpack_require__(0);
var mathEx_1 = __webpack_require__(8);
var point2d_1 = __webpack_require__(2);
var rect_1 = __webpack_require__(3);
var tween_1 = __webpack_require__(14);
var timer_1 = __webpack_require__(27);
var eventEmitter_1 = __webpack_require__(19);
var mouseEvents_1 = __webpack_require__(10);
var size_1 = __webpack_require__(4);
var RenderableModel = (function (_super) {
    tslib_1.__extends(RenderableModel, _super);
    function RenderableModel(game) {
        var _this = _super.call(this) || this;
        _this.game = game;
        _this.size = new size_1.Size();
        _this.pos = new point2d_1.Point2d(0, 0, function () { return _this._dirty = true; });
        _this.scale = new point2d_1.Point2d(1, 1);
        _this.anchor = new point2d_1.Point2d(0, 0);
        _this.angle = 0;
        _this.alpha = 1;
        _this.filters = [];
        _this.children = [];
        _this.acceptLight = false;
        _this.velocity = new point2d_1.Point2d(0, 0);
        _this._tweens = [];
        _this._tweenMovies = [];
        _this._timers = [];
        _this._dirty = true;
        _this._rect = new rect_1.Rect();
        _this._screenRect = new rect_1.Rect();
        _this._behaviours = [];
        if ( true && !game)
            throw new debugError_1.DebugError("can not create model '" + _this.type + "': game instance not passed to model constructor");
        return _this;
    }
    RenderableModel.prototype.setClonedProperties = function (cloned) {
        cloned.size.set(cloned.size);
        cloned.pos.set(this.pos);
        cloned.scale.set(this.scale);
        cloned.anchor.set(this.anchor);
        cloned.angle = this.angle;
        cloned.alpha = this.alpha;
        cloned.filters = this.filters.slice();
        cloned.blendMode = this.blendMode;
        cloned.parent = null;
        this.children.forEach(function (c) {
            if ( true && !('clone' in c)) {
                console.error(c);
                throw new debugError_1.DebugError("can not clone object: cloneable interface is not implemented");
            }
            var clonedChildren = c.clone();
            if ( true && !(clonedChildren instanceof RenderableModel)) {
                console.error(c);
                throw new debugError_1.DebugError("can not clone object: \"clone\"  method must return Cloneable object");
            }
            cloned.appendChild(clonedChildren);
        });
        cloned.acceptLight = this.acceptLight;
        cloned.game = this.game;
        _super.prototype.setClonedProperties.call(this, cloned);
    };
    RenderableModel.prototype.revalidate = function () { };
    RenderableModel.prototype.getLayer = function () {
        return this._layer;
    };
    RenderableModel.prototype.setLayer = function (value) {
        this._layer = value;
    };
    RenderableModel.prototype.findChildrenById = function (id) {
        if (id === this.id)
            return this;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var c = _a[_i];
            var possibleObject = c.findChildrenById(id);
            if (possibleObject)
                return possibleObject;
        }
        return null;
    };
    RenderableModel.prototype.getScreenRect = function () {
        if (this._dirty) {
            this.calcScreenRect();
        }
        return this._screenRect;
    };
    RenderableModel.prototype.calcScreenRect = function () {
        this._screenRect.set(this._rect);
        var parent = this.parent;
        while (parent) {
            this._screenRect.addXY(parent.getRect().point.x, parent.getRect().point.y);
            parent = parent.parent;
        }
    };
    RenderableModel.prototype.getRect = function () {
        this._rect.setXYWH(this.pos.x - this.anchor.x, this.pos.y - this.anchor.y, this.size.width, this.size.height);
        if (this._dirty) {
            this.calcScreenRect();
        }
        return this._rect;
    };
    RenderableModel.prototype.setAnchorToCenter = function () {
        this.revalidate();
        if ( true && !(this.size.width && this.size.height))
            throw new debugError_1.DebugError("can not set anchor to center: width or height of gameObject is not set");
        this.anchor.setXY(this.size.width / 2, this.size.height / 2);
    };
    RenderableModel.prototype.appendChild = function (c) {
        c.parent = this;
        c.setLayer(this.getLayer());
        c.revalidate();
        this.children.push(c);
    };
    RenderableModel.prototype.addBehaviour = function (b) {
        this._behaviours.push(b);
        b.manage(this);
    };
    RenderableModel.prototype.prependChild = function (c) {
        c.parent = this;
        c.revalidate();
        this.children.unshift(c);
    };
    RenderableModel.prototype.setDirty = function () {
        this._dirty = true;
    };
    RenderableModel.prototype.beforeRender = function () {
        this.game.getRenderer().translate(this.pos.x, this.pos.y);
    };
    RenderableModel.prototype.isNeedAdditionalTransform = function () {
        return !(this.angle === 0 && this.scale.equal(1));
    };
    RenderableModel.prototype.doAdditionalTransform = function () {
        this.game.getRenderer().rotateZ(this.angle);
    };
    RenderableModel.prototype.isInViewPort = function () {
        return mathEx_1.MathEx.overlapTest(this.game.camera.getRectScaled(), this.getRect());
    };
    RenderableModel.prototype._getParent = function () {
        return this.parent || this._layer || undefined;
    };
    RenderableModel.prototype.moveToFront = function () {
        if ( true && !this._getParent())
            throw new debugError_1.DebugError("can not move to front: object is detached");
        var index = (this._getParent()).children.indexOf(this);
        if ( true && index === -1)
            throw new debugError_1.DebugError("can not move to front: object is not belong to current scene");
        var parentArray = this._getParent().children;
        parentArray.splice(index, 1);
        parentArray.push(this);
    };
    RenderableModel.prototype.moveToBack = function () {
        if ( true && !this._getParent())
            throw new debugError_1.DebugError("can not move to back: object is detached");
        var index = this._getParent().children.indexOf(this);
        if ( true && index === -1)
            throw new debugError_1.DebugError("can not move to front: object is not belong to current scene");
        var parentArray = this._getParent().children;
        parentArray.splice(index, 1);
        parentArray.unshift(this);
    };
    RenderableModel.prototype.kill = function () {
        if ( true && !this._getParent())
            throw new debugError_1.DebugError("can not kill object: gameObject is detached");
        var parentArray = this._getParent().children;
        var index = parentArray.indexOf(this);
        if ( true && index === -1) {
            console.error(this);
            throw new debugError_1.DebugError('can not kill: object is not belong to current scene');
        }
        this.parent = null;
        this._layer = null;
        parentArray.splice(index, 1);
        for (var _i = 0, _a = this._behaviours; _i < _a.length; _i++) {
            var b = _a[_i];
            b.destroy();
        }
    };
    RenderableModel.prototype.render = function () {
        var renderer = this.game.getRenderer();
        renderer.save();
        this.beforeRender();
        renderer.translate(-this.anchor.x, -this.anchor.y);
        if (this.isNeedAdditionalTransform()) {
            var dx = this.size.width / 2, dy = this.size.height / 2;
            renderer.translate(dx, dy);
            renderer.scale(this.scale.x, this.scale.y);
            this.doAdditionalTransform();
            renderer.translate(-dx, -dy);
        }
        var drawResult = this.draw();
        if (drawResult && this.children.length > 0) {
            renderer.save();
            renderer.translate(this.anchor.x, this.anchor.y);
            for (var i = 0, max = this.children.length; i < max; i++) {
                this.children[i].render();
            }
            renderer.restore();
        }
        renderer.restore();
    };
    RenderableModel.prototype.update = function () {
        var _this = this;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (this._dirty)
                c.setDirty();
            c.update();
        }
        var delta = this.game.getDeltaTime();
        this._tweens.forEach(function (t, index) {
            t.update();
            if (t.isCompleted())
                _this._tweens.splice(index, 1);
        });
        this._tweenMovies.forEach(function (t, index) {
            t.update();
            if (t.isCompleted())
                _this._tweenMovies.splice(index, 1);
        });
        this._timers.forEach(function (t) {
            t.onUpdate();
        });
        for (var i = 0, max = this._behaviours.length; i < max; i++) {
            if (this._behaviours[i].onUpdate)
                this._behaviours[i].onUpdate();
        }
        if (this.rigidBody !== undefined) {
            this.rigidBody.update();
            this.angle = this.rigidBody.mAngle;
        }
        else {
            if (this.velocity.x)
                this.pos.x += this.velocity.x * delta / 1000;
            if (this.velocity.y)
                this.pos.y += this.velocity.y * delta / 1000;
        }
        if (this.children.length > 0) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].update();
            }
        }
    };
    RenderableModel.prototype.tween = function (desc) {
        var t = new tween_1.Tween(desc);
        this._tweens.push(t);
        return t;
    };
    RenderableModel.prototype.addTween = function (t) {
        this._tweens.push(t);
    };
    RenderableModel.prototype.addTweenMovie = function (tm) {
        this._tweenMovies.push(tm);
    };
    RenderableModel.prototype.setTimer = function (callback, interval) {
        var t = new timer_1.Timer(callback, interval);
        this._timers.push(t);
        return t;
    };
    RenderableModel.prototype.on = function (eventName, callBack) {
        if ( true && !this.game.hasControl('Mouse')) {
            if (mouseEvents_1.MOUSE_EVENTS[eventName] != undefined) {
                throw new debugError_1.DebugError('can not listen mouse events: mouse control is not added');
            }
        }
        if (this._emitter === undefined)
            this._emitter = new eventEmitter_1.EventEmitter();
        this._emitter.on(eventName, callBack);
        return callBack;
    };
    RenderableModel.prototype.off = function (eventName, callBack) {
        if (this._emitter !== undefined)
            this._emitter.off(eventName, callBack);
    };
    RenderableModel.prototype.trigger = function (eventName, data) {
        if (this._emitter !== undefined)
            this._emitter.trigger(eventName, data);
    };
    return RenderableModel;
}(resource_1.Resource));
exports.RenderableModel = RenderableModel;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var debugError_1 = __webpack_require__(0);
var EventEmitter = (function () {
    function EventEmitter() {
        this.events = {};
    }
    EventEmitter.prototype._on = function (name, callBack) {
        this.events[name] = this.events[name] || [];
        this.events[name].push(callBack);
    };
    EventEmitter.prototype.on = function (eventNameOrList, callBack) {
        var _this = this;
        if (typeof eventNameOrList === 'string') {
            this._on(eventNameOrList, callBack);
        }
        else if (eventNameOrList.splice) {
            eventNameOrList.forEach(function (eventName) {
                _this._on(eventName, callBack);
            });
        }
    };
    ;
    EventEmitter.prototype.off = function (eventName, callback) {
        var es = this.events[eventName];
        if (!es)
            return;
        var index = es.indexOf(callback);
        if ( true && index == -1) {
            console.error(callback);
            throw new debugError_1.DebugError("can not remove event listener " + eventName);
        }
        es.splice(index, 1);
    };
    ;
    EventEmitter.prototype.trigger = function (eventName, data) {
        var es = this.events[eventName];
        if (!es)
            return;
        var l = es.length;
        while (l--) {
            es[l](data);
        }
    };
    ;
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var renderableModel_1 = __webpack_require__(18);
var color_1 = __webpack_require__(5);
var Shape = (function (_super) {
    tslib_1.__extends(Shape, _super);
    function Shape(game) {
        var _this = _super.call(this, game) || this;
        _this.color = color_1.Color.BLACK.clone();
        _this.lineWidth = 0;
        _this.fillColor = color_1.Color.RGB(100, 100, 100);
        return _this;
    }
    Shape.prototype.setWH = function (w, h) {
        if (h === void 0) { h = w; }
        this.setXYWH(this.pos.x, this.pos.y, w, h);
    };
    Shape.prototype.setXYWH = function (x, y, w, h) {
        this.pos.setXY(x, y);
        this.size.setWH(w, h);
        this.getRect().setXYWH(x, y, w, h);
    };
    Shape.prototype.setClonedProperties = function (cloned) {
        cloned.color = this.color.clone();
        cloned.lineWidth = this.lineWidth;
        cloned.fillColor = this.fillColor.clone();
        _super.prototype.setClonedProperties.call(this, cloned);
    };
    return Shape;
}(renderableModel_1.RenderableModel));
exports.Shape = Shape;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Resource = (function () {
    function Resource() {
    }
    Resource.prototype.setResourceLink = function (link) {
        this._resourceLink = link;
    };
    Resource.prototype.getResourceLink = function () {
        return this._resourceLink;
    };
    Resource.prototype.setClonedProperties = function (cloned) {
        cloned.setResourceLink(this.getResourceLink());
    };
    return Resource;
}());
exports.Resource = Resource;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var rect_1 = __webpack_require__(3);
var renderableModel_1 = __webpack_require__(18);
var debugError_1 = __webpack_require__(0);
var OVERFLOW;
(function (OVERFLOW) {
    OVERFLOW[OVERFLOW["HIDDEN"] = 0] = "HIDDEN";
    OVERFLOW[OVERFLOW["VISIBLE"] = 1] = "VISIBLE";
})(OVERFLOW = exports.OVERFLOW || (exports.OVERFLOW = {}));
var LAYOUT_SIZE;
(function (LAYOUT_SIZE) {
    LAYOUT_SIZE[LAYOUT_SIZE["FIXED"] = 0] = "FIXED";
    LAYOUT_SIZE[LAYOUT_SIZE["WRAP_CONTENT"] = 1] = "WRAP_CONTENT";
    LAYOUT_SIZE[LAYOUT_SIZE["MATCH_PARENT"] = 2] = "MATCH_PARENT";
})(LAYOUT_SIZE = exports.LAYOUT_SIZE || (exports.LAYOUT_SIZE = {}));
var Container = (function (_super) {
    tslib_1.__extends(Container, _super);
    function Container(game) {
        var _this = _super.call(this, game) || this;
        _this.marginLeft = 0;
        _this.marginTop = 0;
        _this.marginRight = 0;
        _this.marginBottom = 0;
        _this.paddingLeft = 0;
        _this.paddingTop = 0;
        _this.paddingRight = 0;
        _this.paddingBottom = 0;
        _this.layoutWidth = LAYOUT_SIZE.WRAP_CONTENT;
        _this.layoutHeight = LAYOUT_SIZE.WRAP_CONTENT;
        _this.overflow = OVERFLOW.HIDDEN;
        _this.drawingRect = new rect_1.Rect();
        _this.maxWidth = 0;
        _this.maxHeight = 0;
        return _this;
    }
    Container.prototype.testLayout = function () {
        if (true) {
            if (this.layoutWidth === LAYOUT_SIZE.FIXED && this.size.width === 0)
                throw new debugError_1.DebugError("layoutWidth is LAYOUT_SIZE.FIXED so width must be specified");
            if (this.layoutHeight === LAYOUT_SIZE.FIXED && this.size.height === 0)
                throw new debugError_1.DebugError("layoutHeight is LAYOUT_SIZE.FIXED so height must be specified");
        }
    };
    Container.normalizeBorders = function (top, right, bottom, left) {
        if (right === undefined && bottom === undefined && left === undefined) {
            right = bottom = left = top;
        }
        else if (bottom === undefined && left === undefined) {
            bottom = top;
            left = right;
        }
        else if (left === undefined) {
            left = right;
        }
        return { top: top, right: right, bottom: bottom, left: left };
    };
    Container.prototype.setMargins = function (top, right, bottom, left) {
        var _a;
        (_a = Container.normalizeBorders(top, right, bottom, left), top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left);
        this.marginTop = top;
        this.marginRight = right;
        this.marginBottom = bottom;
        this.marginLeft = left;
        this.setDirty();
    };
    Container.prototype.setMarginsTopBottom = function (top, bottom) {
        if (bottom === undefined)
            bottom = top;
        this.paddingTop = top;
        this.paddingBottom = bottom;
        this.setDirty();
    };
    Container.prototype.setMarginsLeftRight = function (left, right) {
        if (right === undefined)
            right = left;
        this.marginLeft = left;
        this.marginRight = right;
        this.setDirty();
    };
    Container.prototype.setPaddings = function (top, right, bottom, left) {
        var _a;
        (_a = Container.normalizeBorders(top, right, bottom, left), top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left);
        this.paddingTop = top;
        this.paddingRight = right;
        this.paddingBottom = bottom;
        this.paddingLeft = left;
        this.setDirty();
    };
    Container.prototype.calcScreenRect = function () {
        this._rect.setXYWH(this.pos.x, this.pos.y, this.size.width + this.marginLeft + this.marginRight, this.size.height + this.marginTop + this.marginBottom);
        this._screenRect.set(this._rect);
        var parent = this.parent;
        while (parent) {
            this._screenRect.addXY(parent.getRect().point.x, parent.getRect().point.y);
            parent = parent.parent;
        }
    };
    Container.prototype.setPaddingsTopBottom = function (top, bottom) {
        if (bottom === undefined)
            bottom = top;
        this.paddingTop = top;
        this.paddingBottom = bottom;
        this.setDirty();
    };
    Container.prototype.setPaddingsLeftRight = function (left, right) {
        if (right === undefined)
            right = left;
        this.paddingLeft = left;
        this.paddingRight = right;
        this.setDirty();
    };
    Container.prototype.revalidate = function () {
        this.calcScreenRect();
        _super.prototype.revalidate.call(this);
    };
    Container.prototype.onGeometryChanged = function () {
        this.revalidate();
    };
    Container.prototype.setWH = function (w, h) {
        this.size.setWH(w, h);
        this.drawingRect.setWH(w, h);
    };
    Container.prototype.calcDrawableRect = function (contentWidth, contentHeight) {
        var paddedWidth = contentWidth + this.paddingLeft + this.paddingRight;
        var paddedHeight = contentHeight + this.paddingTop + this.paddingBottom;
        if (this.background) {
            this.background.setWH(paddedWidth, paddedHeight);
            this.size.set(this.background.size);
        }
        else {
            this.size.setWH(paddedWidth, paddedHeight);
        }
        this.calcScreenRect();
    };
    Container.prototype.update = function () {
        if (this._dirty) {
            this.onGeometryChanged();
            this._dirty = false;
        }
        _super.prototype.update.call(this);
    };
    Container.prototype.beforeRender = function () {
        this.game.getRenderer().translate(this.pos.x + this.marginLeft, this.pos.y + this.marginTop);
    };
    return Container;
}(renderableModel_1.RenderableModel));
exports.Container = Container;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var debugError_1 = __webpack_require__(0);
var Vec2 = (function () {
    function Vec2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vec2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vec2.prototype.add = function (vec) {
        return new Vec2(vec.x + this.x, vec.y + this.y);
    };
    Vec2.prototype.subtract = function (vec) {
        return new Vec2(this.x - vec.x, this.y - vec.y);
    };
    Vec2.prototype.scale = function (n) {
        return new Vec2(this.x * n, this.y * n);
    };
    Vec2.prototype.dot = function (vec) {
        return (this.x * vec.x + this.y * vec.y);
    };
    Vec2.prototype.cross = function (vec) {
        return (this.x * vec.y - this.y * vec.x);
    };
    Vec2.prototype.rotate = function (center, angle) {
        var r = [];
        var x = this.x - center.x;
        var y = this.y - center.y;
        r[0] = x * Math.cos(angle) - y * Math.sin(angle);
        r[1] = x * Math.sin(angle) + y * Math.cos(angle);
        r[0] += center.x;
        r[1] += center.y;
        return new Vec2(r[0], r[1]);
    };
    Vec2.prototype.normalize = function () {
        var len = this.length();
        if (len > 0) {
            len = 1 / len;
        }
        return new Vec2(this.x * len, this.y * len);
    };
    Vec2.prototype.distance = function (vec) {
        var x = this.x - vec.x;
        var y = this.y - vec.y;
        return Math.sqrt(x * x + y * y);
    };
    return Vec2;
}());
exports.Vec2 = Vec2;
var CollisionInfo = (function () {
    function CollisionInfo() {
        this.mDepth = 0;
        this.mNormal = new Vec2(0, 0);
        this.mStart = new Vec2(0, 0);
        this.mEnd = new Vec2(0, 0);
    }
    CollisionInfo.prototype.setDepth = function (s) {
        this.mDepth = s;
    };
    CollisionInfo.prototype.setNormal = function (s) {
        this.mNormal = s;
    };
    CollisionInfo.prototype.getDepth = function () {
        return this.mDepth;
    };
    CollisionInfo.prototype.getNormal = function () {
        return this.mNormal;
    };
    CollisionInfo.prototype.setInfo = function (d, n, s) {
        this.mDepth = d;
        this.mNormal = n;
        this.mStart = s;
        this.mEnd = s.add(n.scale(d));
    };
    CollisionInfo.prototype.changeDir = function () {
        this.mNormal = this.mNormal.scale(-1);
        var n = this.mStart;
        this.mStart = this.mEnd;
        this.mEnd = n;
    };
    return CollisionInfo;
}());
exports.CollisionInfo = CollisionInfo;
var RigidShape = (function () {
    function RigidShape(game, center, mass, friction, restitution) {
        this.fixedAngle = false;
        this.mVelocity = new Vec2(0, 0);
        this.mAngle = 0;
        this.mAngularVelocity = 0;
        this.mAngularAcceleration = 0;
        this.mBoundRadius = 0;
        this.game = game;
        this.mCenter = center;
        this.mInertia = 0;
        this.fixedAngle = false;
        if (mass !== undefined) {
            this.mInvMass = mass;
        }
        else {
            this.mInvMass = 1;
        }
        if (friction !== undefined) {
            this.mFriction = friction;
        }
        else {
            this.mFriction = 0.2;
        }
        if (restitution !== undefined) {
            this.mRestitution = restitution;
        }
        else {
            this.mRestitution = 0.1;
        }
        if (this.mInvMass !== 0) {
            this.mInvMass = 1 / this.mInvMass;
            this.mAcceleration = new Vec2(0, game.gravityConstant);
        }
        else {
            this.mAcceleration = new Vec2(0, 0);
        }
    }
    RigidShape.prototype.updateMass = function (delta) {
        var mass;
        if (this.mInvMass !== 0) {
            mass = 1 / this.mInvMass;
        }
        else {
            mass = 0;
        }
        mass += delta;
        if (mass <= 0) {
            this.mInvMass = 0;
            this.mVelocity = new Vec2(0, 0);
            this.mAcceleration = new Vec2(0, 0);
            this.mAngularVelocity = 0;
            this.mAngularAcceleration = 0;
        }
        else {
            this.mInvMass = 1 / mass;
            this.mAcceleration = new Vec2(0, this.game.gravityConstant);
        }
        this.updateInertia();
    };
    RigidShape.prototype.update = function () {
        var dt = this.game.getDeltaTime() / 1000;
        this.mVelocity = this.mVelocity.add(this.mAcceleration.scale(dt));
        this.move(this.mVelocity.scale(dt));
        this.mAngularVelocity += this.mAngularAcceleration * dt;
        this.rotate(this.mAngularVelocity * dt);
    };
    RigidShape.prototype.boundTest = function (otherShape) {
        var vFrom1to2 = otherShape.mCenter.subtract(this.mCenter);
        var rSum = this.mBoundRadius + otherShape.mBoundRadius;
        var dist = vFrom1to2.length();
        return (dist <= rSum);
    };
    return RigidShape;
}());
exports.RigidShape = RigidShape;
var RigidCircle = (function (_super) {
    tslib_1.__extends(RigidCircle, _super);
    function RigidCircle(game, center, radius, mass, friction, restitution) {
        var _this = _super.call(this, game, center, mass, friction, restitution) || this;
        _this.mType = "Circle";
        _this.mRadius = radius;
        _this.mBoundRadius = radius;
        _this.mStartpoint = new Vec2(center.x, center.y - radius);
        _this.updateInertia();
        return _this;
    }
    RigidCircle.prototype.move = function (s) {
        this.mStartpoint = this.mStartpoint.add(s);
        this.mCenter = this.mCenter.add(s);
        return this;
    };
    RigidCircle.prototype.rotate = function (angle) {
        this.mAngle += angle;
        this.mStartpoint = this.mStartpoint.rotate(this.mCenter, angle);
        return this;
    };
    RigidCircle.prototype.updateInertia = function () {
        if (this.mInvMass === 0) {
            this.mInertia = 0;
        }
        else {
            this.mInertia = (1 / this.mInvMass) * (this.mRadius * this.mRadius) / 12;
        }
    };
    RigidCircle.prototype.collisionTest = function (otherShape, collisionInfo) {
        if (RigidCircle.isInstanceOf(otherShape)) {
            return this.collidedCircCirc(this, otherShape, collisionInfo);
        }
        else if (RigidRectangle.isInstanceOf(otherShape)) {
            return otherShape.collidedRectCirc(this, collisionInfo);
        }
        else {
            if (true) {
                console.error(this, otherShape);
                throw new debugError_1.DebugError("collision test error");
            }
        }
    };
    RigidCircle.prototype.collidedCircCirc = function (c1, c2, collisionInfo) {
        var vFrom1to2 = c2.mCenter.subtract(c1.mCenter);
        var rSum = c1.mRadius + c2.mRadius;
        var dist = vFrom1to2.length();
        if (dist > Math.sqrt(rSum * rSum)) {
            return false;
        }
        if (dist !== 0) {
            var normalFrom2to1 = vFrom1to2.scale(-1).normalize();
            var radiusC2 = normalFrom2to1.scale(c2.mRadius);
            collisionInfo.setInfo(rSum - dist, vFrom1to2.normalize(), c2.mCenter.add(radiusC2));
        }
        else {
            if (c1.mRadius > c2.mRadius) {
                collisionInfo.setInfo(rSum, new Vec2(0, -1), c1.mCenter.add(new Vec2(0, c1.mRadius)));
            }
            else {
                collisionInfo.setInfo(rSum, new Vec2(0, -1), c2.mCenter.add(new Vec2(0, c2.mRadius)));
            }
        }
        return true;
    };
    RigidCircle.isInstanceOf = function (shape) {
        return shape.mType === 'Circle';
    };
    return RigidCircle;
}(RigidShape));
exports.RigidCircle = RigidCircle;
var SupportStruct = (function () {
    function SupportStruct() {
        this.mSupportPointDist = 0;
    }
    return SupportStruct;
}());
var tmpSupport = new SupportStruct();
var collisionInfoR1 = new CollisionInfo();
var collisionInfoR2 = new CollisionInfo();
var RigidRectangle = (function (_super) {
    tslib_1.__extends(RigidRectangle, _super);
    function RigidRectangle(game, center, width, height, mass, friction, restitution) {
        var _this = _super.call(this, game, center, mass, friction, restitution) || this;
        _this.mType = "Rectangle";
        _this.mVertex = [];
        _this.mFaceNormal = [];
        _this.mWidth = width;
        _this.mHeight = height;
        _this.mBoundRadius = Math.sqrt(width * width + height * height) / 2;
        _this.mVertex[0] = new Vec2(center.x - width / 2, center.y - height / 2);
        _this.mVertex[1] = new Vec2(center.x + width / 2, center.y - height / 2);
        _this.mVertex[2] = new Vec2(center.x + width / 2, center.y + height / 2);
        _this.mVertex[3] = new Vec2(center.x - width / 2, center.y + height / 2);
        _this.mFaceNormal[0] = _this.mVertex[1].subtract(_this.mVertex[2]);
        _this.mFaceNormal[0] = _this.mFaceNormal[0].normalize();
        _this.mFaceNormal[1] = _this.mVertex[2].subtract(_this.mVertex[3]);
        _this.mFaceNormal[1] = _this.mFaceNormal[1].normalize();
        _this.mFaceNormal[2] = _this.mVertex[3].subtract(_this.mVertex[0]);
        _this.mFaceNormal[2] = _this.mFaceNormal[2].normalize();
        _this.mFaceNormal[3] = _this.mVertex[0].subtract(_this.mVertex[1]);
        _this.mFaceNormal[3] = _this.mFaceNormal[3].normalize();
        _this.updateInertia();
        return _this;
    }
    RigidRectangle.prototype.rotate = function (angle) {
        this.mAngle += angle;
        for (var i = 0; i < this.mVertex.length; i++) {
            this.mVertex[i] = this.mVertex[i].rotate(this.mCenter, angle);
        }
        this.mFaceNormal[0] = this.mVertex[1].subtract(this.mVertex[2]);
        this.mFaceNormal[0] = this.mFaceNormal[0].normalize();
        this.mFaceNormal[1] = this.mVertex[2].subtract(this.mVertex[3]);
        this.mFaceNormal[1] = this.mFaceNormal[1].normalize();
        this.mFaceNormal[2] = this.mVertex[3].subtract(this.mVertex[0]);
        this.mFaceNormal[2] = this.mFaceNormal[2].normalize();
        this.mFaceNormal[3] = this.mVertex[0].subtract(this.mVertex[1]);
        this.mFaceNormal[3] = this.mFaceNormal[3].normalize();
        return this;
    };
    RigidRectangle.prototype.move = function (v) {
        for (var i = 0; i < this.mVertex.length; i++) {
            this.mVertex[i] = this.mVertex[i].add(v);
        }
        this.mCenter = this.mCenter.add(v);
        return this;
    };
    RigidRectangle.prototype.updateInertia = function () {
        if (this.mInvMass === 0) {
            this.mInertia = 0;
        }
        else {
            this.mInertia = (1 / this.mInvMass) * (this.mWidth * this.mWidth + this.mHeight * this.mHeight) / 12;
            this.mInertia = 1 / this.mInertia;
        }
    };
    RigidRectangle.prototype.collisionTest = function (otherShape, collisionInfo) {
        if (RigidCircle.isInstanceOf(otherShape)) {
            return this.collidedRectCirc(otherShape, collisionInfo);
        }
        else if (RigidRectangle.isInstanceOf(otherShape)) {
            return this.collidedRectRect(this, otherShape, collisionInfo);
        }
        else {
            if (true) {
                console.error(this, otherShape);
                throw new debugError_1.DebugError("collision test error");
            }
        }
    };
    RigidRectangle.prototype.boundTest = function (otherShape) {
        var vFrom1to2 = otherShape.mCenter.subtract(this.mCenter);
        var rSum = this.mBoundRadius + otherShape.mBoundRadius;
        var dist = vFrom1to2.length();
        return dist <= rSum;
    };
    RigidRectangle.prototype.findSupportPoint = function (dir, ptOnEdge) {
        var vToEdge;
        var projection;
        tmpSupport.mSupportPointDist = -9999999;
        tmpSupport.mSupportPoint = null;
        for (var i = 0; i < this.mVertex.length; i++) {
            vToEdge = this.mVertex[i].subtract(ptOnEdge);
            projection = vToEdge.dot(dir);
            if ((projection > 0) && (projection > tmpSupport.mSupportPointDist)) {
                tmpSupport.mSupportPoint = this.mVertex[i];
                tmpSupport.mSupportPointDist = projection;
            }
        }
    };
    RigidRectangle.prototype.findAxisLeastPenetration = function (otherRect, collisionInfo) {
        var n;
        var supportPoint;
        var bestDistance = 999999;
        var bestIndex = null;
        var hasSupport = true;
        var i = 0;
        while ((hasSupport) && (i < this.mFaceNormal.length)) {
            n = this.mFaceNormal[i];
            var dir = n.scale(-1);
            var ptOnEdge = this.mVertex[i];
            otherRect.findSupportPoint(dir, ptOnEdge);
            hasSupport = (tmpSupport.mSupportPoint !== null);
            if ((hasSupport) && (tmpSupport.mSupportPointDist < bestDistance)) {
                bestDistance = tmpSupport.mSupportPointDist;
                bestIndex = i;
                supportPoint = tmpSupport.mSupportPoint;
            }
            i = i + 1;
        }
        if (hasSupport) {
            var bestVec = this.mFaceNormal[bestIndex].scale(bestDistance);
            collisionInfo.setInfo(bestDistance, this.mFaceNormal[bestIndex], supportPoint.add(bestVec));
        }
        return hasSupport;
    };
    RigidRectangle.prototype.collidedRectRect = function (r1, r2, collisionInfo) {
        var status1;
        var status2;
        status1 = r1.findAxisLeastPenetration(r2, collisionInfoR1);
        if (status1) {
            status2 = r2.findAxisLeastPenetration(r1, collisionInfoR2);
            if (status2) {
                if (collisionInfoR1.getDepth() < collisionInfoR2.getDepth()) {
                    var depthVec = collisionInfoR1.getNormal().scale(collisionInfoR1.getDepth());
                    collisionInfo.setInfo(collisionInfoR1.getDepth(), collisionInfoR1.getNormal(), collisionInfoR1.mStart.subtract(depthVec));
                }
                else {
                    collisionInfo.setInfo(collisionInfoR2.getDepth(), collisionInfoR2.getNormal().scale(-1), collisionInfoR2.mStart);
                }
            }
        }
        return status1 && status2;
    };
    RigidRectangle.prototype.collidedRectCirc = function (otherCir, collisionInfo) {
        var inside = true;
        var bestDistance = -99999;
        var nearestEdge = 0;
        var i, v;
        var circ2Pos, projection;
        for (i = 0; i < 4; i++) {
            circ2Pos = otherCir.mCenter;
            v = circ2Pos.subtract(this.mVertex[i]);
            projection = v.dot(this.mFaceNormal[i]);
            if (projection > 0) {
                bestDistance = projection;
                nearestEdge = i;
                inside = false;
                break;
            }
            if (projection > bestDistance) {
                bestDistance = projection;
                nearestEdge = i;
            }
        }
        var dis, normal, radiusVec;
        if (!inside) {
            var v1 = circ2Pos.subtract(this.mVertex[nearestEdge]);
            var v2 = this.mVertex[(nearestEdge + 1) % 4].subtract(this.mVertex[nearestEdge]);
            var dot = v1.dot(v2);
            if (dot < 0) {
                dis = v1.length();
                if (dis > otherCir.mRadius) {
                    return false;
                }
                normal = v1.normalize();
                radiusVec = normal.scale(-otherCir.mRadius);
                collisionInfo.setInfo(otherCir.mRadius - dis, normal, circ2Pos.add(radiusVec));
            }
            else {
                v1 = circ2Pos.subtract(this.mVertex[(nearestEdge + 1) % 4]);
                v2 = v2.scale(-1);
                dot = v1.dot(v2);
                if (dot < 0) {
                    dis = v1.length();
                    if (dis > otherCir.mRadius) {
                        return false;
                    }
                    normal = v1.normalize();
                    radiusVec = normal.scale(-otherCir.mRadius);
                    collisionInfo.setInfo(otherCir.mRadius - dis, normal, circ2Pos.add(radiusVec));
                }
                else {
                    if (bestDistance < otherCir.mRadius) {
                        radiusVec = this.mFaceNormal[nearestEdge].scale(otherCir.mRadius);
                        collisionInfo.setInfo(otherCir.mRadius - bestDistance, this.mFaceNormal[nearestEdge], circ2Pos.subtract(radiusVec));
                    }
                    else {
                        return false;
                    }
                }
            }
        }
        else {
            radiusVec = this.mFaceNormal[nearestEdge].scale(otherCir.mRadius);
            collisionInfo.setInfo(otherCir.mRadius - bestDistance, this.mFaceNormal[nearestEdge], circ2Pos.subtract(radiusVec));
        }
        return true;
    };
    RigidRectangle.isInstanceOf = function (shape) {
        return shape.mType === 'Rectangle';
    };
    return RigidRectangle;
}(RigidShape));
exports.RigidRectangle = RigidRectangle;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var debugError_1 = __webpack_require__(0);
var color_1 = __webpack_require__(5);
var AbstractLight = (function () {
    function AbstractLight(game) {
        this.color = color_1.Color.WHITE;
        this.intensity = 1.0;
        if ( true && !game)
            throw new debugError_1.DebugError("game instanse is not passed to AbstractLight constructor");
        this.game = game;
    }
    return AbstractLight;
}());
exports.AbstractLight = AbstractLight;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var debugError_1 = __webpack_require__(0);
var tween_1 = __webpack_require__(14);
var mathEx_1 = __webpack_require__(8);
var rect_1 = __webpack_require__(3);
var point2d_1 = __webpack_require__(2);
var mat4_1 = __webpack_require__(11);
var CAMERA_MATRIX_MODE;
(function (CAMERA_MATRIX_MODE) {
    CAMERA_MATRIX_MODE[CAMERA_MATRIX_MODE["MODE_TRANSFORM"] = 0] = "MODE_TRANSFORM";
    CAMERA_MATRIX_MODE[CAMERA_MATRIX_MODE["MODE_IDENTITY"] = 1] = "MODE_IDENTITY";
})(CAMERA_MATRIX_MODE = exports.CAMERA_MATRIX_MODE || (exports.CAMERA_MATRIX_MODE = {}));
var Camera = (function () {
    function Camera(game) {
        var _this = this;
        this.scene = null;
        this.sceneWidth = 0;
        this.sceneHeight = 0;
        this.pos = new point2d_1.Point2d(0, 0);
        this.scale = new point2d_1.Point2d(1, 1);
        this.matrixMode = CAMERA_MATRIX_MODE.MODE_TRANSFORM;
        this._rect = new rect_1.Rect();
        this._rectIdentity = new rect_1.Rect();
        this._rectScaled = new rect_1.Rect();
        this.cameraShakeTween = null;
        this.cameraPosCorrection = {
            current: new point2d_1.Point2d(),
            max: new point2d_1.Point2d()
        };
        this.game = game;
        this._updateRect();
        this.sceneWidth = game.width;
        this.sceneHeight = game.height;
        this.scale.observe(function () {
            _this.revalidate();
        });
    }
    Camera.prototype.revalidate = function () {
        this.scene = this.game.getCurrScene();
        if (this.scene.tileMap)
            this.scene.tileMap.revalidate();
        this._rectIdentity.setXYWH(0, 0, this.game.width, this.game.height);
        if (this.scene.tileMap.spriteSheet) {
            this.sceneWidth = this.scene.tileMap.spriteSheet.getFrameWidth() * this.scene.tileMap.width;
            this.sceneHeight = this.scene.tileMap.spriteSheet.getFrameHeight() * this.scene.tileMap.height;
        }
        else {
            this.sceneWidth = this.game.getCurrScene().width || this.game.width;
            this.sceneHeight = this.game.getCurrScene().height || this.game.height;
        }
    };
    Camera.prototype.followTo = function (gameObject) {
        if (gameObject === null)
            return;
        if ( true && gameObject === undefined)
            throw new debugError_1.DebugError("Camera:followTo(gameObject) - gameObject not provided");
        this.objFollowTo = gameObject;
        this.revalidate();
    };
    Camera.prototype.update = function (currTime, delta) {
        this.scene = this.game.getCurrScene();
        var tileWidth = this.scene.tileMap.spriteSheet ? this.scene.tileMap.spriteSheet.getFrameWidth() : 0;
        var tileHeight = this.scene.tileMap.spriteSheet ? this.scene.tileMap.spriteSheet.getFrameHeight() : 0;
        var w = this.game.width;
        var h = this.game.height;
        var wDiv2 = w / 2;
        var hDiv2 = h / 2;
        var wScaled = this.getRectScaled().size.width;
        var gameObject = this.objFollowTo;
        if (gameObject) {
            if (gameObject['_lastDirection'] === 'Right')
                this.cameraPosCorrection.max.x = wScaled / 3;
            if (gameObject['_lastDirection'] === 'Left')
                this.cameraPosCorrection.max.x = -wScaled / 3;
            var currCorrection = this.cameraPosCorrection.max.
                substract(this.cameraPosCorrection.current).
                multiply(0.05);
            this.cameraPosCorrection.current.add(currCorrection);
            var newPos = point2d_1.Point2d.fromPool();
            var pointToFollow = point2d_1.Point2d.fromPool();
            pointToFollow.set(this.objFollowTo.pos);
            pointToFollow.addXY(-wDiv2, -hDiv2);
            newPos.x = this.pos.x + (pointToFollow.x + this.cameraPosCorrection.current.x - this.pos.x) * 0.1;
            newPos.y = this.pos.y + (pointToFollow.y - this.pos.y) * 0.1;
            if (newPos.x < 0)
                newPos.x = 0;
            if (newPos.y < 0)
                newPos.y = 0;
            if (newPos.x > this.sceneWidth - w + tileWidth)
                newPos.x = this.sceneWidth - w + tileWidth;
            if (newPos.y > this.sceneHeight - h + tileHeight)
                newPos.y = this.sceneHeight - h + tileHeight;
            this.pos.setXY(newPos.x, newPos.y);
            if (this.cameraShakeTween)
                this.cameraShakeTween.update();
        }
        this._updateRect();
        this.render();
    };
    Camera.prototype.shake = function (amplitude, time) {
        var _this = this;
        var tweenTarget = { time: 0, point: new point2d_1.Point2d(0, 0) };
        this.cameraShakeTween = new tween_1.Tween({
            target: tweenTarget,
            time: time,
            to: { time: time },
            progress: function () {
                var r1 = mathEx_1.MathEx.random(-amplitude / 2, amplitude / 2);
                var r2 = mathEx_1.MathEx.random(-amplitude / 2, amplitude / 2);
                tweenTarget.point.setXY(r1, r2);
            },
            complete: function () { return _this.cameraShakeTween = null; }
        });
    };
    Camera.prototype._updateRect = function () {
        var p = point2d_1.Point2d.fromPool();
        var point00 = this.screenToWorld(p.setXY(0, 0));
        var pointWH = this.screenToWorld(p.setXY(this.game.width, this.game.height));
        this._rectScaled.setXYWH(point00.x, point00.y, pointWH.x - point00.x, pointWH.y - point00.y);
        p.release();
    };
    Camera.prototype.render = function () {
        var renderer = this.game.getRenderer();
        renderer.translate(this.game.width / 2, this.game.height / 2);
        renderer.scale(this.scale.x, this.scale.y);
        renderer.translate(-this.game.width / 2, -this.game.height / 2);
        renderer.translate(-this.pos.x, -this.pos.y);
        if (this.cameraShakeTween !== null)
            renderer.translate(this.cameraShakeTween.getTarget().point.x, this.cameraShakeTween.getTarget().point.y);
    };
    Camera.prototype.screenToWorld = function (p) {
        var mScale = mat4_1.mat4.makeScale(this.scale.x, this.scale.y, 1);
        var point2d = mathEx_1.MathEx.unProject(p, this.game.width, this.game.height, mScale);
        point2d.add(this.pos);
        return point2d;
    };
    Camera.prototype.getRect = function () {
        if (this.matrixMode === CAMERA_MATRIX_MODE.MODE_IDENTITY)
            return this._rectIdentity;
        else {
            this._rect.setXYWH(this.pos.x, this.pos.y, this.game.width, this.game.height);
            return this._rect;
        }
    };
    Camera.prototype.getRectScaled = function () {
        if (this.matrixMode === CAMERA_MATRIX_MODE.MODE_IDENTITY)
            return this._rectIdentity;
        else
            return this._rectScaled;
    };
    return Camera;
}());
exports.Camera = Camera;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var queue_1 = __webpack_require__(48);
var resourceLink_1 = __webpack_require__(49);
var ResourceLoader = (function () {
    function ResourceLoader(game) {
        this.game = game;
        this.q = new queue_1.Queue();
    }
    ResourceLoader.prototype.loadImage = function (url) {
        var _this = this;
        var link = resourceLink_1.ResourceLink.create();
        this.q.addTask(function () {
            _this.game.getRenderer().loadTextureInfo(url, link, function () { return _this.q.resolveTask(url); });
        }, url);
        return link;
    };
    ResourceLoader.prototype.loadSound = function (url) {
        var _this = this;
        var link = resourceLink_1.ResourceLink.create();
        this.q.addTask(function () {
            _this.game.getAudioPlayer().loadSound(url, link, function () { return _this.q.resolveTask(url); });
        }, url);
        return link;
    };
    ResourceLoader.prototype.startLoading = function () {
        this.q.start();
    };
    ResourceLoader.prototype.isCompleted = function () {
        return this.q.isCompleted();
    };
    ResourceLoader.prototype.getProgress = function () {
        return this.q.calcProgress();
    };
    ResourceLoader.prototype.onProgress = function (fn) {
        this.q.onProgress = fn;
    };
    ResourceLoader.prototype.onCompleted = function (fn) {
        this.q.onResolved = fn;
    };
    return ResourceLoader;
}());
exports.ResourceLoader = ResourceLoader;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(6);
var Timer = (function () {
    function Timer(callback, interval) {
        this.lastTime = 0;
        this.interval = interval;
        this.callback = callback;
    }
    Timer.prototype.onUpdate = function () {
        var time = game_1.Game.getInstance().getTime();
        if (!this.lastTime)
            this.lastTime = time;
        var delta = time - this.lastTime;
        if (delta !== 0 && delta > this.interval) {
            this.lastTime = time;
            this.callback();
        }
    };
    return Timer;
}());
exports.Timer = Timer;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var abstractPrimitive_1 = __webpack_require__(54);
var Plane = (function (_super) {
    tslib_1.__extends(Plane, _super);
    function Plane() {
        var _this = _super.call(this) || this;
        _this.vertexArr = [
            0, 0,
            0, 1,
            1, 0,
            1, 1
        ];
        _this.indexArr = [0, 1, 2, 3];
        _this.texCoordArr = [
            0, 0,
            0, 1,
            1, 0,
            1, 1
        ];
        return _this;
    }
    return Plane;
}(abstractPrimitive_1.AbstractPrimitive));
exports.Plane = Plane;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var shaderProgramUtils_1 = __webpack_require__(7);
var ShaderGenerator = (function () {
    function ShaderGenerator() {
        this.vertexUniforms = [];
        this.fragmentUniforms = [];
        this.attributes = [];
        this.varyings = [];
        this.appendedFragCodeBlocks = [];
        this.appendedVertexCodeBlocks = [];
        this.prependedVertexCodeBlocks = [];
        this.prependedFragCodeBlocks = [];
        this.vertexMainFn = '';
        this.fragmentMainFn = '';
    }
    ShaderGenerator.prototype.addVertexUniform = function (type, name) {
        this.vertexUniforms.push({ type: type, name: name });
        return shaderProgramUtils_1.normalizeUniformName(name);
    };
    ShaderGenerator.prototype.addFragmentUniform = function (type, name) {
        this.fragmentUniforms.push({ type: type, name: name });
        return shaderProgramUtils_1.normalizeUniformName(name);
    };
    ShaderGenerator.prototype.addAttribute = function (type, name) {
        this.attributes.push({ type: type, name: name });
        return shaderProgramUtils_1.normalizeUniformName(name);
    };
    ShaderGenerator.prototype.addVarying = function (type, name) {
        this.varyings.push({ type: type, name: name });
    };
    ShaderGenerator.prototype.appendVertexCodeBlock = function (code) {
        this.appendedVertexCodeBlocks.push(code);
    };
    ShaderGenerator.prototype.appendFragmentCodeBlock = function (code) {
        this.appendedFragCodeBlocks.push(code);
    };
    ShaderGenerator.prototype.prependVertexCodeBlock = function (code) {
        this.prependedVertexCodeBlocks.push(code);
    };
    ShaderGenerator.prototype.prependFragmentCodeBlock = function (code) {
        this.prependedFragCodeBlocks.push(code);
    };
    ShaderGenerator.prototype.setVertexMainFn = function (fnCode) {
        this.vertexMainFn = fnCode;
        return this;
    };
    ShaderGenerator.prototype.setFragmentMainFn = function (fnCode) {
        this.fragmentMainFn = fnCode;
        return this;
    };
    ShaderGenerator.prototype.getVertexSource = function () {
        return ("\n" + this.prependedVertexCodeBlocks.map(function (v) { return "" + v; }).join('\n') + "\n\n" + this.vertexUniforms.map(function (u) { return "uniform   " + u.type + " " + u.name + ";"; }).join('\n') + "\n" + this.attributes.map(function (u) { return "attribute " + u.type + " " + u.name + ";"; }).join('\n') + "\n" + this.varyings.map(function (u) { return "varying   " + u.type + " " + u.name + ";"; }).join('\n') + "\n" + this.appendedVertexCodeBlocks.map(function (v) { return "" + v; }).join('\n') + "\n\n" + this.vertexMainFn);
    };
    ShaderGenerator.prototype.getFragmentSource = function () {
        return ("\nprecision mediump float;\n\n" + this.prependedFragCodeBlocks.map(function (v) { return "" + v; }).join('\n') + "\n\n" + this.fragmentUniforms.map(function (u) { return "uniform " + u.type + " " + u.name + ";"; }).join('\n') + "\n" + this.varyings.map(function (u) { return "varying " + u.type + " " + u.name + ";"; }).join('\n') + "\n" + this.appendedFragCodeBlocks.map(function (v) { return "" + v; }).join('\n') + "\n\n" + this.fragmentMainFn + "\n");
    };
    ShaderGenerator.prototype.debug = function () {
        if (false)
            {}
        console.log('// *** vertex shader source ***');
        console.log(this.getVertexSource());
        console.log('// *** fragment shader source ***');
        console.log(this.getFragmentSource());
    };
    return ShaderGenerator;
}());
exports.ShaderGenerator = ShaderGenerator;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SHAPE_TYPE;
(function (SHAPE_TYPE) {
    SHAPE_TYPE[SHAPE_TYPE["ELLIPSE"] = 0] = "ELLIPSE";
    SHAPE_TYPE[SHAPE_TYPE["RECT"] = 1] = "RECT";
})(SHAPE_TYPE = exports.SHAPE_TYPE || (exports.SHAPE_TYPE = {}));
var FILL_TYPE;
(function (FILL_TYPE) {
    FILL_TYPE[FILL_TYPE["COLOR"] = 0] = "COLOR";
    FILL_TYPE[FILL_TYPE["TEXTURE"] = 1] = "TEXTURE";
    FILL_TYPE[FILL_TYPE["LINEAR_GRADIENT"] = 2] = "LINEAR_GRADIENT";
})(FILL_TYPE = exports.FILL_TYPE || (exports.FILL_TYPE = {}));
exports.fragmentSource = "\n\n#define HALF .5\n#define ZERO  0.\n#define ONE   1.\n#define ERROR_COLOR vec4(ONE,ZERO,ZERO,ONE)\n\nvec4 getFillColor(){\n    if (u_fillType==" + FILL_TYPE.COLOR + ") return u_fillColor;\n    else if (u_fillType==" + FILL_TYPE.LINEAR_GRADIENT + ") {\n        vec2 polarCoords = vec2(length(v_position.xy),atan(v_position.y/v_position.x));\n        polarCoords.y+=u_fillLinearGradient[2].x;\n        vec2 rectCoords = vec2(polarCoords.x*cos(polarCoords.y),polarCoords.x*sin(polarCoords.y));\n        return mix(u_fillLinearGradient[0],u_fillLinearGradient[1],rectCoords.x);\n    }\n    else if (u_fillType==" + FILL_TYPE.TEXTURE + ") {\n        float tx = (v_position.x-u_rectOffsetLeft)/u_width*u_texRect[2]; \n        float ty = (v_position.y-u_rectOffsetTop)/u_height*u_texRect[3];\n        vec2 txVec = vec2(tx,ty);\n        txVec += fract(u_texOffset);\n        txVec = mod(txVec,u_texRect.zw);\n        txVec += u_texRect.xy;\n        return texture2D(texture, txVec);\n    }\n    else return ERROR_COLOR;\n}\nfloat calcRadiusAtAngle(float x,float y) {\n     float a = atan(y-HALF,x-HALF);\n     float cosA = cos(a);\n     float sinA = sin(a);\n     return u_rx*u_ry/sqrt(u_rx*u_rx*sinA*sinA+u_ry*u_ry*cosA*cosA);\n}\nvoid drawEllipse(){\n     float dist = distance(vec2(HALF,HALF),v_position.xy);\n     float rAtCurrAngle = calcRadiusAtAngle(v_position.x,v_position.y);\n     if (dist < rAtCurrAngle) {\n        if (dist > rAtCurrAngle - u_lineWidth) gl_FragColor = u_color;\n        else gl_FragColor = getFillColor();\n     }\n     else discard;\n}\nvoid drawRect(){\n    float x = v_position.x - HALF;\n    float y = v_position.y - HALF;\n    float distX = abs(x);\n    float distY = abs(y);\n    float halfW = u_width  * HALF;\n    float halfH = u_height * HALF;\n    if (distX < halfW && distY < halfH) {\n        \n        if (distX>halfW - u_borderRadius && distY>halfH - u_borderRadius) {\n            vec2 borderCenter = vec2(0.,0.);\n            float posX = v_position.x, posY = v_position.y;\n            if (posX<HALF && posY<HALF) { // top left\n                borderCenter = vec2(HALF - halfW + u_borderRadius,HALF - halfH + u_borderRadius);\n            }\n            else if (posX>HALF && posY<HALF) { // top right\n                borderCenter = vec2(HALF + halfW - u_borderRadius,HALF - halfH + u_borderRadius); \n            }    \n            else if (posX<HALF && posY>HALF) { // bottom left\n                borderCenter = vec2(HALF - halfW + u_borderRadius,HALF + halfH - u_borderRadius); \n            }\n            else {  // bottom right\n                borderCenter = vec2(HALF + halfW - u_borderRadius,HALF + halfH - u_borderRadius);\n            }\n            float distToBorderCenter = distance(v_position.xy,borderCenter);\n            if (distToBorderCenter>u_borderRadius) discard;\n            else if (distToBorderCenter>u_borderRadius-u_lineWidth) gl_FragColor = u_color;\n            else gl_FragColor = getFillColor();\n        }\n        \n        else if (distX > halfW - u_lineWidth || distY > halfH - u_lineWidth)\n            gl_FragColor = u_color;\n        else \n            gl_FragColor = getFillColor();\n    }\n    else discard;\n}\n\nvoid main(){\n    if (u_shapeType==" + SHAPE_TYPE.ELLIPSE + ") drawEllipse();\n    else if (u_shapeType==" + SHAPE_TYPE.RECT + ") drawRect();\n    else gl_FragColor = ERROR_COLOR;\n    gl_FragColor.a*=u_alpha;\n}\n\n\n\n";


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var debugError_1 = __webpack_require__(0);
var texture_1 = __webpack_require__(32);
var FrameBuffer = (function () {
    function FrameBuffer(gl, width, height) {
        if ( true && !gl)
            throw new debugError_1.DebugError("can not create FrameBuffer, gl context not passed to constructor, expected: FrameBuffer(gl)");
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.texture = new texture_1.Texture(gl);
        this.texture.setImage(null, width, height);
        this._init(gl, width, height);
    }
    FrameBuffer.prototype._init = function (gl, width, height) {
        this.glRenderBuffer = gl.createRenderbuffer();
        if ( true && !this.glRenderBuffer)
            throw new debugError_1.DebugError("can not allocate memory for glRenderBuffer");
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.glRenderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        this.glFrameBuffer = gl.createFramebuffer();
        if ( true && !this.glFrameBuffer)
            throw new debugError_1.DebugError("can not allocate memory for glFrameBuffer");
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFrameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.getGlTexture(), 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.glRenderBuffer);
        var fbStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if ( true && fbStatus !== gl.FRAMEBUFFER_COMPLETE) {
            throw new debugError_1.DebugError("frame buffer status error: " + fbStatus + " (expected gl.FRAMEBUFFER_COMPLETE(" + gl.FRAMEBUFFER_COMPLETE + "))");
        }
        this.texture.unbind();
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    FrameBuffer.prototype.bind = function () {
        if (FrameBuffer.currInstance === this)
            return;
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.glFrameBuffer);
        this.gl.viewport(0, 0, this.width, this.height);
        FrameBuffer.currInstance = this;
    };
    FrameBuffer.prototype.unbind = function () {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        FrameBuffer.currInstance = null;
    };
    FrameBuffer.prototype.destroy = function () {
        this.gl.deleteRenderbuffer(this.glRenderBuffer);
        this.gl.deleteFramebuffer(this.glFrameBuffer);
    };
    FrameBuffer.prototype.getTexture = function () {
        return this.texture;
    };
    FrameBuffer.currInstance = null;
    return FrameBuffer;
}());
exports.FrameBuffer = FrameBuffer;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var debugError_1 = __webpack_require__(0);
var size_1 = __webpack_require__(4);
var isPowerOf2 = function (value) {
    return (value & (value - 1)) === 0;
};
var Texture = (function () {
    function Texture(gl) {
        this.tex = null;
        this.size = new size_1.Size(0, 0);
        this.isPowerOfTwo = false;
        if ( true && !gl)
            throw new debugError_1.DebugError("can not create Texture, gl context not passed to constructor, expected: Texture(gl)");
        this.gl = gl;
        if (true) {
            if (!Texture.MAX_TEXTURE_IMAGE_UNITS)
                Texture.MAX_TEXTURE_IMAGE_UNITS = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        }
        this.tex = gl.createTexture();
        if ( true && !this.tex)
            throw new debugError_1.DebugError("can not allocate memory for texture");
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 255, 0, 255]));
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
    }
    Texture.prototype.setImage = function (img, width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        if (true) {
            if (!(img || width || height))
                throw new debugError_1.DebugError("texture.setImage: if image is null, width and height must be specified: tex.setImage(null,w,h)");
        }
        var gl = this.gl;
        if (img)
            this.size.setWH(img.width, img.height);
        else
            this.size.setWH(width, height);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        if (img) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        }
        else {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        this.isPowerOfTwo = img ? (isPowerOf2(img.width) && isPowerOf2(img.height)) : false;
        if (this.isPowerOfTwo) {
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }
        else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    Texture.prototype.bind = function (name, i, program) {
        if (true) {
            if (!name) {
                console.error(this);
                throw new debugError_1.DebugError("can not bind texture: uniform name was not provided");
            }
            if (i > Texture.MAX_TEXTURE_IMAGE_UNITS - 1) {
                throw new debugError_1.DebugError("can not bind texture with index " + i + ". Max supported value by device is " + Texture.MAX_TEXTURE_IMAGE_UNITS);
            }
        }
        program.setUniform(name, i);
        if (Texture.currInstances[i] === this)
            return;
        var gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        Texture.currInstances[i] = this;
    };
    Texture.prototype.unbind = function (i) {
        if (i === void 0) { i = 0; }
        var gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, null);
        delete Texture.currInstances[i];
    };
    Texture.prototype.getColorArray = function () {
        var gl = this.gl;
        var wxh = this.size.width * this.size.height;
        if ( true && gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
            throw new debugError_1.DebugError("Texture.GetColorArray() failed!");
        var pixels = new Uint8Array(wxh * 4);
        gl.readPixels(0, 0, this.size.width, this.size.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        return pixels;
    };
    Texture.prototype.destroy = function () {
        this.gl.deleteTexture(this.tex);
    };
    Texture.prototype.getSize = function () {
        return this.size;
    };
    Texture.prototype.getGlTexture = function () {
        return this.tex;
    };
    Texture.MAX_TEXTURE_IMAGE_UNITS = 0;
    Texture.currInstances = {};
    return Texture;
}());
exports.Texture = Texture;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var rect_1 = __webpack_require__(3);
var debugError_1 = __webpack_require__(0);
var shape_1 = __webpack_require__(20);
var color_1 = __webpack_require__(5);
var point2d_1 = __webpack_require__(2);
var Image = (function (_super) {
    tslib_1.__extends(Image, _super);
    function Image(game) {
        var _this = _super.call(this, game) || this;
        _this.type = 'Image';
        _this.srcRect = new rect_1.Rect();
        _this.borderRadius = 0;
        _this.offset = new point2d_1.Point2d();
        _this.fillColor.set(color_1.Color.NONE);
        return _this;
    }
    Image.prototype.revalidate = function () {
        if ( true && !this.getResourceLink()) {
            console.error(this);
            throw new debugError_1.DebugError("can not render Image: resourceLink is not specified");
        }
        var tex = this.game.getRenderer().getTextureInfo(this.getResourceLink().getId());
        if (this.size.width === 0)
            this.size.width = tex.size.width;
        if (this.size.height === 0)
            this.size.height = tex.size.height;
        if (this.srcRect.size.width === 0)
            this.srcRect.size.width = tex.size.width;
        if (this.srcRect.size.height === 0)
            this.srcRect.size.height = tex.size.height;
    };
    Image.prototype.draw = function () {
        this.game.getRenderer().drawImage(this);
        return true;
    };
    Image.prototype.setClonedProperties = function (cloned) {
        cloned.srcRect.set(this.srcRect);
        cloned.borderRadius = this.borderRadius;
        cloned.offset.set(this.offset);
        _super.prototype.setClonedProperties.call(this, cloned);
    };
    Image.prototype.clone = function () {
        var cloned = new Image(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    };
    return Image;
}(shape_1.Shape));
exports.Image = Image;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var shape_1 = __webpack_require__(20);
var Rectangle = (function (_super) {
    tslib_1.__extends(Rectangle, _super);
    function Rectangle(game) {
        var _this = _super.call(this, game) || this;
        _this.type = 'Rectangle';
        _this.borderRadius = 0;
        _this.size.setWH(16);
        _this.lineWidth = 1;
        return _this;
    }
    Rectangle.prototype.draw = function () {
        this.game.getRenderer().drawRectangle(this);
        return true;
    };
    Rectangle.prototype.setClonedProperties = function (cloned) {
        cloned.borderRadius = this.borderRadius;
        cloned.size.set(this.size);
        cloned.lineWidth = this.lineWidth;
        _super.prototype.setClonedProperties.call(this, cloned);
    };
    Rectangle.prototype.clone = function () {
        var cloned = new Rectangle(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    };
    return Rectangle;
}(shape_1.Shape));
exports.Rectangle = Rectangle;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var rect_1 = __webpack_require__(3);
var debugError_1 = __webpack_require__(0);
var scrollableContainer_1 = __webpack_require__(58);
var image_1 = __webpack_require__(33);
var size_1 = __webpack_require__(4);
var point2d_1 = __webpack_require__(2);
var TEXT_ALIGN;
(function (TEXT_ALIGN) {
    TEXT_ALIGN[TEXT_ALIGN["LEFT"] = 0] = "LEFT";
    TEXT_ALIGN[TEXT_ALIGN["RIGHT"] = 1] = "RIGHT";
    TEXT_ALIGN[TEXT_ALIGN["CENTER"] = 2] = "CENTER";
    TEXT_ALIGN[TEXT_ALIGN["JUSTIFY"] = 3] = "JUSTIFY";
})(TEXT_ALIGN = exports.TEXT_ALIGN || (exports.TEXT_ALIGN = {}));
var TextInfo = (function () {
    function TextInfo(textField) {
        this.textField = textField;
        this.allCharsCached = [];
        this.size = new size_1.Size();
        this.pos = new point2d_1.Point2d();
        this.strings = [];
    }
    TextInfo.prototype.reset = function () {
        this.allCharsCached = [];
        this.strings = [];
        this.pos.setXY(0, 0);
    };
    TextInfo.prototype.newString = function () {
        this.pos.x = 0;
        if (this.strings.length) {
            this.pos.y += this.textField.getFont().getDefaultSymbolHeight();
        }
        this.strings.push(new StringInfo());
    };
    TextInfo.prototype.addChar = function (c) {
        this.strings[this.strings.length - 1].chars.push(c);
        this.allCharsCached.push(c);
        c.destRect.setPoint(this.pos);
        this.pos.addX(c.sourceRect.size.width);
    };
    TextInfo.prototype.addWord = function (w) {
        var _this = this;
        w.chars.forEach(function (c) {
            _this.addChar(c);
        });
    };
    TextInfo.prototype.revalidate = function (defaultSymbolHeight) {
        this.size.setWH(0);
        for (var _i = 0, _a = this.strings; _i < _a.length; _i++) {
            var s = _a[_i];
            s.calcSize(defaultSymbolHeight);
            this.size.height += s.height;
            if (s.width > this.size.width)
                this.size.width = s.width;
        }
    };
    TextInfo.prototype.align = function (textAlign) {
        var _this = this;
        if ( true && TEXT_ALIGN[textAlign] === undefined) {
            var keys = Object.keys(TEXT_ALIGN).join(', ');
            throw new debugError_1.DebugError("can not align text: unknown enum type of TEXT_ALIGN: " + textAlign + ", expected: " + keys);
        }
        this.strings.forEach(function (s) {
            s.align(textAlign, _this.textField);
        });
    };
    return TextInfo;
}());
var CharInfo = (function () {
    function CharInfo() {
        this.destRect = new rect_1.Rect();
        this.sourceRect = new rect_1.Rect();
    }
    return CharInfo;
}());
var CharsHolder = (function () {
    function CharsHolder() {
        this.chars = [];
    }
    CharsHolder.prototype.moveBy = function (dx, dy) {
        for (var _i = 0, _a = this.chars; _i < _a.length; _i++) {
            var ch = _a[_i];
            ch.destRect.point.addXY(dx, dy);
        }
    };
    CharsHolder.prototype.moveTo = function (x, y) {
        var initialOffsetX = 0;
        for (var _i = 0, _a = this.chars; _i < _a.length; _i++) {
            var ch = _a[_i];
            ch.destRect.point.setXY(initialOffsetX + x, y);
            initialOffsetX += ch.sourceRect.size.width;
        }
    };
    return CharsHolder;
}());
var WordInfo = (function (_super) {
    tslib_1.__extends(WordInfo, _super);
    function WordInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.width = 0;
        return _this;
    }
    WordInfo.prototype.revalidate = function () {
        this.width = 0;
        for (var _i = 0, _a = this.chars; _i < _a.length; _i++) {
            var ch = _a[_i];
            this.width += ch.destRect.size.width;
        }
    };
    WordInfo.prototype.addChar = function (c) {
        this.chars.push(c);
        this.width += c.sourceRect.size.width;
    };
    return WordInfo;
}(CharsHolder));
var StringInfo = (function (_super) {
    tslib_1.__extends(StringInfo, _super);
    function StringInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.width = 0;
        _this.height = 0;
        return _this;
    }
    StringInfo.prototype.calcSize = function (defaultSymbolHeight) {
        this.width = 0;
        this.height = defaultSymbolHeight;
        for (var _i = 0, _a = this.chars; _i < _a.length; _i++) {
            var ch = _a[_i];
            this.width += ch.sourceRect.size.width;
        }
    };
    StringInfo.prototype.toWords = function () {
        var res = [];
        var currWord = new WordInfo();
        for (var _i = 0, _a = this.chars; _i < _a.length; _i++) {
            var ch = _a[_i];
            if (ch.symbol === ' ') {
                if (currWord.chars.length) {
                    res.push(currWord);
                    currWord = new WordInfo();
                }
            }
            else {
                currWord.chars.push(ch);
            }
        }
        if (res.indexOf(currWord) === -1)
            res.push(currWord);
        return res;
    };
    StringInfo.prototype.align = function (textAlign, textField) {
        switch (textAlign) {
            case TEXT_ALIGN.LEFT:
                break;
            case TEXT_ALIGN.CENTER:
                var offset = textField.size.width - this.width;
                if (offset < 0)
                    return;
                offset /= 2;
                this.moveBy(offset, 0);
                break;
            case TEXT_ALIGN.RIGHT:
                offset = textField.size.width - this.width;
                if (offset < 0)
                    return;
                this.moveBy(offset, 0);
                break;
            case TEXT_ALIGN.JUSTIFY:
                var words = this.toWords();
                if (words.length <= 1)
                    return;
                if (!words[0].chars.length)
                    return;
                var totalWordsWidth_1 = 0;
                words.forEach(function (w) {
                    w.revalidate();
                    totalWordsWidth_1 += w.width;
                });
                var totalSpaceWidth = textField.size.width - totalWordsWidth_1;
                var oneSpaceWidth = totalSpaceWidth / (words.length - 1);
                var initialPosY = this.chars[0].destRect.point.y;
                var currXPointer = this.chars[0].destRect.point.x;
                for (var i = 0; i < words.length; i++) {
                    var w = words[i];
                    w.moveTo(currXPointer, initialPosY);
                    currXPointer += w.width + oneSpaceWidth;
                }
                break;
            default:
                if (true)
                    throw new debugError_1.DebugError("unknown TEXT_ALIGN value: " + textAlign);
        }
    };
    return StringInfo;
}(CharsHolder));
var TextField = (function (_super) {
    tslib_1.__extends(TextField, _super);
    function TextField(game) {
        var _this = _super.call(this, game) || this;
        _this.type = 'TextField';
        _this.textAlign = TEXT_ALIGN.LEFT;
        _this.border = null;
        _this._text = '';
        _this._font = null;
        _this._textInfo = new TextInfo(_this);
        _this._symbolImage = new image_1.Image(_this.game);
        _this._initScrolling({ vertical: true });
        return _this;
    }
    TextField.prototype.revalidate = function () {
        _super.prototype.revalidate.call(this);
        if ( true && !this._font)
            throw new debugError_1.DebugError("font is not provided");
        if ( true && !this._font.getResourceLink())
            throw new debugError_1.DebugError("can not render textField: font resource link is not set");
    };
    TextField.prototype._getCharInfo = function (c) {
        var charRect = this._font.fontContext.symbols[c] ||
            this._font.fontContext.symbols[' '];
        var charInfo = new CharInfo();
        charInfo.symbol = c;
        charInfo.sourceRect = charRect;
        charInfo.destRect.setSize(charRect.size);
        return charInfo;
    };
    TextField.prototype.onGeometryChanged = function () {
        var _this = this;
        _super.prototype.onGeometryChanged.call(this);
        var textInfo = this._textInfo;
        textInfo.reset();
        textInfo.newString();
        var text = this._text;
        var strings = text.split('\n');
        strings.forEach(function (str, i) {
            var words = str.split(' ');
            words.forEach(function (w, i) {
                var wordInfo = new WordInfo();
                for (var k = 0; k < w.length; k++) {
                    var charInfo = _this._getCharInfo(w[k]);
                    wordInfo.addChar(charInfo);
                }
                if (_this.maxWidth && textInfo.pos.x + wordInfo.width > _this.maxWidth && i < words.length - 1) {
                    textInfo.newString();
                }
                textInfo.addWord(wordInfo);
                if (i < str.length - 1) {
                    var spaceChar = _this._getCharInfo(' ');
                    textInfo.addChar(spaceChar);
                }
            });
            if (i < strings.length - 1) {
                textInfo.newString();
            }
        });
        textInfo.revalidate(this._font.getDefaultSymbolHeight());
        textInfo.align(this.textAlign);
        this.size.width = textInfo.size.width;
        if (this.maxHeight !== 0 && textInfo.size.height > this.maxHeight) {
            this.size.height = this.maxHeight;
        }
        else {
            this.size.height = textInfo.size.height;
        }
        if (this.border) {
            this.border.size.set(this.size);
        }
        this.updateScrollSize(textInfo.size.height, this.size.height);
    };
    TextField.prototype.setText = function (text) {
        if (text === void 0) { text = ''; }
        this._text = text.toString();
        this._dirty = true;
    };
    TextField.prototype.getText = function () {
        return this._text;
    };
    TextField.prototype.setFont = function (font) {
        font.revalidate();
        this._font = font;
        this.setText(this._text);
    };
    TextField.prototype.getFont = function () {
        return this._font;
    };
    TextField.prototype.draw = function () {
        var renderer = this.game.getRenderer();
        renderer.lockRect(this.getScreenRect());
        renderer.save();
        if (this.vScrollInfo.offset)
            renderer.translate(0, -this.vScrollInfo.offset, 0);
        this._symbolImage.setResourceLink(this._font.getResourceLink());
        for (var _i = 0, _a = this._textInfo.allCharsCached; _i < _a.length; _i++) {
            var charInfo = _a[_i];
            if (charInfo.destRect.point.y - this.vScrollInfo.offset > this.size.height)
                continue;
            if (charInfo.destRect.point.y + charInfo.destRect.size.height - this.vScrollInfo.offset < 0)
                continue;
            this._symbolImage.srcRect.set(charInfo.sourceRect);
            this._symbolImage.setXYWH(charInfo.destRect.point.x, charInfo.destRect.point.y, charInfo.destRect.size.width, charInfo.destRect.size.height);
            this._symbolImage.render();
        }
        renderer.restore();
        renderer.unlockRect();
        if (this.border)
            this.border.render();
        return true;
    };
    return TextField;
}(scrollableContainer_1.ScrollableContainer));
exports.TextField = TextField;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var val = 0;
var Incrementer = (function () {
    function Incrementer() {
    }
    Incrementer.getValue = function () {
        return val++;
    };
    return Incrementer;
}());
exports.Incrementer = Incrementer;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var game_1 = __webpack_require__(6);
var rect_1 = __webpack_require__(3);
var resource_1 = __webpack_require__(21);
var color_1 = __webpack_require__(5);
var debugError_1 = __webpack_require__(0);
var resourceLoader_1 = __webpack_require__(26);
var FontFactory;
(function (FontFactory) {
    var SYMBOL_PADDING = 4;
    var getFontHeight = function (strFont) {
        var parent = document.createElement("span");
        parent.appendChild(document.createTextNode("height!ДдЙЇ"));
        document.body.appendChild(parent);
        parent.style.cssText = "font: " + strFont + "; white-space: nowrap; display: inline;";
        var height = parent.offsetHeight;
        document.body.removeChild(parent);
        return height;
    };
    FontFactory.getFontContext = function (arrFromTo, strFont, w) {
        var cnv = document.createElement('canvas');
        var ctx = cnv.getContext('2d');
        ctx.font = strFont;
        var textHeight = getFontHeight(strFont) + 2 * SYMBOL_PADDING;
        var symbols = {};
        var currX = 0, currY = 0, cnvHeight = textHeight;
        for (var k = 0; k < arrFromTo.length; k++) {
            var arrFromToCurr = arrFromTo[k];
            for (var i = arrFromToCurr.from; i < arrFromToCurr.to; i++) {
                var currentChar = String.fromCharCode(i);
                var ctx_1 = cnv.getContext('2d');
                var textWidth = ctx_1.measureText(currentChar).width;
                textWidth += 2 * SYMBOL_PADDING;
                if (textWidth == 0)
                    continue;
                if (currX + textWidth > w) {
                    currX = 0;
                    currY += textHeight;
                    cnvHeight = currY + textHeight;
                }
                var symbolRect = new rect_1.Rect();
                symbolRect.point.x = ~~currX + SYMBOL_PADDING;
                symbolRect.point.y = ~~currY + SYMBOL_PADDING;
                symbolRect.size.width = ~~textWidth - 2 * SYMBOL_PADDING;
                symbolRect.size.height = textHeight - 2 * SYMBOL_PADDING;
                symbols[currentChar] = symbolRect;
                currX += textWidth;
            }
        }
        return { symbols: symbols, width: w, height: cnvHeight };
    };
    FontFactory.getFontImageBase64 = function (fontContext, strFont, color) {
        var cnv = document.createElement('canvas');
        cnv.width = fontContext.width;
        cnv.height = fontContext.height;
        var ctx = cnv.getContext('2d');
        ctx.font = strFont;
        ctx.textBaseline = "top";
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.oImageSmoothingEnabled = false;
        ctx.fillStyle = '#00000000';
        ctx.fillRect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = color.asCSS();
        var symbols = fontContext.symbols;
        Object.keys(symbols).forEach(function (symbol) {
            var rect = symbols[symbol];
            ctx.fillText(symbol, rect.point.x, rect.point.y);
        });
        return cnv.toDataURL();
    };
    FontFactory.generate = function (f, s) {
        f.createContext();
        var link = s.resourceLoader.loadImage(f.createBitmap());
        f.setResourceLink(link);
    };
})(FontFactory = exports.FontFactory || (exports.FontFactory = {}));
var Font = (function (_super) {
    tslib_1.__extends(Font, _super);
    function Font(game) {
        var _this = _super.call(this) || this;
        _this.game = game;
        _this.type = 'Font';
        _this.fontSize = 12;
        _this.fontFamily = 'Monospace';
        _this.fontColor = color_1.Color.BLACK.clone();
        return _this;
    }
    Font.getSystemFont = function () {
        if (Font._systemFontInstance)
            return Font._systemFontInstance;
        var f = new Font(game_1.Game.getInstance());
        f.createContext();
        var resourceLoader = new resourceLoader_1.ResourceLoader(game_1.Game.getInstance());
        var link = resourceLoader.loadImage(f.createBitmap());
        resourceLoader.startLoading();
        f.setResourceLink(link);
        Font._systemFontInstance = f;
        return f;
    };
    Font.prototype.asCss = function () {
        return this.fontSize + "px " + this.fontFamily;
    };
    Font.prototype.createContext = function () {
        var ranges = [{ from: 32, to: 126 }, { from: 1040, to: 1116 }];
        var WIDTH = 512;
        this.fontContext = FontFactory.getFontContext(ranges, this.asCss(), WIDTH);
    };
    Font.prototype.createBitmap = function () {
        return FontFactory.getFontImageBase64(this.fontContext, this.asCss(), this.fontColor);
    };
    Font.prototype.revalidate = function () {
        if (true) {
            if (!this.fontContext)
                throw new debugError_1.DebugError("font context is not created");
            if (!this.getResourceLink())
                throw new debugError_1.DebugError("font without resource link");
        }
    };
    Font.prototype.getDefaultSymbolHeight = function () {
        return this.fontContext.symbols[' '].size.height;
    };
    return Font;
}(resource_1.Resource));
exports.Font = Font;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var plane_1 = __webpack_require__(28);
var shaderProgram_1 = __webpack_require__(16);
var abstractDrawer_1 = __webpack_require__(12);
var bufferInfo_1 = __webpack_require__(17);
var shaderGenerator_1 = __webpack_require__(29);
var shaderProgramUtils_1 = __webpack_require__(7);
var debugError_1 = __webpack_require__(0);
var SimpleRectDrawer = (function (_super) {
    tslib_1.__extends(SimpleRectDrawer, _super);
    function SimpleRectDrawer(gl) {
        return _super.call(this, gl) || this;
    }
    SimpleRectDrawer.prototype.prepareShaderGenerator = function () {
        this.gen = new shaderGenerator_1.ShaderGenerator();
        var gen = this.gen;
        this.a_position = gen.addAttribute(shaderProgramUtils_1.GL_TYPE.FLOAT_VEC4, 'a_position');
        this.a_texCoord = gen.addAttribute(shaderProgramUtils_1.GL_TYPE.FLOAT_VEC2, 'a_texCoord');
        this.u_vertexMatrix = gen.addVertexUniform(shaderProgramUtils_1.GL_TYPE.FLOAT_MAT4, 'u_vertexMatrix');
        this.u_textureMatrix = gen.addVertexUniform(shaderProgramUtils_1.GL_TYPE.FLOAT_MAT4, 'u_textureMatrix');
        gen.addVarying(shaderProgramUtils_1.GL_TYPE.FLOAT_VEC2, 'v_texCoord');
        gen.setVertexMainFn("\n            void main(){\n                gl_Position = u_vertexMatrix * a_position;\n                v_texCoord = (u_textureMatrix * vec4(a_texCoord, 0, 1)).xy;\n            } \n        ");
        gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.SAMPLER_2D, 'texture');
        gen.setFragmentMainFn("\n            void main(){\n                gl_FragColor = texture2D(texture, v_texCoord);\n            }\n        ");
    };
    SimpleRectDrawer.prototype.initProgram = function () {
        if (true) {
            if (!this.gen)
                throw new debugError_1.DebugError("can not init simpleRectDrawer instance: prepareShaderGenerator method must be invoked");
        }
        this.primitive = new plane_1.Plane();
        this.program = new shaderProgram_1.ShaderProgram(this.gl, this.gen.getVertexSource(), this.gen.getFragmentSource());
        this.bufferInfo = new bufferInfo_1.BufferInfo(this.gl, {
            posVertexInfo: { array: this.primitive.vertexArr, type: this.gl.FLOAT, size: 2, attrName: 'a_position' },
            posIndexInfo: { array: this.primitive.indexArr },
            texVertexInfo: { array: this.primitive.texCoordArr, type: this.gl.FLOAT, size: 2, attrName: 'a_texCoord' },
            drawMethod: this.gl.TRIANGLE_STRIP
        });
    };
    return SimpleRectDrawer;
}(abstractDrawer_1.AbstractDrawer));
exports.SimpleRectDrawer = SimpleRectDrawer;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tileMap_1 = __webpack_require__(40);
var layer_1 = __webpack_require__(41);
var ambientLight_1 = __webpack_require__(42);
var color_1 = __webpack_require__(5);
var camera_1 = __webpack_require__(25);
var resourceLoader_1 = __webpack_require__(26);
var eventEmitter_1 = __webpack_require__(19);
var object_1 = __webpack_require__(13);
var tween_1 = __webpack_require__(14);
var timer_1 = __webpack_require__(27);
var mouseEvents_1 = __webpack_require__(10);
var debugError_1 = __webpack_require__(0);
var Scene = (function () {
    function Scene(game) {
        this.game = game;
        this.type = 'Scene';
        this.useBG = false;
        this.colorBG = color_1.Color.WHITE.clone();
        this.filters = [];
        this._layers = [];
        this._tweens = [];
        this._tweenMovies = [];
        this._timers = [];
        this.tileMap = new tileMap_1.TileMap(game);
        this.ambientLight = new ambientLight_1.AmbientLight(game);
        this._uiLayer = new layer_1.Layer(this.game);
        this.addLayer(new layer_1.Layer(game));
        this.resourceLoader = new resourceLoader_1.ResourceLoader(game);
    }
    Scene.prototype.revalidate = function () {
        if (this.width == 0)
            this.width = this.game.width;
        if (this.height == 0)
            this.height = this.game.height;
    };
    Scene.prototype.getLayers = function () {
        return this._layers;
    };
    Scene.prototype.getUiLayer = function () {
        return this._uiLayer;
    };
    Scene.prototype.getAllGameObjects = function () {
        var res = [];
        var ONE = 1;
        for (var i = 0; i < this._layers.length; i++) {
            var layer = this._layers[this._layers.length - ONE - i];
            for (var j = 0; j < layer.children.length; j++) {
                var go = layer.children[layer.children.length - ONE - j];
                res.push(go);
            }
        }
        return res;
    };
    Scene.prototype.getDefaultLayer = function () {
        return this._layers[0];
    };
    Scene.prototype.addLayer = function (layer) {
        this._layers.push(layer);
    };
    Scene.prototype.removeLayer = function (layer) {
        object_1.removeFromArray(this._layers, function (it) { return it === layer; });
    };
    Scene.prototype.appendChild = function (go) {
        go.revalidate();
        this.getDefaultLayer().appendChild(go);
    };
    Scene.prototype.prependChild = function (go) {
        this.getDefaultLayer().prependChild(go);
    };
    Scene.prototype.onPreloading = function () { };
    Scene.prototype.onProgress = function (val) { };
    Scene.prototype.onReady = function () { };
    Scene.prototype.beforeUpdate = function () { };
    Scene.prototype.onUpdate = function () { };
    Scene.prototype.beforeRender = function () { };
    Scene.prototype.onRender = function () { };
    Scene.prototype.onDestroy = function () { };
    Scene.prototype.updateMainFrame = function () {
        var _this = this;
        this.beforeUpdate();
        this._tweens.forEach(function (t, index) {
            t.update();
            if (t.isCompleted())
                _this._tweens.splice(index, 1);
        });
        this._tweenMovies.forEach(function (t, index) {
            t.update();
            if (t.isCompleted())
                _this._tweenMovies.splice(index, 1);
        });
        this._timers.forEach(function (t) {
            t.onUpdate();
        });
        var layers = this._layers;
        for (var _i = 0, layers_1 = layers; _i < layers_1.length; _i++) {
            var l = layers_1[_i];
            l.update();
        }
        this._uiLayer.update();
        this.onUpdate();
    };
    Scene.prototype.update = function () {
        if (!this.resourceLoader.isCompleted()) {
            if (this.preloadingGameObject !== undefined) {
                this.preloadingGameObject.update();
            }
        }
        else {
            this.updateMainFrame();
        }
    };
    Scene.prototype.renderMainFrame = function () {
        var renderer = this.game.getRenderer();
        this.game.camera.update(this.game.getTime(), this.game.getDeltaTime());
        var layers = this._layers;
        for (var _i = 0, layers_2 = layers; _i < layers_2.length; _i++) {
            var l = layers_2[_i];
            l.render();
        }
        this.tileMap.render();
        renderer.save();
        renderer.resetTransform();
        this.game.camera.matrixMode = camera_1.CAMERA_MATRIX_MODE.MODE_IDENTITY;
        this._uiLayer.render();
        renderer.restore();
        this.game.camera.matrixMode = camera_1.CAMERA_MATRIX_MODE.MODE_TRANSFORM;
        this.onRender();
        if (true) {
            this.game.getRenderer().restore();
            if (this.game.getRenderer().debugTextField &&
                this.game.getRenderer().debugTextField.getFont().getResourceLink() &&
                this.game.getRenderer().debugTextField.getFont().getResourceLink().getTarget()) {
                this.game.getRenderer().debugTextField.update();
                this.game.getRenderer().debugTextField.render();
            }
            this.game.getRenderer().restore();
        }
    };
    Scene.prototype.renderPreloadingFrame = function () {
        this.game.getRenderer().resetTransform();
        this.preloadingGameObject.render();
    };
    Scene.prototype.render = function () {
        this.beforeRender();
        var renderer = this.game.getRenderer();
        renderer.beginFrameBuffer();
        if (this.useBG)
            renderer.clearColor(this.colorBG);
        else
            renderer.clear();
        this.game.camera.matrixMode = camera_1.CAMERA_MATRIX_MODE.MODE_TRANSFORM;
        if (!this.resourceLoader.isCompleted()) {
            if (this.preloadingGameObject !== undefined) {
                this.renderPreloadingFrame();
            }
        }
        else {
            this.renderMainFrame();
        }
        renderer.flipFrameBuffer(this.filters);
    };
    Scene.prototype.tween = function (desc) {
        var t = new tween_1.Tween(desc);
        this._tweens.push(t);
        return t;
    };
    Scene.prototype.addTween = function (t) {
        this._tweens.push(t);
    };
    Scene.prototype.addTweenMovie = function (tm) {
        this._tweenMovies.push(tm);
    };
    Scene.prototype.setTimer = function (callback, interval) {
        var t = new timer_1.Timer(callback, interval);
        this._timers.push(t);
        return t;
    };
    Scene.prototype.on = function (eventName, callBack) {
        if ( true && !this.game.hasControl('Mouse')) {
            if (mouseEvents_1.MOUSE_EVENTS[eventName] != undefined) {
                throw new debugError_1.DebugError('can not listen mouse events: mouse control is not added');
            }
        }
        if (this._emitter === undefined)
            this._emitter = new eventEmitter_1.EventEmitter();
        this._emitter.on(eventName, callBack);
        return callBack;
    };
    Scene.prototype.off = function (eventName, callBack) {
        if (this._emitter !== undefined)
            this._emitter.off(eventName, callBack);
    };
    Scene.prototype.trigger = function (eventName, data) {
        if (this._emitter !== undefined)
            this._emitter.trigger(eventName, data);
    };
    Scene.prototype.destroy = function () {
        this.onDestroy();
    };
    return Scene;
}());
exports.Scene = Scene;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var rect_1 = __webpack_require__(3);
var rigidShapes_1 = __webpack_require__(23);
var debugError_1 = __webpack_require__(0);
var TileMap = (function () {
    function TileMap(game) {
        this.game = game;
        this.type = "TileMap";
        this.spriteSheet = null;
        this.data = [];
        this.width = 0;
        this.height = 0;
        this.blendMode = '';
    }
    TileMap.prototype.fromTiledJSON = function (source, mapWidth, mapHeight) {
        this.data = [];
        var cnt = 0;
        for (var j = 0; j < mapHeight; j++) {
            this.data[j] = [];
            for (var i = 0; i < mapWidth; i++) {
                var val = source[cnt++];
                if (val === 0)
                    this.data[j][i] = undefined;
                else {
                    this.data[j][i] = {};
                    this.data[j][i].val = val - 1;
                    var w = this.spriteSheet.getFrameWidth();
                    var h = this.spriteSheet.getFrameHeight();
                    var x = i * w;
                    var y = j * h;
                    var c = new rigidShapes_1.Vec2(x + w / 2, y + h / 2);
                    var r = new rigidShapes_1.RigidRectangle(this.game, c, w, h, 0);
                    r.fixedAngle = true;
                    this.data[j][i].rect = r;
                }
            }
        }
        this.width = mapWidth;
        this.height = mapHeight;
        if (true) {
            var found = cnt;
            var expected = source.length;
            if (expected !== found) {
                throw new debugError_1.DebugError("incorrect mapWidth/mapHeight provided. Expected " + expected + " tiles, but " + found + " found (" + mapWidth + "*" + mapHeight + ")");
            }
        }
    };
    TileMap.prototype.revalidate = function () {
        this.game.camera._updateRect();
        var camRect = this.game.camera.getRectScaled();
        if (!this.spriteSheet)
            return;
        this._tilesInScreenX = ~~(camRect.size.width / this.spriteSheet.getFrameWidth());
        this._tilesInScreenY = ~~(camRect.size.height / this.spriteSheet.getFrameHeight());
    };
    TileMap.prototype.getTileAt = function (x, y) {
        if (!this.spriteSheet)
            return;
        var tilePosX = ~~(x / this.spriteSheet.getFrameWidth());
        var tilePosY = ~~(y / this.spriteSheet.getFrameHeight());
        if (!this.data[tilePosY])
            return;
        var tile = this.data[tilePosY][tilePosX];
        if (!tile)
            return;
        return {
            tileIndex: this.spriteSheet.numOfFramesH * tilePosY + tilePosX + 1,
            tile: tile
        };
    };
    TileMap.prototype.getTilesAtRect = function (rect) {
        var result = [];
        if (!this.spriteSheet)
            return result;
        var alreadyCheckedTiles = {};
        var x = rect.point.x, y;
        var maxX = rect.point.x + rect.size.width, maxY = rect.point.y + rect.size.height;
        while (true) {
            y = rect.point.y;
            while (true) {
                var tileInfo = this.getTileAt(x, y);
                if (tileInfo) {
                    if (!alreadyCheckedTiles[tileInfo.tileIndex]) {
                        result.push(tileInfo.tile);
                        alreadyCheckedTiles[tileInfo.tileIndex] = true;
                    }
                }
                if (y === maxY)
                    break;
                y += this.spriteSheet.getFrameHeight();
                if (y > maxY)
                    y = maxY;
            }
            if (x === maxX)
                break;
            x += this.spriteSheet.getFrameWidth();
            if (x > maxX)
                x = maxX;
        }
        return result;
    };
    TileMap.prototype.render = function () {
        var spriteSheet = this.spriteSheet;
        if (!spriteSheet)
            return;
        var camera = this.game.camera;
        var cameraRect = camera.getRectScaled();
        var tilePosX = ~~((cameraRect.point.x) / this.spriteSheet.getFrameWidth());
        var tilePosY = ~~((cameraRect.point.y) / this.spriteSheet.getFrameHeight());
        if (tilePosX < 0)
            tilePosX = 0;
        if (tilePosY < 0)
            tilePosY = 0;
        var w = tilePosX + this._tilesInScreenX + 1;
        var h = tilePosY + this._tilesInScreenY + 1;
        for (var y = tilePosY; y <= h; y++) {
            for (var x = tilePosX; x <= w; x++) {
                var tileVal = this.data[y] && this.data[y][x] && this.data[y][x].val;
                if (tileVal === false || tileVal === null || tileVal === undefined)
                    continue;
                var destRect = rect_1.Rect.fromPool().clone();
                destRect.setXYWH(x * spriteSheet.getFrameWidth(), y * spriteSheet.getFrameHeight(), spriteSheet.getFrameWidth(), spriteSheet.getFrameHeight());
            }
        }
    };
    return TileMap;
}());
exports.TileMap = TileMap;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Layer = (function () {
    function Layer(game) {
        this.game = game;
        this.type = 'Layer';
        this.children = [];
    }
    Layer.prototype.prependChild = function (go) {
        go.parent = null;
        go.setLayer(this);
        go.revalidate();
        this.children.unshift(go);
    };
    Layer.prototype.appendChild = function (go) {
        go.parent = null;
        go.setLayer(this);
        go.revalidate();
        this.children.push(go);
    };
    Layer.prototype.update = function () {
        var all = this.children;
        for (var _i = 0, all_1 = all; _i < all_1.length; _i++) {
            var obj = all_1[_i];
            obj.update();
        }
    };
    Layer.prototype.render = function () {
        var all = this.children;
        for (var _i = 0, all_2 = all; _i < all_2.length; _i++) {
            var obj = all_2[_i];
            obj.render();
        }
    };
    return Layer;
}());
exports.Layer = Layer;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var abstractLight_1 = __webpack_require__(24);
var AmbientLight = (function (_super) {
    tslib_1.__extends(AmbientLight, _super);
    function AmbientLight(game) {
        var _this = _super.call(this, game) || this;
        _this.direction = [1, 1, 1];
        return _this;
    }
    AmbientLight.prototype.setUniforms = function (uniform) {
        uniform['u_ambientLight.color'] = this.color.asGL();
        uniform['u_ambientLight.direction'] = this.direction;
    };
    return AmbientLight;
}(abstractLight_1.AbstractLight));
exports.AmbientLight = AmbientLight;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Easing = (function () {
    function Easing() {
    }
    Easing.linear = function (t, b, c, d) {
        return c * t / d + b;
    };
    Easing.easeInQuad = function (t, b, c, d) {
        t /= d;
        return c * t * t + b;
    };
    Easing.easeOutQuad = function (t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
    };
    Easing.easeInOutQuad = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };
    Easing.easeInCubic = function (t, b, c, d) {
        t /= d;
        return c * t * t * t + b;
    };
    Easing.easeOutCubic = function (t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    };
    Easing.easeInOutCubic = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    };
    Easing.easeInQuart = function (t, b, c, d) {
        t /= d;
        return c * t * t * t * t + b;
    };
    Easing.easeOutQuart = function (t, b, c, d) {
        t /= d;
        t--;
        return -c * (t * t * t * t - 1) + b;
    };
    Easing.easeInOutQuart = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return c / 2 * t * t * t * t + b;
        t -= 2;
        return -c / 2 * (t * t * t * t - 2) + b;
    };
    Easing.easeInQuint = function (t, b, c, d) {
        t /= d;
        return c * t * t * t * t * t + b;
    };
    Easing.easeOutQuint = function (t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t * t * t + 1) + b;
    };
    Easing.easeInOutQuint = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return c / 2 * t * t * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t * t * t + 2) + b;
    };
    Easing.easeInSine = function (t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    };
    Easing.easeOutSine = function (t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    };
    Easing.easeInOutSine = function (t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };
    Easing.easeInExpo = function (t, b, c, d) {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
    };
    Easing.easeOutExpo = function (t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) + b;
    };
    Easing.easeInOutExpo = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        t--;
        return c / 2 * (-Math.pow(2, -10 * t) + 2) + b;
    };
    Easing.easeInCirc = function (t, b, c, d) {
        t /= d;
        return -c * (Math.sqrt(1 - t * t) - 1) + b;
    };
    Easing.easeOutCirc = function (t, b, c, d) {
        t /= d;
        t--;
        return c * Math.sqrt(1 - t * t) + b;
    };
    Easing.easeInOutCirc = function (t, b, c, d) {
        t /= d / 2;
        if (t < 1)
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        t -= 2;
        return c / 2 * (Math.sqrt(1 - t * t) + 1) + b;
    };
    Easing.easeInElastic = function (t, b, c, d) {
        var s = 1.70158, p = 0, a = c;
        if (t === 0)
            return b;
        if ((t /= d) === 1)
            return b + c;
        if (!p)
            p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else
            s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    };
    Easing.easeOutElastic = function (t, b, c, d) {
        var s = 1.70158, p = 0, a = c;
        if (t === 0)
            return b;
        if ((t /= d) === 1)
            return b + c;
        if (!p)
            p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else
            s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    };
    Easing.easeInOutElastic = function (t, b, c, d) {
        var s = 1.70158, p = 0, a = c;
        if (t === 0)
            return b;
        if ((t /= d / 2) === 2)
            return b + c;
        if (!p)
            p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else
            s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1)
            return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    };
    Easing.easeInBack = function (t, b, c, d) {
        var s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    };
    Easing.easeOutBack = function (t, b, c, d) {
        var s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    };
    Easing.easeInOutBack = function (t, b, c, d) {
        var s = 1.70158;
        if ((t /= d / 2) < 1)
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    };
    Easing.easeInBounce = function (t, b, c, d) {
        return c - Easing.easeOutBounce(d - t, 0, c, d) + b;
    };
    Easing.easeOutBounce = function (t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        }
        else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        }
        else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        }
        else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    };
    Easing.easeInOutBounce = function (t, b, c, d) {
        if (t < d / 2)
            return Easing.easeInBounce(t * 2, 0, c, d) * .5 + b;
        else
            return Easing.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    };
    return Easing;
}());
exports.Easing = Easing;


/***/ }),
/* 44 */
/***/ (function(module, exports) {

window.requestAnimationFrame =
    window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (f) { setTimeout(f, 17); };
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) { return clearTimeout(id); };
}


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var debugError_1 = __webpack_require__(0);
var pointLight_1 = __webpack_require__(46);
var LightArray = (function () {
    function LightArray(game) {
        if ( true && !game)
            throw new debugError_1.DebugError("game instance is not passed to LightArray constructor");
        this.lights = new Array(LightArray.NUM_OF_LIGHT_IN_VIEW);
        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i] = new pointLight_1.PointLight(game);
        }
    }
    LightArray.prototype.getLightAt = function (i) {
        return this.lights[i];
    };
    LightArray.prototype.setUniforms = function (uniform) {
        for (var i = 0; i < this.lights.length; i++) {
            var p = this.lights[i];
            p.setUniforms(uniform, i);
        }
    };
    LightArray.NUM_OF_LIGHT_IN_VIEW = 4;
    return LightArray;
}());
exports.LightArray = LightArray;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var point2d_1 = __webpack_require__(2);
var abstractLight_1 = __webpack_require__(24);
var PointLight = (function (_super) {
    tslib_1.__extends(PointLight, _super);
    function PointLight(game) {
        var _this = _super.call(this, game) || this;
        _this.pos = new point2d_1.Point2d();
        _this.nearRadius = 0;
        _this.farRadius = 0;
        _this.isOn = false;
        _this._screenPoint = new point2d_1.Point2d();
        return _this;
    }
    PointLight.prototype.getPosScaled = function () {
        var camera = this.game.camera;
        var rect = camera.getRectScaled();
        var scale = camera.scale;
        this._screenPoint.setXY((this.pos.x - rect.point.x) * scale.x, (this.pos.y - rect.point.y) * scale.y);
        return this._screenPoint;
    };
    PointLight.prototype.setUniforms = function (uniform, i) {
        uniform["u_pointLights[" + i + "].pos"] = this.getPosScaled().toArray();
        uniform["u_pointLights[" + i + "].nearRadius"] = this.nearRadius;
        uniform["u_pointLights[" + i + "].farRadius"] = this.farRadius;
        uniform["u_pointLights[" + i + "].isOn"] = this.isOn;
        uniform["u_pointLights[" + i + "].color"] = this.color.asGL();
    };
    return PointLight;
}(abstractLight_1.AbstractLight));
exports.PointLight = PointLight;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var rigidShapes_1 = __webpack_require__(23);
var mathEx_1 = __webpack_require__(8);
var ColliderEngine = (function () {
    function ColliderEngine(game) {
        this.relaxationCount = 15;
        this.posCorrectionRate = 0.8;
        this.game = game;
    }
    ColliderEngine.prototype.positionalCorrection = function (s1, s2, collisionInfo) {
        var s1InvMass = s1.mInvMass;
        var s2InvMass = s2.mInvMass;
        var num = collisionInfo.getDepth() / (s1InvMass + s2InvMass) * this.posCorrectionRate;
        var correctionAmount = collisionInfo.getNormal().scale(num);
        s1.move(correctionAmount.scale(-s1InvMass));
        s2.move(correctionAmount.scale(s2InvMass));
    };
    ColliderEngine.prototype.resolveCollision = function (s1, s2, collisionInfo) {
        if ((s1.mInvMass === 0) && (s2.mInvMass === 0)) {
            return;
        }
        this.positionalCorrection(s1, s2, collisionInfo);
        var n = collisionInfo.getNormal();
        var start = collisionInfo.mStart.scale(s2.mInvMass / (s1.mInvMass + s2.mInvMass));
        var end = collisionInfo.mEnd.scale(s1.mInvMass / (s1.mInvMass + s2.mInvMass));
        var p = start.add(end);
        var r1 = p.subtract(s1.mCenter);
        var r2 = p.subtract(s2.mCenter);
        var v1 = s1.mVelocity.add(new rigidShapes_1.Vec2(-1 * s1.mAngularVelocity * r1.y, s1.mAngularVelocity * r1.x));
        var v2 = s2.mVelocity.add(new rigidShapes_1.Vec2(-1 * s2.mAngularVelocity * r2.y, s2.mAngularVelocity * r2.x));
        var relativeVelocity = v2.subtract(v1);
        var rVelocityInNormal = relativeVelocity.dot(n);
        if (rVelocityInNormal > 0) {
            return;
        }
        var newRestituion = Math.min(s1.mRestitution, s2.mRestitution);
        var newFriction = Math.min(s1.mFriction, s2.mFriction);
        var R1crossN = r1.cross(n);
        var R2crossN = r2.cross(n);
        var jN = -(1 + newRestituion) * rVelocityInNormal;
        jN = jN / (s1.mInvMass + s2.mInvMass +
            R1crossN * R1crossN * s1.mInertia +
            R2crossN * R2crossN * s2.mInertia);
        var impulse = n.scale(jN);
        s1.mVelocity = s1.mVelocity.subtract(impulse.scale(s1.mInvMass));
        s2.mVelocity = s2.mVelocity.add(impulse.scale(s2.mInvMass));
        if (!s1.fixedAngle)
            s1.mAngularVelocity -= R1crossN * jN * s1.mInertia;
        if (!s2.fixedAngle)
            s2.mAngularVelocity += R2crossN * jN * s2.mInertia;
        var tangent = relativeVelocity.subtract(n.scale(relativeVelocity.dot(n)));
        tangent = tangent.normalize().scale(-1);
        var R1crossT = r1.cross(tangent);
        var R2crossT = r2.cross(tangent);
        var jT = -(1 + newRestituion) * relativeVelocity.dot(tangent) * newFriction;
        jT = jT / (s1.mInvMass + s2.mInvMass + R1crossT * R1crossT * s1.mInertia + R2crossT * R2crossT * s2.mInertia);
        if (jT > jN) {
            jT = jN;
        }
        impulse = tangent.scale(jT);
        s1.mVelocity = s1.mVelocity.subtract(impulse.scale(s1.mInvMass));
        s2.mVelocity = s2.mVelocity.add(impulse.scale(s2.mInvMass));
        if (!s1.fixedAngle)
            s1.mAngularVelocity -= R1crossT * jT * s1.mInertia;
        if (!s2.fixedAngle)
            s2.mAngularVelocity += R2crossT * jT * s2.mInertia;
    };
    ColliderEngine.prototype.boundAndCollide = function (a, b, collisionInfo) {
    };
    ColliderEngine.prototype.collision = function () {
    };
    ColliderEngine.prototype.isIntersect = function (arr1, arr2) {
        if (arr1 === void 0) { arr1 = []; }
        if (arr2 === void 0) { arr2 = []; }
        return arr1.filter(function (value) { return arr2.indexOf(value) !== -1; }).length > 0;
    };
    ColliderEngine.prototype.boundAndCollideAcrade = function (a, b) {
        if (a.velocity.equal(0) && b.velocity.equal(0))
            return;
        var numOfIterations = 0;
        var isOverlapped = mathEx_1.MathEx.overlapTest(a.getRect(), b.getRect());
        if (!isOverlapped)
            return;
        if (!a.rigidBody || !b.rigidBody) {
            a.trigger('overlap', b);
            b.trigger('overlap', a);
            return;
        }
        while (isOverlapped) {
            if (numOfIterations > 3)
                break;
            var dt = 0.01;
            a.pos.x += -a.velocity.x * dt;
            a.pos.y += -a.velocity.y * dt;
            b.pos.x += -b.velocity.x * dt;
            b.pos.y += -b.velocity.y * dt;
            isOverlapped = mathEx_1.MathEx.overlapTest(a.getRect(), b.getRect());
            numOfIterations++;
        }
        a.trigger('collide', b);
        b.trigger('collide', a);
    };
    ColliderEngine.prototype.collisionArcade = function () {
        var rigidObjects = this.game.getCurrScene().getAllGameObjects();
        for (var i = 0; i < rigidObjects.length; i++) {
            for (var j = i + 1; j < rigidObjects.length; j++) {
                var a = rigidObjects[i], b = rigidObjects[j];
                if (this.isIntersect(a.collideWith, b.groupNames) ||
                    this.isIntersect(b.collideWith, a.groupNames)) {
                    this.boundAndCollideAcrade(a, b);
                }
            }
        }
    };
    return ColliderEngine;
}());
exports.ColliderEngine = ColliderEngine;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Queue = (function () {
    function Queue() {
        this.tasksResolved = 0;
        this.tasks = [];
        this.tasksProgressById = {};
        this.completed = false;
    }
    Queue.prototype.size = function () {
        return this.tasks.length;
    };
    Queue.prototype.progressTask = function (taskId, progress) {
        this.tasksProgressById[taskId] = progress;
        this.onProgress && this.onProgress(this.calcProgress());
    };
    ;
    Queue.prototype.resolveTask = function (taskId) {
        this.tasksResolved++;
        this.tasksProgressById[taskId] = 1;
        if (this.tasks.length === this.tasksResolved) {
            this.onProgress && this.onProgress(1);
            this.completed = true;
            if (this.onResolved)
                this.onResolved();
        }
        else {
            this.onProgress && this.onProgress(this.calcProgress());
        }
    };
    ;
    Queue.prototype.addTask = function (taskFn, taskId) {
        if (this.tasksProgressById[taskId] !== undefined)
            return;
        this.tasks.push(taskFn);
        this.tasksProgressById[taskId] = 0;
    };
    ;
    Queue.prototype.isCompleted = function () {
        return this.completed;
    };
    Queue.prototype.calcProgress = function () {
        var _this = this;
        var sum = 0;
        Object.keys(this.tasksProgressById).forEach(function (taskId) {
            sum += _this.tasksProgressById[taskId] || 0;
        });
        return sum / this.tasks.length;
    };
    Queue.prototype.start = function () {
        if (this.size() === 0) {
            this.completed = true;
            this.onResolved && this.onResolved();
        }
        this.tasks.forEach(function (t) {
            t && t();
        });
    };
    return Queue;
}());
exports.Queue = Queue;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var incrementer_1 = __webpack_require__(36);
var ResourceLink = (function () {
    function ResourceLink(id) {
        this.id = id;
    }
    ResourceLink.prototype.getId = function () {
        return this.id;
    };
    ResourceLink.prototype.setTarget = function (t) {
        this.target = t;
    };
    ResourceLink.prototype.getTarget = function () {
        return this.target;
    };
    ResourceLink.create = function () {
        return new ResourceLink((incrementer_1.Incrementer.getValue()).toString());
    };
    return ResourceLink;
}());
exports.ResourceLink = ResourceLink;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var debugError_1 = __webpack_require__(0);
var abstractDrawer_1 = __webpack_require__(12);
var shapeDrawer_1 = __webpack_require__(51);
var frameBuffer_1 = __webpack_require__(31);
var matrixStack_1 = __webpack_require__(55);
var texture_1 = __webpack_require__(32);
var rect_1 = __webpack_require__(3);
var abstractCanvasRenderer_1 = __webpack_require__(56);
var size_1 = __webpack_require__(4);
var modelDrawer_1 = __webpack_require__(61);
var mat4_1 = __webpack_require__(11);
var shapeDrawer_shader_1 = __webpack_require__(30);
var SimpleRectDrawer_1 = __webpack_require__(38);
var doubleFrameBuffer_1 = __webpack_require__(63);
var IDENTITY = mat4_1.mat4.IDENTITY;
var getCtx = function (el) {
    return (el.getContext("webgl", { alpha: false }) ||
        el.getContext('experimental-webgl', { alpha: false }) ||
        el.getContext('webkit-3d', { alpha: false }) ||
        el.getContext('moz-webgl', { alpha: false }));
};
var SCENE_DEPTH = 1000;
var FLIP_TEXTURE_MATRIX = new matrixStack_1.MatrixStack().translate(0, 1).scale(1, -1).getCurrentMatrix();
var FLIP_POSITION_MATRIX;
var makePositionMatrix = function (rect, viewSize, matrixStack) {
    var zToWMatrix = mat4_1.mat4.makeZToWMatrix(1);
    var projectionMatrix = mat4_1.mat4.ortho(0, viewSize.width, 0, viewSize.height, -SCENE_DEPTH, SCENE_DEPTH);
    var scaleMatrix = mat4_1.mat4.makeScale(rect.size.width, rect.size.height, 1);
    var translationMatrix = mat4_1.mat4.makeTranslation(rect.point.x, rect.point.y, 0);
    var matrix = mat4_1.mat4.matrixMultiply(scaleMatrix, translationMatrix);
    matrix = mat4_1.mat4.matrixMultiply(matrix, matrixStack.getCurrentMatrix());
    matrix = mat4_1.mat4.matrixMultiply(matrix, projectionMatrix);
    matrix = mat4_1.mat4.matrixMultiply(matrix, zToWMatrix);
    return matrix;
};
var WebGlRenderer = (function (_super) {
    tslib_1.__extends(WebGlRenderer, _super);
    function WebGlRenderer(game) {
        var _this = _super.call(this, game) || this;
        _this.matrixStack = new matrixStack_1.MatrixStack();
        _this.registerResize();
        _this._init();
        FLIP_POSITION_MATRIX = mat4_1.mat4.matrixMultiply(mat4_1.mat4.makeScale(_this.game.width, _this.game.height, 1), mat4_1.mat4.ortho(0, _this.game.width, 0, _this.game.height, -1, 1));
        return _this;
    }
    WebGlRenderer.prototype._init = function () {
        var gl = getCtx(this.container);
        this.gl = gl;
        this.nullTexture = new texture_1.Texture(gl);
        this.shapeDrawer = new shapeDrawer_1.ShapeDrawer(gl);
        this.simpleRectDrawer = new SimpleRectDrawer_1.SimpleRectDrawer(gl);
        this.simpleRectDrawer.prepareShaderGenerator();
        this.simpleRectDrawer.initProgram();
        this.modelDrawer = new modelDrawer_1.ModelDrawer(gl);
        this.preprocessFrameBuffer = new frameBuffer_1.FrameBuffer(gl, this.game.width, this.game.height);
        this.finalFrameBuffer = new frameBuffer_1.FrameBuffer(gl, this.game.width, this.game.height);
        this.doubleFrameBuffer = new doubleFrameBuffer_1.DoubleFrameBuffer(gl, this.game.width, this.game.height);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
    };
    WebGlRenderer.prototype.prepareShapeUniformInfo = function (shape) {
        var rw = shape.getRect().size.width;
        var rh = shape.getRect().size.height;
        var maxSize = Math.max(rw, rh);
        var offsetX = 0, offsetY = 0;
        var sd = this.shapeDrawer;
        if (maxSize === rw) {
            sd.setUniform(sd.u_width, 1);
            sd.setUniform(sd.u_height, rh / rw);
            offsetY = (maxSize - rh) / 2;
            sd.setUniform(sd.u_rectOffsetLeft, 0);
            sd.setUniform(sd.u_rectOffsetTop, offsetY / maxSize);
        }
        else {
            sd.setUniform(sd.u_height, 1);
            sd.setUniform(sd.u_width, rw / rh);
            offsetX = (maxSize - rw) / 2;
            sd.setUniform(sd.u_rectOffsetLeft, offsetX / maxSize);
            sd.setUniform(sd.u_rectOffsetTop, 0);
        }
        var rect = rect_1.Rect.fromPool();
        rect.setXYWH(-offsetX, -offsetY, maxSize, maxSize);
        var size = size_1.Size.fromPool();
        size.setWH(this.game.width, this.game.height);
        sd.setUniform(sd.u_vertexMatrix, makePositionMatrix(rect, size, this.matrixStack));
        rect.release();
        size.release();
        sd.setUniform(sd.u_lineWidth, Math.min(shape.lineWidth / maxSize, 1));
        sd.setUniform(sd.u_color, shape.color.asGL());
        sd.setUniform(sd.u_alpha, shape.alpha);
        if (shape.fillColor.type == 'LinearGradient') {
            sd.setUniform(sd.u_fillLinearGradient, shape.fillColor.asGL());
            sd.setUniform(sd.u_fillType, shapeDrawer_shader_1.FILL_TYPE.LINEAR_GRADIENT);
        }
        else if (shape.fillColor.type == 'Color') {
            sd.setUniform(sd.u_fillColor, shape.fillColor.asGL());
            sd.setUniform(sd.u_fillType, shapeDrawer_shader_1.FILL_TYPE.COLOR);
        }
    };
    WebGlRenderer.prototype.drawImage = function (img) {
        if (true) {
            if (!img.getResourceLink()) {
                throw new debugError_1.DebugError("image resource link is not set");
            }
            if (!this.renderableCache[img.getResourceLink().getId()]) {
                throw new debugError_1.DebugError("can not find texture with resource link id " + img.getResourceLink().getId());
            }
        }
        this.beforeItemDraw(img.filters.length);
        var texture = this.renderableCache[img.getResourceLink().getId()].texture;
        var texInfo = [{ texture: texture, name: 'texture' }];
        var maxSize = Math.max(img.size.width, img.size.height);
        var sd = this.shapeDrawer;
        this.prepareShapeUniformInfo(img);
        sd.setUniform(sd.u_borderRadius, Math.min(img.borderRadius / maxSize, 1));
        sd.setUniform(sd.u_shapeType, shapeDrawer_shader_1.SHAPE_TYPE.RECT);
        sd.setUniform(sd.u_fillType, shapeDrawer_shader_1.FILL_TYPE.TEXTURE);
        var _a = texture.getSize(), texWidth = _a.width, texHeight = _a.height;
        var _b = img.srcRect.point, srcRectX = _b.x, srcRectY = _b.y;
        var _c = img.srcRect.size, srcRectWidth = _c.width, srcRectHeight = _c.height;
        sd.setUniform(sd.u_texRect, [
            srcRectX / texWidth,
            srcRectY / texHeight,
            srcRectWidth / texWidth,
            srcRectHeight / texHeight
        ]);
        sd.setUniform(sd.u_texOffset, [img.offset.x / maxSize, img.offset.y / maxSize]);
        this.shapeDrawer.draw(texInfo);
        this.afterItemDraw(img.filters);
    };
    WebGlRenderer.prototype.drawModel = function (g3d) {
        this.modelDrawer.bindModel(g3d);
        this.modelDrawer.bind();
        this.matrixStack.scale(1, -1, 1);
        var matrix1 = this.matrixStack.getCurrentMatrix();
        var zToWMatrix = mat4_1.mat4.makeZToWMatrix(1);
        var projectionMatrix = mat4_1.mat4.ortho(0, this.game.width, 0, this.game.height, -SCENE_DEPTH, SCENE_DEPTH);
        var matrix2 = mat4_1.mat4.matrixMultiply(projectionMatrix, zToWMatrix);
        var uniforms = {
            u_modelMatrix: matrix1,
            u_projectionMatrix: matrix2,
            u_alpha: 1
        };
        var texInfo = [{ texture: g3d.texture, name: 'u_texture' }];
        this.gl.enable(this.gl.DEPTH_TEST);
        this.modelDrawer.draw(texInfo);
        this.modelDrawer.unbind();
        this.gl.disable(this.gl.DEPTH_TEST);
    };
    ;
    WebGlRenderer.prototype.drawRectangle = function (rectangle) {
        var _a = rectangle.size, rw = _a.width, rh = _a.height;
        var maxSize = Math.max(rw, rh);
        var sd = this.shapeDrawer;
        this.beforeItemDraw(rectangle.filters.length);
        this.prepareShapeUniformInfo(rectangle);
        sd.setUniform(sd.u_borderRadius, Math.min(rectangle.borderRadius / maxSize, 1));
        sd.setUniform(sd.u_shapeType, shapeDrawer_shader_1.SHAPE_TYPE.RECT);
        var texInfo = [{ texture: this.nullTexture, name: 'texture' }];
        sd.draw(texInfo);
        this.afterItemDraw(rectangle.filters);
    };
    WebGlRenderer.prototype.drawLine = function (x1, y1, x2, y2, color) {
        this.beforeItemDraw(0);
        var dx = x2 - x1, dy = y2 - y1;
        var uniforms = {};
        var rect = rect_1.Rect.fromPool();
        rect.setXYWH(x1, y1, dx, dy);
        var size = size_1.Size.fromPool();
        size.setWH(this.game.width, this.game.height);
        uniforms.u_vertexMatrix = makePositionMatrix(rect, size, this.matrixStack);
        rect.release();
        size.release();
        uniforms.u_rgba = color.asGL();
        this.afterItemDraw([]);
    };
    WebGlRenderer.prototype.drawEllipse = function (ellipse) {
        var maxR = Math.max(ellipse.radiusX, ellipse.radiusY);
        var maxR2 = maxR * 2;
        this.beforeItemDraw(ellipse.filters.length);
        this.prepareShapeUniformInfo(ellipse);
        var sd = this.shapeDrawer;
        var rect = rect_1.Rect.fromPool();
        rect.setXYWH(0, 0, maxR2, maxR2);
        var size = size_1.Size.fromPool();
        size.setWH(this.game.width, this.game.height);
        sd.setUniform(sd.u_vertexMatrix, makePositionMatrix(rect, size, this.matrixStack));
        rect.release();
        size.release();
        sd.setUniform(sd.u_lineWidth, Math.min(ellipse.lineWidth / maxR, 1));
        if (maxR === ellipse.radiusX) {
            sd.setUniform(sd.u_rx, 0.5);
            sd.setUniform(sd.u_ry, ellipse.radiusY / ellipse.radiusX * 0.5);
        }
        else {
            sd.setUniform(sd.u_ry, 0.5);
            sd.setUniform(sd.u_rx, ellipse.radiusX / ellipse.radiusY * 0.5);
        }
        sd.setUniform(sd.u_shapeType, shapeDrawer_shader_1.SHAPE_TYPE.ELLIPSE);
        sd.setUniform(sd.u_width, 1);
        sd.setUniform(sd.u_height, 1);
        sd.setUniform(sd.u_rectOffsetLeft, 1);
        sd.setUniform(sd.u_rectOffsetTop, 1);
        var texInfo = [{ texture: this.nullTexture, name: 'texture' }];
        this.shapeDrawer.draw(texInfo);
        this.afterItemDraw(ellipse.filters);
    };
    WebGlRenderer.prototype.setAlpha = function (a) {
        if (true)
            throw new debugError_1.DebugError('not implemented');
    };
    WebGlRenderer.prototype.save = function () {
        this.matrixStack.save();
    };
    WebGlRenderer.prototype.scale = function (x, y) {
        this.matrixStack.scale(x, y);
    };
    WebGlRenderer.prototype.resetTransform = function () {
        this.matrixStack.resetTransform();
    };
    WebGlRenderer.prototype.rotateZ = function (angleInRadians) {
        this.matrixStack.rotateZ(angleInRadians);
    };
    WebGlRenderer.prototype.rotateY = function (angleInRadians) {
        this.matrixStack.rotateY(angleInRadians);
    };
    WebGlRenderer.prototype.translate = function (x, y) {
        this.matrixStack.translate(x, y);
    };
    WebGlRenderer.prototype.restore = function () {
        this.matrixStack.restore();
    };
    WebGlRenderer.prototype.lockRect = function (rect) {
        this.gl.enable(this.gl.SCISSOR_TEST);
        this.gl.scissor(rect.point.x, rect.point.y, rect.size.width, rect.size.height);
    };
    WebGlRenderer.prototype.unlockRect = function () {
        this.gl.disable(this.gl.SCISSOR_TEST);
    };
    WebGlRenderer.prototype.clear = function () {
        this.gl.clearColor(1, 1, 1, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    };
    WebGlRenderer.prototype.clearColor = function (color) {
        var arr = color.asGL();
        this.gl.clearColor(arr[0], arr[1], arr[2], arr[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    };
    WebGlRenderer.prototype.beginFrameBuffer = function () {
        this.save();
        this.finalFrameBuffer.bind();
    };
    WebGlRenderer.prototype.flipFrameBuffer = function (filters) {
        var texToDraw = this.doubleFrameBuffer.applyFilters(this.finalFrameBuffer.getTexture(), filters);
        this.finalFrameBuffer.unbind();
        this.gl.viewport(0, 0, this.fullScreenSize.width, this.fullScreenSize.height);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix, FLIP_TEXTURE_MATRIX);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix, FLIP_POSITION_MATRIX);
        this.simpleRectDrawer.draw([{ texture: texToDraw, name: 'texture' }]);
        this.restore();
    };
    ;
    WebGlRenderer.prototype.beforeItemDraw = function (numOfFilters) {
        if (numOfFilters > 0) {
            this.preprocessFrameBuffer.bind();
            this.gl.clearColor(1, 1, 1, 0);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        }
        else {
            this.finalFrameBuffer.bind();
        }
    };
    WebGlRenderer.prototype.afterItemDraw = function (filters) {
        if (filters.length > 0) {
            var filteredTexture = this.doubleFrameBuffer.applyFilters(this.preprocessFrameBuffer.getTexture(), filters);
            this.finalFrameBuffer.bind();
            this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix, IDENTITY);
            this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix, FLIP_POSITION_MATRIX);
            this.simpleRectDrawer.draw([{ texture: filteredTexture, name: 'texture' }]);
        }
    };
    WebGlRenderer.prototype.getError = function () {
        if (false)
            {}
        var err = this.gl.getError();
        err = err === this.gl.NO_ERROR ? 0 : err;
        if (err) {
            console.log(abstractDrawer_1.AbstractDrawer.currentInstance);
        }
        return err;
    };
    WebGlRenderer.prototype.loadTextureInfo = function (url, link, onLoad) {
        var _this = this;
        if (this.renderableCache[link.getId()]) {
            onLoad();
            return;
        }
        var img = new window.Image();
        img.src = url;
        img.onload = function () {
            var texture = new texture_1.Texture(_this.gl);
            texture.setImage(img);
            _this.gl.bindTexture(_this.gl.TEXTURE_2D, _this.finalFrameBuffer.getTexture().getGlTexture());
            var ti = { texture: texture, size: texture.size, name: undefined };
            _this.renderableCache[link.getId()] = ti;
            link.setTarget(ti);
            onLoad();
        };
        if (true) {
            img.onerror = function () {
                throw new debugError_1.DebugError("Resource loading error: can not load resource with url \"" + url + "\"");
            };
        }
    };
    WebGlRenderer.prototype.getNativeContext = function () {
        return this.gl;
    };
    WebGlRenderer.prototype.destroy = function () {
        var _this = this;
        _super.prototype.destroy.call(this);
        this.finalFrameBuffer.destroy();
        this.preprocessFrameBuffer.destroy();
        this.doubleFrameBuffer.destroy();
        this.nullTexture.destroy();
        this.shapeDrawer.destroy();
        this.simpleRectDrawer.destroy();
        Object.keys(this.renderableCache).forEach(function (key) {
            var t = _this.renderableCache[key].texture;
            t.destroy();
        });
    };
    return WebGlRenderer;
}(abstractCanvasRenderer_1.AbstractCanvasRenderer));
exports.WebGlRenderer = WebGlRenderer;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var shaderProgram_1 = __webpack_require__(16);
var abstractDrawer_1 = __webpack_require__(12);
var bufferInfo_1 = __webpack_require__(17);
var plane_1 = __webpack_require__(28);
var shaderProgramUtils_1 = __webpack_require__(7);
var shaderGenerator_1 = __webpack_require__(29);
var shapeDrawer_shader_1 = __webpack_require__(30);
var ShapeDrawer = (function (_super) {
    tslib_1.__extends(ShapeDrawer, _super);
    function ShapeDrawer(gl) {
        var _this = _super.call(this, gl) || this;
        var gen = new shaderGenerator_1.ShaderGenerator();
        gen.setVertexMainFn("\n            void main(){\n                v_position = a_position;\n                gl_Position = u_vertexMatrix * a_position;   \n            }\n        ");
        _this.u_vertexMatrix = gen.addVertexUniform(shaderProgramUtils_1.GL_TYPE.FLOAT_MAT4, 'u_vertexMatrix');
        _this.a_position = gen.addAttribute(shaderProgramUtils_1.GL_TYPE.FLOAT_VEC4, 'a_position');
        gen.addVarying(shaderProgramUtils_1.GL_TYPE.FLOAT_VEC4, 'v_position');
        _this.u_lineWidth = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.FLOAT, 'u_lineWidth');
        _this.u_rx = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.FLOAT, 'u_rx');
        _this.u_ry = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.FLOAT, 'u_ry');
        _this.u_width = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.FLOAT, 'u_width');
        _this.u_height = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.FLOAT, 'u_height');
        _this.u_rectOffsetTop = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.FLOAT, 'u_rectOffsetTop');
        _this.u_rectOffsetLeft = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.FLOAT, 'u_rectOffsetLeft');
        _this.u_borderRadius = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.FLOAT, 'u_borderRadius');
        _this.u_color = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.FLOAT_VEC4, 'u_color');
        _this.u_alpha = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.FLOAT, 'u_alpha');
        _this.u_fillColor = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.FLOAT_VEC4, 'u_fillColor');
        _this.u_fillLinearGradient = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.FLOAT_VEC4, 'u_fillLinearGradient[3]');
        _this.u_texRect = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.FLOAT_VEC4, 'u_texRect');
        _this.u_texOffset = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.FLOAT_VEC2, 'u_texOffset');
        gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.SAMPLER_2D, 'texture');
        _this.u_shapeType = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.INT, 'u_shapeType');
        _this.u_fillType = gen.addFragmentUniform(shaderProgramUtils_1.GL_TYPE.INT, 'u_fillType');
        gen.setFragmentMainFn(shapeDrawer_shader_1.fragmentSource);
        _this.program = new shaderProgram_1.ShaderProgram(gl, gen.getVertexSource(), gen.getFragmentSource());
        _this.primitive = new plane_1.Plane();
        _this.bufferInfo = new bufferInfo_1.BufferInfo(gl, {
            posVertexInfo: { array: _this.primitive.vertexArr, type: gl.FLOAT, size: 2, attrName: _this.a_position },
            posIndexInfo: { array: _this.primitive.indexArr },
            drawMethod: _this.gl.TRIANGLE_STRIP
        });
        return _this;
    }
    return ShapeDrawer;
}(abstractDrawer_1.AbstractDrawer));
exports.ShapeDrawer = ShapeDrawer;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var debugError_1 = __webpack_require__(0);
var VertexBuffer = (function () {
    function VertexBuffer(gl) {
        this.bufferItemSize = 0;
        this.bufferItemType = 0;
        this.dataLength = 0;
        if ( true && !gl)
            throw new debugError_1.DebugError("can not create VertexBuffer, gl context not passed to constructor, expected: VertexBuffer(gl)");
        this.gl = gl;
        this.buffer = gl.createBuffer();
        if ( true && !this.buffer)
            throw new debugError_1.DebugError("can not allocate memory for vertex buffer");
    }
    VertexBuffer.prototype.setData = function (bufferData, itemType, itemSize) {
        if (true) {
            if (!bufferData)
                throw new debugError_1.DebugError('can not set data to buffer: bufferData not specified');
            if (!itemType)
                throw new debugError_1.DebugError('can not set data to buffer: itemType not specified');
            if (!itemSize)
                throw new debugError_1.DebugError('can not set data to buffer: itemSize not specified');
        }
        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.bufferItemSize = itemSize;
        this.bufferItemType = itemType;
        this.dataLength = bufferData.length;
    };
    VertexBuffer.prototype.setAttrName = function (attrName) {
        if ( true && !attrName)
            throw new debugError_1.DebugError("attrName not provided");
        this.attrName = attrName;
    };
    VertexBuffer.prototype.bind = function (program) {
        if ( true && !program)
            throw new debugError_1.DebugError("can not bind VertexBuffer, program not specified");
        if ( true && !this.attrName)
            throw new debugError_1.DebugError("can not bind VertexBuffer, attribute name not specified");
        program.bindBuffer(this, this.attrName);
    };
    VertexBuffer.prototype.unbind = function () {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    };
    VertexBuffer.prototype.destroy = function () {
        this.gl.deleteBuffer(this.buffer);
    };
    VertexBuffer.prototype.getGlBuffer = function () {
        return this.buffer;
    };
    VertexBuffer.prototype.getItemSize = function () {
        return this.bufferItemSize;
    };
    VertexBuffer.prototype.getItemType = function () {
        return this.bufferItemType;
    };
    VertexBuffer.prototype.getBufferLength = function () {
        return this.dataLength;
    };
    return VertexBuffer;
}());
exports.VertexBuffer = VertexBuffer;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var debugError_1 = __webpack_require__(0);
var IndexBuffer = (function () {
    function IndexBuffer(gl) {
        if ( true && !gl)
            throw new debugError_1.DebugError("can not create IndexBuffer, gl context not passed to constructor, expected: IndexBuffer(gl)");
        this.gl = gl;
        this.buffer = gl.createBuffer();
        if ( true && !this.buffer)
            throw new debugError_1.DebugError("can not allocate memory for index buffer");
        this.dataLength = null;
    }
    IndexBuffer.prototype.setData = function (bufferData) {
        if (true) {
            if (!bufferData)
                throw new debugError_1.DebugError('can not set data to buffer: bufferData not specified');
        }
        var gl = this.gl;
        this.dataLength = bufferData.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bufferData), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    };
    IndexBuffer.prototype.getGlBuffer = function () {
        return this.buffer;
    };
    IndexBuffer.prototype.bind = function () {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    };
    IndexBuffer.prototype.unbind = function () {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    };
    IndexBuffer.prototype.destroy = function () {
        this.gl.deleteBuffer(this.buffer);
    };
    IndexBuffer.prototype.getBufferLength = function () {
        return this.dataLength;
    };
    return IndexBuffer;
}());
exports.IndexBuffer = IndexBuffer;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AbstractPrimitive = (function () {
    function AbstractPrimitive() {
    }
    return AbstractPrimitive;
}());
exports.AbstractPrimitive = AbstractPrimitive;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mat4_1 = __webpack_require__(11);
var MatrixStack = (function () {
    function MatrixStack() {
        this.stack = [];
        this.restore();
    }
    MatrixStack.prototype.restore = function () {
        this.stack.pop();
        if (this.stack.length < 1) {
            this.stack[0] = mat4_1.mat4.makeIdentity();
        }
    };
    MatrixStack.prototype.save = function () {
        this.stack.push(this.getCurrentMatrix());
    };
    MatrixStack.prototype.getCurrentMatrix = function () {
        return this.stack[this.stack.length - 1].slice();
    };
    MatrixStack.prototype.setCurrentMatrix = function (m) {
        return this.stack[this.stack.length - 1] = m;
    };
    MatrixStack.prototype.translate = function (x, y, z) {
        if (z === void 0) { z = 0; }
        var t = mat4_1.mat4.makeTranslation(x, y, z);
        var m = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4_1.mat4.matrixMultiply(t, m));
        return this;
    };
    MatrixStack.prototype.rotateZ = function (angleInRadians) {
        var t = mat4_1.mat4.makeZRotation(angleInRadians);
        var m = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4_1.mat4.matrixMultiply(t, m));
        return this;
    };
    MatrixStack.prototype.rotateY = function (angleInRadians) {
        var t = mat4_1.mat4.makeYRotation(angleInRadians);
        var m = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4_1.mat4.matrixMultiply(t, m));
        return this;
    };
    MatrixStack.prototype.scale = function (x, y, z) {
        if (z === void 0) { z = 0; }
        if (z === undefined) {
            z = 1;
        }
        var t = mat4_1.mat4.makeScale(x, y, z);
        var m = this.getCurrentMatrix();
        this.setCurrentMatrix(mat4_1.mat4.matrixMultiply(t, m));
        return this;
    };
    MatrixStack.prototype.resetTransform = function () {
        var identity = mat4_1.mat4.makeIdentity();
        this.setCurrentMatrix(identity);
        return this;
    };
    return MatrixStack;
}());
exports.MatrixStack = MatrixStack;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var abstractRenderer_1 = __webpack_require__(57);
var game_1 = __webpack_require__(6);
var AbstractCanvasRenderer = (function (_super) {
    tslib_1.__extends(AbstractCanvasRenderer, _super);
    function AbstractCanvasRenderer(game) {
        var _this = _super.call(this, game) || this;
        var container = document.createElement('canvas');
        document.body.appendChild(container);
        container.setAttribute('width', game.width.toString());
        container.setAttribute('height', game.height.toString());
        container.ondragstart = function (e) {
            e.preventDefault();
        };
        _this.container = container;
        return _this;
    }
    AbstractCanvasRenderer.prototype.onResize = function () {
        var canvas = this.container;
        if (this.game.scaleStrategy === game_1.SCALE_STRATEGY.NO_SCALE)
            return;
        else if (this.game.scaleStrategy === game_1.SCALE_STRATEGY.STRETCH) {
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            return;
        }
        var canvasRatio = canvas.height / canvas.width;
        var windowRatio = window.innerHeight / window.innerWidth;
        var width;
        var height;
        if (windowRatio < canvasRatio) {
            height = window.innerHeight;
            width = height / canvasRatio;
        }
        else {
            width = window.innerWidth;
            height = width * canvasRatio;
        }
        this.game.scale.setXY(width / this.game.width, height / this.game.height);
        this.game.pos.setXY((window.innerWidth - width) / 2, (window.innerHeight - height) / 2);
        this.container.style.width = width + 'px';
        this.container.style.height = height + 'px';
        this.container.style.marginTop = this.game.pos.y + "px";
    };
    return AbstractCanvasRenderer;
}(abstractRenderer_1.AbstractRenderer));
exports.AbstractCanvasRenderer = AbstractCanvasRenderer;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var textField_1 = __webpack_require__(35);
var device_1 = __webpack_require__(60);
var size_1 = __webpack_require__(4);
var debugError_1 = __webpack_require__(0);
var font_1 = __webpack_require__(37);
var AbstractRenderer = (function () {
    function AbstractRenderer(game) {
        this.renderableCache = {};
        this.fullScreenSize = new size_1.Size(0, 0);
        this.game = game;
        if (device_1.Device.isCocoonJS) {
            var dpr = window.devicePixelRatio || 1;
            this.fullScreenSize.setW(window.innerWidth * dpr);
            this.fullScreenSize.setH(window.innerHeight * dpr);
        }
        else {
            this.fullScreenSize.setWH(this.game.width, this.game.height);
        }
    }
    AbstractRenderer.prototype.onResize = function () { };
    AbstractRenderer.prototype.requestFullScreen = function () {
        var element = this.container;
        if (element.requestFullScreen) {
            element.requestFullScreen();
        }
        else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        }
        else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    };
    AbstractRenderer.prototype.cancelFullScreen = function () {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    };
    AbstractRenderer.prototype.beginFrameBuffer = function () { };
    AbstractRenderer.prototype.flipFrameBuffer = function (filters) { };
    AbstractRenderer.prototype.registerResize = function () {
        var _this = this;
        this.onResize();
        window.addEventListener('resize', function () { return _this.onResize(); });
    };
    AbstractRenderer.prototype.destroy = function () {
        window.removeEventListener('resize', this.onResize);
    };
    AbstractRenderer.prototype.getError = function () {
        return 0;
    };
    AbstractRenderer.prototype.drawImage = function (img) { };
    AbstractRenderer.prototype.drawNinePatch = function (img) { };
    AbstractRenderer.prototype.drawTiledImage = function (texturePath, srcRect, dstRect, offset) { };
    AbstractRenderer.prototype.drawRectangle = function (rectangle) { };
    AbstractRenderer.prototype.lockRect = function (rect) { };
    AbstractRenderer.prototype.unlockRect = function () { };
    AbstractRenderer.prototype.drawLine = function (x1, y1, x2, y2, color) { };
    AbstractRenderer.prototype.drawModel = function (go) { };
    AbstractRenderer.prototype.drawEllipse = function (ellispe) { };
    AbstractRenderer.prototype.resetTransform = function () { };
    AbstractRenderer.prototype.clear = function () { };
    AbstractRenderer.prototype.clearColor = function (c) { };
    AbstractRenderer.prototype.save = function () { };
    AbstractRenderer.prototype.restore = function () { };
    AbstractRenderer.prototype.translate = function (x, y, z) {
        if (z === void 0) { z = 0; }
    };
    AbstractRenderer.prototype.scale = function (x, y, z) {
        if (z === void 0) { z = 0; }
    };
    AbstractRenderer.prototype.rotateZ = function (a) { };
    AbstractRenderer.prototype.rotateY = function (a) { };
    AbstractRenderer.prototype.log = function (args) {
        if (false)
            {}
        var textField = this.debugTextField;
        if (!textField) {
            textField = new textField_1.TextField(this.game);
            textField.setFont(font_1.Font.getSystemFont());
            textField.revalidate();
            this.debugTextField = textField;
        }
        var res = '';
        Array.prototype.slice.call(arguments).forEach(function (txt) {
            if (txt === undefined)
                txt = 'undefined';
            else if (txt === null)
                txt = 'null';
            else if (txt.toJSON) {
                txt = JSON.stringify(txt.toJSON(), null, 4);
            }
            else {
                if (typeof txt !== 'string') {
                    try {
                        txt = JSON.stringify(txt);
                    }
                    catch (e) {
                        txt = "[Object](" + e.error + ")";
                    }
                }
            }
            res += txt + "\n";
        });
        textField.pos.x = 10;
        textField.pos.y = 10;
        textField.setText(textField.getText() + res);
    };
    AbstractRenderer.prototype.clearLog = function () {
        if (false)
            {}
        if (!this.debugTextField)
            return;
        this.debugTextField.setText('');
    };
    AbstractRenderer.prototype.loadTextureInfo = function (url, link, onLoaded) { };
    AbstractRenderer.prototype.getTextureInfo = function (textureId) {
        var t = this.renderableCache[textureId];
        if (!t)
            throw new debugError_1.DebugError("can not find resource with id " + textureId);
        return t;
    };
    return AbstractRenderer;
}());
exports.AbstractRenderer = AbstractRenderer;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var container_1 = __webpack_require__(22);
var vScroll_1 = __webpack_require__(59);
var mathEx_1 = __webpack_require__(8);
var mouseEvents_1 = __webpack_require__(10);
var ScrollInfo = (function () {
    function ScrollInfo(game) {
        this.game = game;
        this._scrollVelocity = 0;
        this._deceleration = 0;
        this._enabled = false;
        this.offset = 0;
        this.scrollHeight = 0;
    }
    ScrollInfo.prototype._initScrollBar = function () {
        this.vScroll = new vScroll_1.VScroll(this.game);
        this.vScroll.size.width = 5;
        this._container.appendChild(this.vScroll);
    };
    ScrollInfo.prototype.setEnabled = function (val) {
        this._enabled = val;
        this.vScroll.enabled = val;
    };
    ScrollInfo.prototype.onScroll = function () {
        this.vScroll.maxValue = this.scrollHeight;
        this.vScroll.value = this.offset;
        this.vScroll.onGeometryChanged();
    };
    ScrollInfo.prototype.listenScroll = function (container) {
        var _this = this;
        this._container = container;
        container.on(mouseEvents_1.MOUSE_EVENTS.mouseDown, function (p) {
            _this._lastPoint = {
                point: p,
                time: Date.now()
            };
            _this._prevPoint = {
                point: _this._lastPoint.point,
                time: _this._lastPoint.time
            };
            _this._scrollVelocity = 0;
            _this._deceleration = 0;
        });
        container.on(mouseEvents_1.MOUSE_EVENTS.mouseMove, function (p) {
            if (!p.isMouseDown)
                return;
            var lastPoint = _this._lastPoint;
            _this._lastPoint = {
                point: p,
                time: Date.now()
            };
            if (!lastPoint)
                lastPoint = _this._lastPoint;
            _this._prevPoint = {
                point: lastPoint.point,
                time: lastPoint.time,
            };
            _this.offset -=
                _this._lastPoint.point.screenY - _this._prevPoint.point.screenY;
            if (_this.offset > _this.scrollHeight - _this._container.size.height)
                _this.offset = _this.scrollHeight - _this._container.size.height;
            if (_this.offset < 0)
                _this.offset = 0;
            _this.onScroll();
        });
        container.on(mouseEvents_1.MOUSE_EVENTS.scroll, function (p) {
            _this._scrollVelocity = -p.nativeEvent.wheelDelta;
            _this._deceleration = 0;
        });
        container.on(mouseEvents_1.MOUSE_EVENTS.mouseUp, function (p) {
            if (!_this._lastPoint)
                return;
            if (!_this._prevPoint)
                return;
            if (_this._lastPoint.time === _this._prevPoint.time) {
                _this._scrollVelocity = 0;
            }
            else if (Date.now() - _this._lastPoint.time > 100) {
                _this._scrollVelocity = 0;
            }
            else {
                _this._scrollVelocity = 1000 *
                    (_this._prevPoint.point.screenY - _this._lastPoint.point.screenY) /
                    (_this._lastPoint.time - _this._prevPoint.time);
            }
            _this._deceleration = 0;
        });
        this._initScrollBar();
    };
    ScrollInfo.prototype._scrollBy = function (val) {
        this.offset += val;
        if (this.offset > this.scrollHeight - this._container.size.height) {
            this.offset = this.scrollHeight - this._container.size.height;
            this._scrollVelocity = 0;
            this._deceleration = 0;
        }
        if (this.offset < 0) {
            this.offset = 0;
            this._scrollVelocity = 0;
            this._deceleration = 0;
        }
        this.onScroll();
    };
    ScrollInfo.prototype.update = function () {
        if (!this._enabled)
            return;
        if (this._scrollVelocity)
            this.onScroll();
        var delta = this.game.getDeltaTime();
        if (this._scrollVelocity) {
            this._scrollBy(this._scrollVelocity * delta / 1000);
        }
        this._deceleration = this._deceleration + 0.5 / delta;
        if (delta > 1000) {
            this._scrollVelocity = 0;
            this._deceleration = 0;
        }
        if (this._scrollVelocity > 0)
            this._scrollVelocity -= this._deceleration;
        else if (this._scrollVelocity < 0)
            this._scrollVelocity += this._deceleration;
        if (mathEx_1.MathEx.closeTo(this._scrollVelocity, 0, 3)) {
            this._scrollVelocity = 0;
            this._deceleration = 0;
        }
    };
    return ScrollInfo;
}());
exports.ScrollInfo = ScrollInfo;
var ScrollableContainer = (function (_super) {
    tslib_1.__extends(ScrollableContainer, _super);
    function ScrollableContainer(game) {
        return _super.call(this, game) || this;
    }
    ScrollableContainer.prototype._initScrolling = function (desc) {
        if (desc.vertical) {
            this.vScrollInfo = new ScrollInfo(this.game);
            this.vScrollInfo.listenScroll(this);
        }
    };
    ScrollableContainer.prototype.updateScrollSize = function (desireableHeight, allowedHeight) {
        if (!this.vScrollInfo)
            return;
        if (allowedHeight !== 0 && desireableHeight > allowedHeight) {
            this.vScrollInfo.scrollHeight = desireableHeight;
            this.vScrollInfo.setEnabled(true);
        }
        else {
            this.vScrollInfo.setEnabled(false);
        }
        this.vScrollInfo.vScroll.size.height = allowedHeight;
        this.vScrollInfo.vScroll.pos.x = this.size.width - this.vScrollInfo.vScroll.size.width - 2;
        this.vScrollInfo.onScroll();
    };
    ScrollableContainer.prototype.update = function () {
        if (this.vScrollInfo)
            this.vScrollInfo.update();
        _super.prototype.update.call(this);
    };
    return ScrollableContainer;
}(container_1.Container));
exports.ScrollableContainer = ScrollableContainer;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var container_1 = __webpack_require__(22);
var rectangle_1 = __webpack_require__(34);
var color_1 = __webpack_require__(5);
var VScroll = (function (_super) {
    tslib_1.__extends(VScroll, _super);
    function VScroll(game) {
        var _this = _super.call(this, game) || this;
        _this.type = 'VScroll';
        _this.maxValue = 0;
        _this.value = 0;
        _this.enabled = false;
        var bg = new rectangle_1.Rectangle(game);
        bg.size.width = 5;
        bg.fillColor = new color_1.Color(50, 50, 50, 10);
        bg.color = color_1.Color.NONE.clone();
        var hnd = new rectangle_1.Rectangle(game);
        hnd.size.height = 10;
        hnd.color = color_1.Color.NONE.clone();
        hnd.fillColor = new color_1.Color(10, 10, 10, 100);
        _this.background = bg;
        _this.handler = hnd;
        _this.appendChild(bg);
        _this.appendChild(hnd);
        return _this;
    }
    VScroll.prototype.onGeometryChanged = function () {
        this.handler.size.width = this.background.size.width;
        if (this.value > this.maxValue)
            this.value = this.maxValue;
        if (this.maxValue)
            this.handler.size.height = this.size.height * this.size.height / this.maxValue;
        if (this.maxValue)
            this.handler.pos.y =
                this.size.height * this.value / this.maxValue;
        this.background.revalidate();
        this.handler.revalidate();
        this.calcDrawableRect(this.size.width, this.size.height);
    };
    VScroll.prototype.draw = function () {
        return this.enabled;
    };
    return VScroll;
}(container_1.Container));
exports.VScroll = VScroll;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Device = (function () {
    function Device(game) {
        this.game = game;
    }
    Device.logInfo = function () {
        console.log({
            isCocoonJS: Device.isCocoonJS,
            scale: Device.scale,
            isTouch: Device.isTouch
        });
    };
    Device.isCocoonJS = !!(navigator.isCocoonJS);
    Device.scale = Device.isCocoonJS ? (window.devicePixelRatio || 1) : 1;
    Device.isTouch = (typeof window !== 'undefined' && 'ontouchstart' in window);
    return Device;
}());
exports.Device = Device;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var shaderProgram_1 = __webpack_require__(16);
var abstractDrawer_1 = __webpack_require__(12);
var bufferInfo_1 = __webpack_require__(17);
var debugError_1 = __webpack_require__(0);
var modelDrawer_shader_1 = __webpack_require__(62);
var ModelDrawer = (function (_super) {
    tslib_1.__extends(ModelDrawer, _super);
    function ModelDrawer(gl) {
        var _this = _super.call(this, gl) || this;
        _this.program = new shaderProgram_1.ShaderProgram(gl, modelDrawer_shader_1.vertexSource, modelDrawer_shader_1.fragmentSource);
        return _this;
    }
    ModelDrawer.prototype._initBufferInfo = function () {
        this.g3d.bufferInfo = new bufferInfo_1.BufferInfo(this.gl, {
            posVertexInfo: {
                array: this.g3d.model.vertexArr, type: this.gl.FLOAT,
                size: 3, attrName: 'a_position'
            },
            posIndexInfo: {
                array: this.g3d.model.indexArr
            },
            texVertexInfo: {
                array: this.g3d.model.texCoordArr, type: this.gl.FLOAT,
                size: 2, attrName: 'a_texcoord'
            },
            normalInfo: {
                array: this.g3d.model.normalArr, type: this.gl.FLOAT,
                size: 3, attrName: 'a_normal'
            },
            drawMethod: this.gl.TRIANGLES
        });
    };
    ModelDrawer.prototype.bindModel = function (g3d) {
        this.g3d = g3d;
        if (!this.g3d.bufferInfo)
            this._initBufferInfo();
        this.bufferInfo = this.g3d.bufferInfo;
    };
    ModelDrawer.prototype.bind = function () {
        if ( true && !this.g3d.model)
            throw new debugError_1.DebugError("can not bind modelDrawer;bindModel must be invoked firstly");
        _super.prototype.bind.call(this);
    };
    ModelDrawer.prototype.unbind = function () {
        this.g3d = null;
        _super.prototype.unbind.call(this);
    };
    return ModelDrawer;
}(abstractDrawer_1.AbstractDrawer));
exports.ModelDrawer = ModelDrawer;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.vertexSource = "\n\nattribute vec4 a_position;\nattribute vec2 a_texcoord;\nattribute vec3 a_normal;\n\nuniform mat4 u_modelMatrix;\nuniform mat4 u_projectionMatrix;\n\nvarying vec2 v_texcoord;\nvarying vec3 v_normal;\n\nvoid main() {\n\n  gl_Position = u_projectionMatrix * u_modelMatrix * a_position;\n  v_texcoord = a_texcoord;\n  v_normal = a_normal;\n}\n";
exports.fragmentSource = "\n\nprecision highp float;\n\nvarying vec2 v_texcoord;\nvarying vec3 v_normal;\n\nuniform sampler2D u_texture;\nuniform float u_alpha;\nuniform mat4 u_modelMatrix;\n\n\nvoid main() {\n\n    vec3 lightDirection = normalize(vec3(-1,-1,1));\n    vec3 normalized = normalize((u_modelMatrix * vec4(v_normal,0)).xyz);\n    float lightFactor = max(0.5,dot(lightDirection,normalized));\n    gl_FragColor = texture2D(u_texture, v_texcoord);\n    gl_FragColor.rgb *= lightFactor;\n    gl_FragColor.a *= u_alpha;\n}\n\n";


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var frameBuffer_1 = __webpack_require__(31);
var DoubleFrameBuffer = (function () {
    function DoubleFrameBuffer(gl, width, height) {
        this.gl = gl;
        this.buffers = [
            new frameBuffer_1.FrameBuffer(gl, width, height),
            new frameBuffer_1.FrameBuffer(gl, width, height)
        ];
    }
    DoubleFrameBuffer.prototype.flip = function () {
        var tmp = this.buffers[0];
        this.buffers[0] = this.buffers[1];
        this.buffers[1] = tmp;
    };
    DoubleFrameBuffer.prototype.getSourceBuffer = function () {
        return this.buffers[0];
    };
    DoubleFrameBuffer.prototype.getDestBuffer = function () {
        return this.buffers[1];
    };
    DoubleFrameBuffer.prototype.applyFilters = function (texture, filters) {
        var len = filters.length;
        if (len === 0)
            return texture;
        var filter = filters[0];
        var texInfo = [{ texture: texture, name: 'texture' }];
        filter.doFilter(texInfo, this.getDestBuffer());
        for (var i = 1; i < len; i++) {
            this.flip();
            var texInfo_1 = [{ texture: this.getSourceBuffer().getTexture(), name: 'texture' }];
            filters[i].doFilter(texInfo_1, this.getDestBuffer());
        }
        this.flip();
        return this.getSourceBuffer().getTexture();
    };
    DoubleFrameBuffer.prototype.destroy = function () {
        this.buffers.forEach(function (b) { return b.destroy(); });
    };
    return DoubleFrameBuffer;
}());
exports.DoubleFrameBuffer = DoubleFrameBuffer;


/***/ }),
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var renderableModel_1 = __webpack_require__(18);
var debugError_1 = __webpack_require__(0);
var GameObject = (function (_super) {
    tslib_1.__extends(GameObject, _super);
    function GameObject(game) {
        var _this = _super.call(this, game) || this;
        _this.type = 'GameObject';
        _this.groupNames = [];
        _this.collideWith = [];
        return _this;
    }
    GameObject.prototype.revalidate = function () {
        _super.prototype.revalidate.call(this);
        this.sprite.revalidate();
        this.size.width = this.sprite.size.width;
        this.size.height = this.sprite.size.height;
    };
    GameObject.prototype.setClonedProperties = function (cloned) {
        if ( true && !('clone' in this.sprite)) {
            console.error(this.sprite);
            throw new debugError_1.DebugError("can not clone sprite: cloneable interface is not implemented");
        }
        var clonedSprite = this.sprite.clone();
        if ( true && !(clonedSprite instanceof renderableModel_1.RenderableModel)) {
            console.error(this.sprite);
            throw new debugError_1.DebugError("can not clone sprite: \"clone\"  method must return Renderable object");
        }
        cloned.sprite = clonedSprite;
        _super.prototype.setClonedProperties.call(this, cloned);
    };
    GameObject.prototype.clone = function () {
        var cloned = new GameObject(this.game);
        this.setClonedProperties(cloned);
        cloned.revalidate();
        return cloned;
    };
    GameObject.prototype.update = function () {
        _super.prototype.update.call(this);
        this.sprite.update();
    };
    GameObject.prototype.draw = function () {
        this.sprite.draw();
        return true;
    };
    GameObject.prototype.kill = function () {
        _super.prototype.kill.call(this);
    };
    return GameObject;
}(renderableModel_1.RenderableModel));
exports.GameObject = GameObject;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var image_1 = __webpack_require__(33);
var debugError_1 = __webpack_require__(0);
var size_1 = __webpack_require__(4);
var SpriteSheet = (function (_super) {
    tslib_1.__extends(SpriteSheet, _super);
    function SpriteSheet(game) {
        var _this = _super.call(this, game) || this;
        _this.type = 'SpriteSheet';
        _this.numOfFramesH = 1;
        _this.numOfFramesV = 1;
        _this._currFrameIndex = 0;
        _this._frameSize = new size_1.Size();
        _this._numOfFrames = 0;
        _this._frameAnimations = {};
        return _this;
    }
    SpriteSheet.prototype.revalidate = function () {
        _super.prototype.revalidate.call(this);
        this._frameSize.width = ~~(this.size.width / this.numOfFramesH);
        this._frameSize.height = ~~(this.size.height / this.numOfFramesV);
        this._numOfFrames = this.numOfFramesH * this.numOfFramesV;
        this.setFrameIndex(0);
    };
    SpriteSheet.prototype.setClonedProperties = function (cloned) {
        cloned.numOfFramesV = this.numOfFramesV;
        cloned.numOfFramesH = this.numOfFramesH;
        _super.prototype.setClonedProperties.call(this, cloned);
    };
    SpriteSheet.prototype.clone = function () {
        var cloned = new SpriteSheet(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    };
    SpriteSheet.prototype.getFramePosX = function (frameIndex) {
        return (frameIndex % this.numOfFramesH) * this._frameSize.width;
    };
    SpriteSheet.prototype.getFramePosY = function (frameIndex) {
        return ~~(frameIndex / this.numOfFramesH) * this._frameSize.height;
    };
    SpriteSheet.prototype.getNumOfFrames = function () {
        return this._numOfFrames;
    };
    SpriteSheet.prototype.getFrameWidth = function () {
        return this._frameSize.width;
    };
    SpriteSheet.prototype.getFrameHeight = function () {
        return this._frameSize.height;
    };
    SpriteSheet.prototype.setFrameIndex = function (frameIndex) {
        this.srcRect.setXYWH(this.getFramePosX(frameIndex), this.getFramePosY(frameIndex), this._frameSize.width, this._frameSize.height);
        this._currFrameIndex = frameIndex;
    };
    SpriteSheet.prototype.getFrameIndex = function () {
        return this._currFrameIndex;
    };
    SpriteSheet.prototype.getRect = function () {
        return this.srcRect;
    };
    SpriteSheet.prototype.addFrameAnimation = function (name, fa) {
        this._frameAnimations[name] = fa;
    };
    SpriteSheet.prototype.playFrameAnimation = function (fr) {
        var frameAnimation;
        if (typeof fr === 'string') {
            frameAnimation = this._frameAnimations[fr];
        }
        else
            frameAnimation = fr;
        if ( true && !fr)
            throw new debugError_1.DebugError("no such frame animation: " + name);
        this._currFrameAnimation = frameAnimation;
        frameAnimation.play();
    };
    SpriteSheet.prototype.stopFrameAnimation = function () {
        this._currFrameAnimation.stop();
        this._currFrameAnimation = null;
    };
    SpriteSheet.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this._currFrameAnimation)
            this._currFrameAnimation.update();
    };
    return SpriteSheet;
}(image_1.Image));
exports.SpriteSheet = SpriteSheet;


/***/ }),
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var eventEmitter_1 = __webpack_require__(19);
var KEY_STATE;
(function (KEY_STATE) {
    KEY_STATE[KEY_STATE["KEY_JUST_PRESSED"] = 2] = "KEY_JUST_PRESSED";
    KEY_STATE[KEY_STATE["KEY_PRESSED"] = 1] = "KEY_PRESSED";
    KEY_STATE[KEY_STATE["KEY_JUST_RELEASED"] = 0] = "KEY_JUST_RELEASED";
    KEY_STATE[KEY_STATE["KEY_RELEASED"] = -1] = "KEY_RELEASED";
})(KEY_STATE = exports.KEY_STATE || (exports.KEY_STATE = {}));
var KEYBOARD_EVENT;
(function (KEYBOARD_EVENT) {
    KEYBOARD_EVENT[KEYBOARD_EVENT["KEY_PRESSED"] = 0] = "KEY_PRESSED";
    KEYBOARD_EVENT[KEYBOARD_EVENT["KEY_RELEASED"] = 1] = "KEY_RELEASED";
    KEYBOARD_EVENT[KEYBOARD_EVENT["KEY_HOLD"] = 2] = "KEY_HOLD";
})(KEYBOARD_EVENT = exports.KEYBOARD_EVENT || (exports.KEYBOARD_EVENT = {}));
var AbstractKeypad = (function () {
    function AbstractKeypad(game) {
        this.buffer = {};
        this.emitter = new eventEmitter_1.EventEmitter();
        this.game = game;
    }
    AbstractKeypad.prototype.press = function (key) {
        if (this.isPressed(key))
            return;
        this.buffer[key] = KEY_STATE.KEY_JUST_PRESSED;
        this.emitter.trigger(KEYBOARD_EVENT[KEYBOARD_EVENT.KEY_PRESSED], key);
    };
    AbstractKeypad.prototype.release = function (key) {
        if (this.isReleased(key))
            return;
        this.buffer[key] = KEY_STATE.KEY_JUST_RELEASED;
        this.emitter.trigger(KEYBOARD_EVENT[KEYBOARD_EVENT.KEY_RELEASED], this.buffer[key]);
    };
    AbstractKeypad.prototype.isPressed = function (key) {
        return this.buffer[key] >= KEY_STATE.KEY_PRESSED;
    };
    AbstractKeypad.prototype.isJustPressed = function (key) {
        return this.buffer[key] === KEY_STATE.KEY_JUST_PRESSED;
    };
    AbstractKeypad.prototype.isReleased = function (key) {
        if (this.buffer[key] === undefined)
            return true;
        return this.buffer[key] <= KEY_STATE.KEY_JUST_RELEASED;
    };
    AbstractKeypad.prototype.isJustReleased = function (key) {
        return this.buffer[key] === KEY_STATE.KEY_JUST_RELEASED;
    };
    AbstractKeypad.prototype.update = function () {
        var _this = this;
        Object.keys(this.buffer).forEach(function (key) {
            var keyNum = (+key);
            if (_this.buffer[keyNum] === KEY_STATE.KEY_RELEASED)
                delete _this.buffer[keyNum];
            else if (_this.buffer[keyNum] === KEY_STATE.KEY_JUST_RELEASED)
                _this.buffer[keyNum] = KEY_STATE.KEY_RELEASED;
            if (_this.buffer[keyNum] === KEY_STATE.KEY_JUST_PRESSED) {
                _this.buffer[keyNum] = KEY_STATE.KEY_PRESSED;
            }
            _this.emitter.trigger(KEYBOARD_EVENT[KEYBOARD_EVENT.KEY_HOLD], keyNum);
        });
    };
    return AbstractKeypad;
}());
exports.AbstractKeypad = AbstractKeypad;


/***/ }),
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var abstractKeypad_1 = __webpack_require__(72);
var KEYBOARD_KEY;
(function (KEYBOARD_KEY) {
    KEYBOARD_KEY[KEYBOARD_KEY["SPACE"] = 32] = "SPACE";
    KEYBOARD_KEY[KEYBOARD_KEY["A"] = 65] = "A";
    KEYBOARD_KEY[KEYBOARD_KEY["B"] = 66] = "B";
    KEYBOARD_KEY[KEYBOARD_KEY["C"] = 67] = "C";
    KEYBOARD_KEY[KEYBOARD_KEY["D"] = 68] = "D";
    KEYBOARD_KEY[KEYBOARD_KEY["E"] = 69] = "E";
    KEYBOARD_KEY[KEYBOARD_KEY["F"] = 70] = "F";
    KEYBOARD_KEY[KEYBOARD_KEY["G"] = 71] = "G";
    KEYBOARD_KEY[KEYBOARD_KEY["H"] = 72] = "H";
    KEYBOARD_KEY[KEYBOARD_KEY["I"] = 73] = "I";
    KEYBOARD_KEY[KEYBOARD_KEY["J"] = 74] = "J";
    KEYBOARD_KEY[KEYBOARD_KEY["K"] = 75] = "K";
    KEYBOARD_KEY[KEYBOARD_KEY["L"] = 76] = "L";
    KEYBOARD_KEY[KEYBOARD_KEY["M"] = 77] = "M";
    KEYBOARD_KEY[KEYBOARD_KEY["N"] = 78] = "N";
    KEYBOARD_KEY[KEYBOARD_KEY["O"] = 79] = "O";
    KEYBOARD_KEY[KEYBOARD_KEY["P"] = 80] = "P";
    KEYBOARD_KEY[KEYBOARD_KEY["Q"] = 81] = "Q";
    KEYBOARD_KEY[KEYBOARD_KEY["R"] = 82] = "R";
    KEYBOARD_KEY[KEYBOARD_KEY["S"] = 83] = "S";
    KEYBOARD_KEY[KEYBOARD_KEY["T"] = 84] = "T";
    KEYBOARD_KEY[KEYBOARD_KEY["U"] = 85] = "U";
    KEYBOARD_KEY[KEYBOARD_KEY["V"] = 86] = "V";
    KEYBOARD_KEY[KEYBOARD_KEY["W"] = 87] = "W";
    KEYBOARD_KEY[KEYBOARD_KEY["X"] = 88] = "X";
    KEYBOARD_KEY[KEYBOARD_KEY["Y"] = 89] = "Y";
    KEYBOARD_KEY[KEYBOARD_KEY["Z"] = 80] = "Z";
    KEYBOARD_KEY[KEYBOARD_KEY["LEFT"] = 37] = "LEFT";
    KEYBOARD_KEY[KEYBOARD_KEY["UP"] = 38] = "UP";
    KEYBOARD_KEY[KEYBOARD_KEY["RIGHT"] = 39] = "RIGHT";
    KEYBOARD_KEY[KEYBOARD_KEY["DOWN"] = 40] = "DOWN";
})(KEYBOARD_KEY = exports.KEYBOARD_KEY || (exports.KEYBOARD_KEY = {}));
var Keyboard = (function (_super) {
    tslib_1.__extends(Keyboard, _super);
    function Keyboard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = 'Keyboard';
        return _this;
    }
    Keyboard.prototype.listenTo = function () {
        var _this = this;
        this.keyDownListener = function (e) {
            var code = e.keyCode;
            _this.press(code);
        };
        this.keyUpListener = function (e) {
            var code = e.keyCode;
            _this.release(code);
        };
        window.addEventListener('keydown', this.keyDownListener);
        window.addEventListener('keyup', this.keyUpListener);
    };
    Keyboard.prototype.destroy = function () {
        window.removeEventListener('keydown', this.keyDownListener);
        window.removeEventListener('keyup', this.keyUpListener);
    };
    Keyboard.prototype.on = function (e, callback) {
        this.emitter.on(abstractKeypad_1.KEYBOARD_EVENT[e], callback);
    };
    Keyboard.prototype.off = function (e, callback) {
        this.emitter.off(KEYBOARD_KEY[e], callback);
    };
    return Keyboard;
}(abstractKeypad_1.AbstractKeypad));
exports.Keyboard = Keyboard;


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var abstractKeypad_1 = __webpack_require__(72);
if (true) {
    window.addEventListener("gamepadconnected", function (e) {
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.", e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
    });
    window.addEventListener("gamepaddisconnected", function (e) {
        console.log("Gamepad disconnected from index %d: %s", e.gamepad.index, e.gamepad.id);
    });
}
var GAME_PAD_KEY;
(function (GAME_PAD_KEY) {
    GAME_PAD_KEY[GAME_PAD_KEY["GAME_PAD_1"] = 0] = "GAME_PAD_1";
    GAME_PAD_KEY[GAME_PAD_KEY["GAME_PAD_2"] = 1] = "GAME_PAD_2";
    GAME_PAD_KEY[GAME_PAD_KEY["GAME_PAD_3"] = 2] = "GAME_PAD_3";
    GAME_PAD_KEY[GAME_PAD_KEY["GAME_PAD_4"] = 3] = "GAME_PAD_4";
    GAME_PAD_KEY[GAME_PAD_KEY["GAME_PAD_5"] = 4] = "GAME_PAD_5";
    GAME_PAD_KEY[GAME_PAD_KEY["GAME_PAD_6"] = 5] = "GAME_PAD_6";
    GAME_PAD_KEY[GAME_PAD_KEY["GAME_PAD_7"] = 6] = "GAME_PAD_7";
    GAME_PAD_KEY[GAME_PAD_KEY["GAME_PAD_8"] = 7] = "GAME_PAD_8";
    GAME_PAD_KEY[GAME_PAD_KEY["GAME_PAD_AXIS_LEFT"] = 8] = "GAME_PAD_AXIS_LEFT";
    GAME_PAD_KEY[GAME_PAD_KEY["GAME_PAD_AXIS_RIGHT"] = 9] = "GAME_PAD_AXIS_RIGHT";
    GAME_PAD_KEY[GAME_PAD_KEY["GAME_PAD_AXIS_UP"] = 10] = "GAME_PAD_AXIS_UP";
    GAME_PAD_KEY[GAME_PAD_KEY["GAME_PAD_AXIS_DOWN"] = 11] = "GAME_PAD_AXIS_DOWN";
})(GAME_PAD_KEY = exports.GAME_PAD_KEY || (exports.GAME_PAD_KEY = {}));
var GamePad = (function (_super) {
    tslib_1.__extends(GamePad, _super);
    function GamePad(game) {
        var _this = _super.call(this, game) || this;
        _this.type = 'GamePad';
        return _this;
    }
    GamePad.prototype.update = function () {
        this.gamepads =
            (navigator.getGamepads && navigator.getGamepads()) ||
                (navigator.webkitGetGamepads && navigator.webkitGetGamepads()) ||
                navigator.webkitGamepads || navigator.mozGamepads ||
                navigator.msGamepads || navigator.gamepads || [];
        for (var i = 0, max = this.gamepads.length; i < max; i++) {
            var gp = this.gamepads[i];
            if (!gp)
                continue;
            var maxButtons = gp.buttons.length;
            if (maxButtons > 7)
                maxButtons = 7;
            for (var j = 0; j < maxButtons; j++) {
                var btn = gp.buttons[j];
                if (btn.pressed) {
                    this.press(j);
                }
                else {
                    this.release(j);
                }
            }
            if (gp.axes[0] === 0)
                continue;
            if (gp.axes[1] === 0)
                continue;
            var axis0 = ~~(gp.axes[0]);
            var axis1 = ~~(gp.axes[1]);
            if (axis0 === 1) {
                this.press(GAME_PAD_KEY.GAME_PAD_AXIS_RIGHT);
            }
            else {
                this.release(GAME_PAD_KEY.GAME_PAD_AXIS_RIGHT);
            }
            if (axis0 === -1) {
                this.press(GAME_PAD_KEY.GAME_PAD_AXIS_LEFT);
            }
            else {
                this.release(GAME_PAD_KEY.GAME_PAD_AXIS_LEFT);
            }
            if (axis1 === 1) {
                this.press(GAME_PAD_KEY.GAME_PAD_AXIS_DOWN);
            }
            else {
                this.release(GAME_PAD_KEY.GAME_PAD_AXIS_DOWN);
            }
            if (axis1 === -1) {
                this.press(GAME_PAD_KEY.GAME_PAD_AXIS_UP);
            }
            else {
                this.release(GAME_PAD_KEY.GAME_PAD_AXIS_UP);
            }
        }
    };
    GamePad.prototype.on = function (e, callback) {
        this.emitter.on(abstractKeypad_1.KEYBOARD_EVENT[e], callback);
    };
    GamePad.prototype.off = function (e, callback) {
        this.emitter.off(GAME_PAD_KEY[e], callback);
    };
    GamePad.prototype.listenTo = function () { };
    GamePad.prototype.destroy = function () { };
    return GamePad;
}(abstractKeypad_1.AbstractKeypad));
exports.GamePad = GamePad;


/***/ }),
/* 78 */,
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(80);


/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mainScene_1 = __webpack_require__(81);
var game_1 = __webpack_require__(6);
var webGlRenderer_1 = __webpack_require__(50);
var keyboard_1 = __webpack_require__(76);
var gamePad_1 = __webpack_require__(77);
var game = new game_1.Game();
game.setRenderer(webGlRenderer_1.WebGlRenderer);
game.addControl(keyboard_1.Keyboard);
game.addControl(gamePad_1.GamePad);
var mainScene = new mainScene_1.MainScene(game);
game.runScene(mainScene);


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var scene_1 = __webpack_require__(39);
var gameObject_1 = __webpack_require__(67);
var spriteSheet_1 = __webpack_require__(68);
var rectangle_1 = __webpack_require__(34);
var abstractKeypad_1 = __webpack_require__(72);
var keyboard_1 = __webpack_require__(76);
var gamePad_1 = __webpack_require__(77);
var MainScene = (function (_super) {
    tslib_1.__extends(MainScene, _super);
    function MainScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainScene.prototype.onPreloading = function () {
        this.logoLink = this.resourceLoader.loadImage('../assets/logo.png');
        var rect = new rectangle_1.Rectangle(this.game);
        rect.fillColor.setRGB(10, 100, 100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    };
    MainScene.prototype.onProgress = function (val) {
        this.preloadingGameObject.size.width = val * this.game.width;
    };
    MainScene.prototype.onReady = function () {
        var _this = this;
        this.logoObj = new gameObject_1.GameObject(this.game);
        var spr = new spriteSheet_1.SpriteSheet(this.game);
        spr.setResourceLink(this.logoLink);
        this.logoObj.sprite = spr;
        this.logoObj.pos.fromJSON({ x: 10, y: 10 });
        this.appendChild(this.logoObj);
        this.game.getControl(keyboard_1.Keyboard).on(abstractKeypad_1.KEYBOARD_EVENT.KEY_HOLD, function (e) {
            switch (e) {
                case keyboard_1.KEYBOARD_KEY.LEFT:
                    _this.logoObj.pos.addX(-1);
                    break;
                case keyboard_1.KEYBOARD_KEY.RIGHT:
                    _this.logoObj.pos.addX(1);
                    break;
                case keyboard_1.KEYBOARD_KEY.UP:
                    _this.logoObj.pos.addY(-1);
                    break;
                case keyboard_1.KEYBOARD_KEY.DOWN:
                    _this.logoObj.pos.addY(1);
                    break;
                case keyboard_1.KEYBOARD_KEY.R:
                    _this.logoObj.angle += 0.1;
            }
        });
        this.game.getControl(gamePad_1.GamePad).on(abstractKeypad_1.KEYBOARD_EVENT.KEY_HOLD, function (e) {
            console.log(e);
        });
        window.logoObj = this.logoObj;
    };
    return MainScene;
}(scene_1.Scene));
exports.MainScene = MainScene;


/***/ })
/******/ ]);
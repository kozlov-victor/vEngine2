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
/******/ 	return __webpack_require__(__webpack_require__.s = 69);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DebugError; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

var DebugError = (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__[/* __extends */ "c"](DebugError, _super);
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



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __assign; });
/* unused harmony export __rest */
/* unused harmony export __decorate */
/* unused harmony export __param */
/* unused harmony export __metadata */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __generator; });
/* unused harmony export __exportStar */
/* unused harmony export __values */
/* unused harmony export __read */
/* unused harmony export __spread */
/* unused harmony export __await */
/* unused harmony export __asyncGenerator */
/* unused harmony export __asyncDelegator */
/* unused harmony export __asyncValues */
/* unused harmony export __makeTemplateObject */
/* unused harmony export __importStar */
/* unused harmony export __importDefault */
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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return compileShader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return createProgram; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GL_TYPE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return normalizeUniformName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return extractUniforms; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return extractAttributes; });
/* harmony import */ var _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _engine_misc_object__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);


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
var compileShader = function (gl, shaderSource, shaderType) {
    if (true) {
        if (!shaderSource)
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not compile shader: shader source not specified for type " + shaderType);
    }
    var shader = gl.createShader(shaderType);
    if ( true && !shader)
        throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not allocate memory for shader: gl.createShader(shaderType)");
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
                if (lines_1[i].indexOf(arrow_1) === -1)
                    lines_1[i] = arrow_1 + " " + lines_1[i];
                errorMsg_1 += lines_1[i] + " <----" + inf.message + "\n";
            });
            console.log(lines_1.join('\n'));
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("Error compiling shader: " + (errorMsg_1 ? errorMsg_1 : lastError));
        }
        else {}
    }
    return shader;
};
var createProgram = function (gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    if ( true && !program)
        throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not allocate memory for gl.createProgram()");
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        var lastError = gl.getProgramInfoLog(program);
        if (true) {
            var status = gl.getProgramParameter(program, gl.VALIDATE_STATUS);
            console.error('VALIDATE_STATUS', status);
            var vertexSource = gl.getShaderSource(vertexShader);
            var fragmentSource = gl.getShaderSource(fragmentShader);
            console.log(vertexSource);
            console.log('\n\n');
            console.log(fragmentSource);
            gl.deleteProgram(program);
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("Error in program linking. Last error \"" + lastError + "\", status: " + status);
        }
        else {}
    }
    return program;
};
var GL_TABLE = null;
var GL_TYPE = {
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
        var typeNames = Object.keys(GL_TYPE);
        GL_TABLE = {};
        for (var i = 0; i < typeNames.length; ++i) {
            var tn = typeNames[i];
            GL_TABLE[gl[tn]] = GL_TYPE[tn];
        }
    }
    return GL_TABLE[type];
};
var normalizeUniformName = function (s) {
    if ( true && s.indexOf(' ') > -1)
        throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("bad uniform name: \"" + s + "\", check spaces!");
    else
        return s;
};
var extractUniforms = function (gl, program) {
    var glProgram = program.getProgram();
    var activeUniforms = gl.getProgramParameter(glProgram, gl.ACTIVE_UNIFORMS);
    var uniforms = {};
    for (var i = 0; i < activeUniforms; i++) {
        var uniformData = gl.getActiveUniform(glProgram, i);
        if ( true && !uniformData)
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not receive active uniforms info: gl.getActiveUniform()");
        var type = mapType(gl, uniformData.type);
        var name = normalizeUniformName(uniformData.name);
        var location = gl.getUniformLocation(glProgram, name);
        if ( true && location === null) {
            console.log(program);
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("error finding uniform location: " + uniformData.name);
        }
        uniforms[name] = {
            type: type,
            size: uniformData.size,
            location: location,
            setter: getUniformSetter(uniformData.size, type)
        };
        if (name.indexOf('[') > -1) {
            var arrayName = name.split('[')[0];
            uniforms[arrayName] = uniforms[name];
        }
    }
    return uniforms;
};
var extractAttributes = function (gl, program) {
    var glProgram = program.getProgram();
    var activeAttributes = gl.getProgramParameter(glProgram, gl.ACTIVE_ATTRIBUTES);
    var attrMap = {};
    for (var i = 0; i < activeAttributes; i++) {
        var attrData = gl.getActiveAttrib(glProgram, i);
        if ( true && !attrData)
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not receive active attribute info: gl.getActiveAttrib()");
        var location = gl.getAttribLocation(glProgram, attrData.name);
        if ( true && location < 0) {
            console.log(program);
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("error finding attribute location: " + attrData.name);
        }
        attrMap[attrData.name] = location;
    }
    return attrMap;
};
var TypeNumber = {
    check: function (val) {
        if (isNaN(parseFloat(String(val))) || !isFinite(Number(val)))
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not set uniform with value " + val + ": expected argument of type number");
    }
};
var TypeInt = {
    check: function (val) {
        TypeNumber.check(val);
        if (val !== ~~val)
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not set uniform with value " + val + ": expected argument of integer type, but " + val + " found");
    }
};
var TypeBool = {
    check: function (val) {
        if (!(val === true || val === false))
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not set uniform with value " + val + ": expected argument of boolean type, but " + val + " found");
    }
};
var TypeArray = function (checker, size) {
    return {
        check: function (val) {
            if (!val)
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not set uniform  value: " + val);
            if (!Object(_engine_misc_object__WEBPACK_IMPORTED_MODULE_1__[/* isArray */ "a"])(val)) {
                console.error('Can not set uniform value', val);
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not set uniform with value [" + val + "]: expected argument of type Array");
            }
            if (size !== undefined && val.length !== size)
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not set uniform with value [" + val + "]: expected array with size " + size + ", but " + val.length + " found");
            for (var i = 0; i < val.length; i++) {
                try {
                    checker.check(val[i]);
                }
                catch (e) {
                    console.error('Can not set uniform array item', val);
                    throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not set uniform array item with value [" + val + "]: unexpected array element type: " + val[i]);
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
            case GL_TYPE.FLOAT: return function (gl, location, value) {
                if (true)
                    expect(value, TypeNumber);
                gl.uniform1f(location, value);
            };
            case GL_TYPE.FLOAT_VEC2: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeNumber, 2));
                gl.uniform2f(location, value[0], value[1]);
            };
            case GL_TYPE.FLOAT_VEC3: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeNumber, 3));
                gl.uniform3f(location, value[0], value[1], value[2]);
            };
            case GL_TYPE.FLOAT_VEC4: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeNumber, 4));
                gl.uniform4f(location, value[0], value[1], value[2], value[3]);
            };
            case GL_TYPE.INT: return function (gl, location, value) {
                if (true)
                    expect(value, TypeInt);
                gl.uniform1i(location, value);
            };
            case GL_TYPE.INT_VEC2: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeInt, 2));
                gl.uniform2i(location, value[0], value[1]);
            };
            case GL_TYPE.INT_VEC3: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeInt, 3));
                gl.uniform3i(location, value[0], value[1], value[2]);
            };
            case GL_TYPE.INT_VEC4: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeInt, 4));
                gl.uniform4i(location, value[0], value[1], value[2], value[3]);
            };
            case GL_TYPE.BOOL: return function (gl, location, value) {
                if (true)
                    expect(value, TypeBool);
                gl.uniform1i(location, value);
            };
            case GL_TYPE.BOOL_VEC2: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeBool, 2));
                gl.uniform2i(location, value[0], value[1]);
            };
            case GL_TYPE.BOOL_VEC3: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeBool, 3));
                gl.uniform3i(location, value[0], value[1], value[2]);
            };
            case GL_TYPE.BOOL_VEC4: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeBool, 4));
                gl.uniform4i(location, value[0], value[1], value[2], value[3]);
            };
            case GL_TYPE.FLOAT_MAT2: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeNumber, 2 * 2));
                gl.uniformMatrix2fv(location, false, value);
            };
            case GL_TYPE.FLOAT_MAT3: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeNumber, 3 * 3));
                gl.uniformMatrix3fv(location, false, value);
            };
            case GL_TYPE.FLOAT_MAT4: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeNumber, 4 * 4));
                gl.uniformMatrix4fv(location, false, value);
            };
            case GL_TYPE.SAMPLER_2D: return function (gl, location, value) {
                if (true)
                    expect(value, TypeInt);
                gl.uniform1i(location, value);
            };
            default:
                if (true)
                    throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not set uniform for type " + type + " and size " + size);
                break;
        }
    }
    else {
        switch (type) {
            case GL_TYPE.FLOAT: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeNumber, size));
                gl.uniform1fv(location, value);
            };
            case GL_TYPE.FLOAT_VEC2: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeNumber, size * 2));
                gl.uniform2fv(location, value);
            };
            case GL_TYPE.FLOAT_VEC3: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeNumber, size * 3));
                gl.uniform3fv(location, value);
            };
            case GL_TYPE.FLOAT_VEC4: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeNumber, size * 4));
                gl.uniform4fv(location, value);
            };
            case GL_TYPE.INT: return function (gl, location, value) {
                if (true)
                    expect(value, TypeInt);
                gl.uniform1iv(location, value);
            };
            case GL_TYPE.INT_VEC2: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeInt, size * 2));
                gl.uniform2iv(location, value);
            };
            case GL_TYPE.INT_VEC3: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeInt, size * 3));
                gl.uniform3iv(location, value);
            };
            case GL_TYPE.INT_VEC4: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeInt, size * 4));
                gl.uniform4iv(location, value);
            };
            case GL_TYPE.BOOL: return function (gl, location, value) {
                if (true)
                    expect(value, TypeBool);
                gl.uniform1iv(location, value);
            };
            case GL_TYPE.BOOL_VEC2: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeBool, size * 2));
                gl.uniform2iv(location, value);
            };
            case GL_TYPE.BOOL_VEC3: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeBool, size * 3));
                gl.uniform3iv(location, value);
            };
            case GL_TYPE.BOOL_VEC4: return function (gl, location, value) {
                if (true)
                    expect(value, TypeArray(TypeBool, size * 4));
                gl.uniform4iv(location, value);
            };
            case GL_TYPE.SAMPLER_2D: return function (gl, location, value) {
                if (true)
                    expect(value, TypeInt);
                gl.uniform1iv(location, value);
            };
            default:
                if (true)
                    throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not set uniform for type " + type + " and size " + size);
                break;
        }
    }
    throw new Error();
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return mat4; });
/* harmony import */ var _debug_debugError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _engine_misc_objectPool__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);


var mat4;
(function (mat4) {
    var Mat16Holder = (function () {
        function Mat16Holder() {
            this.mat16 = new Float32Array(16);
            this._captured = false;
            this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        }
        Mat16Holder.fromPool = function () {
            return Mat16Holder.m16hPool.getFreeObject();
        };
        Mat16Holder.create = function () {
            return new Mat16Holder();
        };
        Mat16Holder.prototype.set = function (v0, v1, v2, v3, v4, v5, v6, v7, v8, v9, v10, v11, v12, v13, v14, v15) {
            this.mat16[0] = v0;
            this.mat16[1] = v1;
            this.mat16[2] = v2;
            this.mat16[3] = v3;
            this.mat16[4] = v4;
            this.mat16[5] = v5;
            this.mat16[6] = v6;
            this.mat16[7] = v7;
            this.mat16[8] = v8;
            this.mat16[9] = v9;
            this.mat16[10] = v10;
            this.mat16[11] = v11;
            this.mat16[12] = v12;
            this.mat16[13] = v13;
            this.mat16[14] = v14;
            this.mat16[15] = v15;
        };
        Mat16Holder.prototype.fromMat16 = function (mat16) {
            this.set(mat16[0], mat16[1], mat16[2], mat16[3], mat16[4], mat16[5], mat16[6], mat16[7], mat16[8], mat16[9], mat16[10], mat16[11], mat16[12], mat16[13], mat16[14], mat16[15]);
        };
        Mat16Holder.prototype.clone = function () {
            var m = new Mat16Holder();
            for (var i = 0; i < this.mat16.length; i++) {
                m.mat16[i] = this.mat16[i];
            }
            return m;
        };
        Mat16Holder.prototype.isCaptured = function () {
            return this._captured;
        };
        Mat16Holder.prototype.capture = function () {
            this._captured = true;
            return this;
        };
        Mat16Holder.prototype.release = function () {
            this._captured = false;
            return this;
        };
        Mat16Holder.m16hPool = new _engine_misc_objectPool__WEBPACK_IMPORTED_MODULE_1__[/* ObjectPool */ "a"](Mat16Holder, 256);
        return Mat16Holder;
    }());
    mat4.Mat16Holder = Mat16Holder;
    mat4.makeIdentity = function (out) {
        out.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    };
    mat4.makeZToWMatrix = function (out, fudgeFactor) {
        out.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, fudgeFactor, 0, 0, 0, 1);
    };
    mat4.make2DProjection = function (out, width, height, depth) {
        out.set(2 / width, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 2 / depth, 0, -1, 1, 0, 1);
    };
    mat4.ortho = function (out, left, right, bottom, top, near, far) {
        var lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
        var outMat16 = out.mat16;
        outMat16[0] = -2 * lr;
        outMat16[1] = 0;
        outMat16[2] = 0;
        outMat16[3] = 0;
        outMat16[4] = 0;
        outMat16[5] = -2 * bt;
        outMat16[6] = 0;
        outMat16[7] = 0;
        outMat16[8] = 0;
        outMat16[9] = 0;
        outMat16[10] = 2 * nf;
        outMat16[11] = 0;
        outMat16[12] = (left + right) * lr;
        outMat16[13] = (top + bottom) * bt;
        outMat16[14] = (far + near) * nf;
        outMat16[15] = 1;
    };
    mat4.perspective = function (out, fovy, aspect, near, far) {
        var f = 1.0 / Math.tan(fovy / 2), nf = 1 / (near - far);
        var outMat16 = out.mat16;
        outMat16[0] = f / aspect;
        outMat16[1] = 0;
        outMat16[2] = 0;
        outMat16[3] = 0;
        outMat16[4] = 0;
        outMat16[5] = f;
        outMat16[6] = 0;
        outMat16[7] = 0;
        outMat16[8] = 0;
        outMat16[9] = 0;
        outMat16[10] = (far + near) * nf;
        outMat16[11] = -1;
        outMat16[12] = 0;
        outMat16[13] = 0;
        outMat16[14] = (2 * far * near) * nf;
        outMat16[15] = 0;
    };
    mat4.makeTranslation = function (out, tx, ty, tz) {
        out.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1);
    };
    mat4.makeXSkew = function (out, angle) {
        out.set(1, 0, 0, 0, Math.tan(angle), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    };
    mat4.makeYSkew = function (out, angle) {
        out.set(1, Math.tan(angle), 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    };
    mat4.makeXRotation = function (out, angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        out.set(1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1);
    };
    mat4.makeYRotation = function (out, angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        out.set(c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1);
    };
    mat4.makeZRotation = function (out, angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        out.set(c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    };
    mat4.makeScale = function (out, sx, sy, sz) {
        out.set(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1);
    };
    mat4.matrixMultiply = function (out, aHolder, bHolder) {
        var r = out.mat16;
        var a = aHolder.mat16;
        var b = bHolder.mat16;
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
    };
    mat4.multMatrixVec = function (out, matrix, inp) {
        var outMat16 = out.mat16;
        for (var i = 0; i < 4; i++) {
            outMat16[i] =
                inp[0] * matrix.mat16[0 * 4 + i] +
                    inp[1] * matrix.mat16[1 * 4 + i] +
                    inp[2] * matrix.mat16[2 * 4 + i] +
                    inp[3] * matrix.mat16[3 * 4 + i];
        }
    };
    mat4.inverse = function (out, mHolder) {
        var r = out.mat16;
        var m = mHolder.mat16;
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
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not invert matrix");
        }
        for (var i = 0; i < 16; i++)
            r[i] /= det;
    };
    var m16h = Mat16Holder.create();
    mat4.makeIdentity(m16h);
    mat4.IDENTITY = m16h.mat16;
})(mat4 || (mat4 = {}));


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Point2d; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _misc_objectPool__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _abstract_observableEntity__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(18);



var Point2d = (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__[/* __extends */ "c"](Point2d, _super);
    function Point2d(x, y, onChangedFn) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var _this = _super.call(this) || this;
        _this._x = 0;
        _this._y = 0;
        _this._x = x;
        _this._y = y;
        if (onChangedFn)
            _this.addOnChangeListener(onChangedFn);
        return _this;
    }
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
    Point2d.fromPool = function () {
        return Point2d.pool.getFreeObject();
    };
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
    Point2d.prototype.equal = function (x, y) {
        if (y === void 0) { y = x; }
        return this._x === x && this._y === y;
    };
    Point2d.prototype.equalPoint = function (point) {
        return this.equal(point.x, point.y);
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
    Point2d.pool = new _misc_objectPool__WEBPACK_IMPORTED_MODULE_1__[/* ObjectPool */ "a"](Point2d, 4);
    return Point2d;
}(_abstract_observableEntity__WEBPACK_IMPORTED_MODULE_2__[/* ObservableEntity */ "a"]));



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MOUSE_EVENTS; });
var MOUSE_EVENTS;
(function (MOUSE_EVENTS) {
    MOUSE_EVENTS["click"] = "click";
    MOUSE_EVENTS["mouseDown"] = "mouseDown";
    MOUSE_EVENTS["mouseMove"] = "mouseMove";
    MOUSE_EVENTS["mouseLeave"] = "mouseLeave";
    MOUSE_EVENTS["mouseEnter"] = "mouseEnter";
    MOUSE_EVENTS["mouseUp"] = "mouseUp";
    MOUSE_EVENTS["doubleClick"] = "doubleClick";
    MOUSE_EVENTS["scroll"] = "scroll";
    MOUSE_EVENTS["dragStart"] = "dragStart";
    MOUSE_EVENTS["dragStop"] = "dragStop";
})(MOUSE_EVENTS || (MOUSE_EVENTS = {}));


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Rect; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _size__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _point2d__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _misc_objectPool__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(11);
/* harmony import */ var _abstract_observableEntity__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(18);





var Rect = (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__[/* __extends */ "c"](Rect, _super);
    function Rect(x, y, width, height, onChangedFn) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        var _this = _super.call(this) || this;
        _this.point = new _point2d__WEBPACK_IMPORTED_MODULE_2__[/* Point2d */ "a"]();
        _this.size = new _size__WEBPACK_IMPORTED_MODULE_1__[/* Size */ "a"]();
        _this._arr = [0, 0, 0, 0];
        if (onChangedFn)
            _this.addOnChangeListener(onChangedFn);
        _this.setXYWH(x, y, width, height);
        return _this;
    }
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
    Rect.fromPool = function () {
        return Rect.rectPool.getFreeObject();
    };
    Rect.prototype.observe = function (onChangedFn) {
        this.addOnChangeListener(onChangedFn);
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
        this.revalidate();
        return this;
    };
    Rect.prototype.setSize = function (s) {
        this.size.setWH(s.width, s.height);
        this.revalidate();
        return this;
    };
    Rect.prototype.setPoint = function (p) {
        this.point.setXY(p.x, p.y);
        this.revalidate();
        return this;
    };
    Rect.prototype.addXY = function (x, y) {
        this.point.addXY(x, y);
        this.revalidate();
        return this;
    };
    Rect.prototype.addPoint = function (another) {
        this.addXY(another.x, another.y);
        this.revalidate();
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
    Rect.prototype.toArray = function () {
        this._arr[0] = this.point.x;
        this._arr[1] = this.point.y;
        this._arr[2] = this.size.width;
        this._arr[3] = this.size.height;
        return this._arr;
    };
    Rect.prototype.fromJSON = function (jsonObj) {
        this.setXYWH(jsonObj.x, jsonObj.y, jsonObj.width, jsonObj.height);
    };
    Rect.rectPool = new _misc_objectPool__WEBPACK_IMPORTED_MODULE_3__[/* ObjectPool */ "a"](Rect);
    return Rect;
}(_abstract_observableEntity__WEBPACK_IMPORTED_MODULE_4__[/* ObservableEntity */ "a"]));



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Color; });
/* harmony import */ var _misc_objectPool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);


var Color = (function () {
    function Color(r, g, b, a) {
        this.type = 'Color';
        this._freezed = false;
        this._captured = false;
        this.setRGBA(r, g, b, a);
    }
    Color.RGB = function (r, g, b, a) {
        if (g === void 0) { g = r; }
        if (b === void 0) { b = r; }
        if (a === void 0) { a = 255; }
        var c = new Color(0, 0, 0);
        c.setRGBA(r, g, b, a);
        return c;
    };
    Color.getFromPool = function () {
        if (Color.objectPool === undefined)
            Color.objectPool = new _misc_objectPool__WEBPACK_IMPORTED_MODULE_0__[/* ObjectPool */ "a"](Color);
        return Color.objectPool.getFreeObject();
    };
    Color.prototype.setRGBA = function (r, g, b, a) {
        if (a === void 0) { a = 255; }
        this.checkFriezed();
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
        this.normalizeToZeroOne();
    };
    Color.prototype.setRGB = function (r, g, b) {
        this.checkFriezed();
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = 255;
        this.normalizeToZeroOne();
    };
    Color.prototype.setR = function (val) {
        this.checkFriezed();
        this.r = val;
        this.normalizeToZeroOne();
    };
    Color.prototype.setG = function (val) {
        this.checkFriezed();
        this.g = val;
        this.normalizeToZeroOne();
    };
    Color.prototype.setB = function (val) {
        this.checkFriezed();
        this.b = val;
        this.normalizeToZeroOne();
    };
    Color.prototype.setA = function (val) {
        this.checkFriezed();
        this.a = val;
        this.normalizeToZeroOne();
    };
    Color.prototype.set = function (another) {
        this.checkFriezed();
        this.setRGBA(another.r, another.g, another.b, another.a);
    };
    Color.prototype.clone = function () {
        return new Color(this.r, this.g, this.b, this.a);
    };
    Color.prototype.capture = function () {
        this._captured = true;
        return this;
    };
    Color.prototype.isCaptured = function () {
        return this._captured;
    };
    Color.prototype.release = function () {
        this._captured = false;
        return this;
    };
    Color.prototype.freeze = function () {
        this._freezed = true;
        return this;
    };
    Color.prototype.asGL = function () {
        if (!this._arr)
            this._arr = new Array(3);
        this._arr[0] = this.rNorm;
        this._arr[1] = this.gNorm;
        this._arr[2] = this.bNorm;
        this._arr[3] = this.aNorm;
        return this._arr;
    };
    Color.prototype.asCSS = function () {
        return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a / 255 + ")";
    };
    Color.prototype.toJSON = function () {
        return { r: this.r, g: this.g, b: this.b, a: this.a };
    };
    Color.prototype.fromJSON = function (json) {
        this.setRGBA(json.r, json.g, json.b, json.a);
    };
    Color.prototype.checkFriezed = function () {
        if (this._freezed) {
            if (true) {
                console.error(this);
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_1__[/* DebugError */ "a"]("the color is friezed and can no be changed");
            }
            else
                {}
        }
    };
    Color.prototype.normalizeToZeroOne = function () {
        this.rNorm = this.r / 0xff;
        this.gNorm = this.g / 0xff;
        this.bNorm = this.b / 0xff;
        this.aNorm = this.a / 0xff;
    };
    Color.WHITE = Color.RGB(255, 255, 255).freeze();
    Color.GREY = Color.RGB(127, 127, 127).freeze();
    Color.BLACK = Color.RGB(0, 0, 0).freeze();
    Color.NONE = Color.RGB(0, 0, 0, 0).freeze();
    return Color;
}());



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BLEND_MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return RenderableModel; });
/* harmony import */ var _debug_debugError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _misc_mathEx__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(13);
/* harmony import */ var _geometry_point2d__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _geometry_rect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
/* harmony import */ var _engine_geometry_size__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);
/* harmony import */ var _engine_delegates_tweenableDelegate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(28);
/* harmony import */ var _engine_delegates_timerDelegate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(33);
/* harmony import */ var _engine_delegates_eventEmitterDelegate__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(24);
/* harmony import */ var _engine_resources_incrementer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(27);









var BLEND_MODE;
(function (BLEND_MODE) {
    BLEND_MODE[BLEND_MODE["NORMAL"] = 0] = "NORMAL";
    BLEND_MODE[BLEND_MODE["ADDITIVE"] = 1] = "ADDITIVE";
    BLEND_MODE[BLEND_MODE["SUBSTRACTIVE"] = 2] = "SUBSTRACTIVE";
    BLEND_MODE[BLEND_MODE["REVERSE_SUBSTRACTIVE"] = 3] = "REVERSE_SUBSTRACTIVE";
})(BLEND_MODE || (BLEND_MODE = {}));
var Angle3d = (function () {
    function Angle3d(m) {
        this.m = m;
        this.x = 0;
        this.y = 0;
        this._z = 0;
    }
    Object.defineProperty(Angle3d.prototype, "z", {
        get: function () {
            return this._z;
        },
        set: function (val) {
            this.m.angle = val;
        },
        enumerable: true,
        configurable: true
    });
    Angle3d.prototype._setZSilently = function (val) {
        this._z = val;
    };
    Angle3d.prototype.clone = function (m) {
        var a = new Angle3d(m);
        a.x = this.x;
        a.y = this.y;
        a.z = this.z;
        return a;
    };
    return Angle3d;
}());
var RenderableModel = (function () {
    function RenderableModel(game) {
        var _this = this;
        this.game = game;
        this.size = new _engine_geometry_size__WEBPACK_IMPORTED_MODULE_4__[/* Size */ "a"]();
        this.pos = new _geometry_point2d__WEBPACK_IMPORTED_MODULE_2__[/* Point2d */ "a"](0, 0, function () { return _this._dirty = true; });
        this.posZ = 0;
        this.scale = new _geometry_point2d__WEBPACK_IMPORTED_MODULE_2__[/* Point2d */ "a"](1, 1);
        this.skew = new _geometry_point2d__WEBPACK_IMPORTED_MODULE_2__[/* Point2d */ "a"](0, 0);
        this.anchor = new _geometry_point2d__WEBPACK_IMPORTED_MODULE_2__[/* Point2d */ "a"](0, 0);
        this.rotationPoint = new _geometry_point2d__WEBPACK_IMPORTED_MODULE_2__[/* Point2d */ "a"](0, 0);
        this.angle3d = new Angle3d(this);
        this.alpha = 1;
        this.blendMode = BLEND_MODE.NORMAL;
        this.children = [];
        this.velocity = new _geometry_point2d__WEBPACK_IMPORTED_MODULE_2__[/* Point2d */ "a"](0, 0);
        this.visible = true;
        this._dirty = true;
        this._srcRect = new _geometry_rect__WEBPACK_IMPORTED_MODULE_3__[/* Rect */ "a"]();
        this._screenRect = new _geometry_rect__WEBPACK_IMPORTED_MODULE_3__[/* Rect */ "a"]();
        this._behaviours = [];
        this._angle = 0;
        this._tweenDelegate = new _engine_delegates_tweenableDelegate__WEBPACK_IMPORTED_MODULE_5__[/* TweenableDelegate */ "a"]();
        this._timerDelegate = new _engine_delegates_timerDelegate__WEBPACK_IMPORTED_MODULE_6__[/* TimerDelegate */ "a"]();
        this._eventEmitterDelegate = new _engine_delegates_eventEmitterDelegate__WEBPACK_IMPORTED_MODULE_7__[/* EventEmitterDelegate */ "a"]();
        if ( true && !game)
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not create model '" + this.type + "': game instance not passed to model constructor");
        this.id = "object_" + _engine_resources_incrementer__WEBPACK_IMPORTED_MODULE_8__[/* Incrementer */ "a"].getValue();
    }
    Object.defineProperty(RenderableModel.prototype, "angle", {
        get: function () {
            return this._angle;
        },
        set: function (val) {
            this._angle = val;
            this.angle3d._setZSilently(val);
        },
        enumerable: true,
        configurable: true
    });
    RenderableModel.prototype.revalidate = function () {
        for (var _i = 0, _a = this._behaviours; _i < _a.length; _i++) {
            var b = _a[_i];
            b.revalidate();
        }
    };
    RenderableModel.prototype.getLayer = function () {
        return this._layer;
    };
    RenderableModel.prototype.setLayer = function (value) {
        this._layer = value;
    };
    RenderableModel.prototype.findChildById = function (id) {
        if (id === this.id)
            return this;
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var c = _a[_i];
            var possibleObject = c.findChildById(id);
            if (possibleObject)
                return possibleObject;
        }
        return null;
    };
    RenderableModel.prototype.getWorldRect = function () {
        if (this._dirty) {
            this.calcWorldRect();
        }
        return this._screenRect;
    };
    RenderableModel.prototype.getSrcRect = function () {
        this._srcRect.setXYWH(this.pos.x - this.anchor.x, this.pos.y - this.anchor.y, this.size.width, this.size.height);
        return this._srcRect;
    };
    RenderableModel.prototype.setAnchorToCenter = function () {
        this.revalidate();
        if ( true && !(this.size.width && this.size.height))
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not set anchor to center: width or height of gameObject is not set");
        this.anchor.setXY(this.size.width / 2, this.size.height / 2);
    };
    RenderableModel.prototype.setRotationPointToCenter = function () {
        this.revalidate();
        if ( true && !(this.size.width && this.size.height))
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not set rotation point to center: width or height of gameObject is not set");
        this.rotationPoint.setXY(this.size.width / 2, this.size.height / 2);
    };
    RenderableModel.prototype.appendChild = function (c) {
        if (true) {
            if (c === this)
                throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("parent and child objects are the same");
        }
        c.parent = this;
        c.setLayer(this.getLayer());
        c.revalidate();
        this.children.push(c);
    };
    RenderableModel.prototype.removeChildAt = function (i) {
        var c = this.children[i];
        if ( true && !c)
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not remove children with index " + i);
        c.kill();
    };
    RenderableModel.prototype.removeChildren = function () {
        for (var i = this.children.length - 1; i >= 0; i--) {
            var c = this.children[i];
            this.removeChildAt(i);
        }
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
    RenderableModel.prototype.moveToFront = function () {
        if ( true && !this._getParent())
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not move to front: object is detached");
        var index = (this._getParent()).children.indexOf(this);
        if ( true && index === -1)
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not move to front: object is not belong to current scene");
        var parentArray = this._getParent().children;
        parentArray.splice(index, 1);
        parentArray.push(this);
    };
    RenderableModel.prototype.moveToBack = function () {
        if ( true && !this._getParent())
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not move to back: object is detached");
        var index = this._getParent().children.indexOf(this);
        if ( true && index === -1)
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not move to front: object is not belong to current scene");
        var parentArray = this._getParent().children;
        parentArray.splice(index, 1);
        parentArray.unshift(this);
    };
    RenderableModel.prototype.kill = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var c = _a[_i];
            c.kill();
        }
        if ( true && !this._getParent())
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not kill object: gameObject is detached");
        var parentArray = this._getParent().children;
        var index = parentArray.indexOf(this);
        if ( true && index === -1) {
            console.error(this);
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]('can not kill: object is not belong to current scene');
        }
        this.parent = null;
        this._layer = null;
        parentArray.splice(index, 1);
        for (var _b = 0, _c = this._behaviours; _b < _c.length; _b++) {
            var b = _c[_b];
            b.destroy();
        }
        this.game.getRenderer().killObject(this);
    };
    RenderableModel.prototype.render = function () {
        if (!this.visible)
            return;
        var renderer = this.game.getRenderer();
        renderer.save();
        this.beforeRender();
        if (!this.anchor.equal(0, 0))
            renderer.translate(-this.anchor.x, -this.anchor.y, this.posZ);
        if (this.isNeedAdditionalTransform()) {
            renderer.translate(this.rotationPoint.x, this.rotationPoint.y);
            if (!this.scale.equal(1))
                renderer.scale(this.scale.x, this.scale.y);
            if (this.skew.x !== 0)
                renderer.skewX(this.skew.x);
            if (this.skew.y !== 0)
                renderer.skewY(this.skew.y);
            this.doAdditionalTransform();
            renderer.translate(-this.rotationPoint.x, -this.rotationPoint.y);
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
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (this._dirty)
                c.setDirty();
            c.update();
        }
        var delta = this.game.getDeltaTime();
        this._tweenDelegate.update();
        this._timerDelegate.update();
        for (var _b = 0, _c = this._behaviours; _b < _c.length; _b++) {
            var bh = _c[_b];
            bh.onUpdate();
        }
        if (this.velocity.x)
            this.pos.x += this.velocity.x * delta / 1000;
        if (this.velocity.y)
            this.pos.y += this.velocity.y * delta / 1000;
        for (var _d = 0, _e = this.children; _d < _e.length; _d++) {
            var c = _e[_d];
            c.update();
        }
    };
    RenderableModel.prototype.addTween = function (t) {
        this._tweenDelegate.addTween(t);
    };
    RenderableModel.prototype.addTweenMovie = function (tm) {
        this._tweenDelegate.addTweenMovie(tm);
    };
    RenderableModel.prototype.tween = function (desc) {
        return this._tweenDelegate.tween(desc);
    };
    RenderableModel.prototype.setTimeout = function (callback, interval) {
        return this._timerDelegate.setTimeout(callback, interval);
    };
    RenderableModel.prototype.setInterval = function (callback, interval) {
        return this._timerDelegate.setInterval(callback, interval);
    };
    RenderableModel.prototype.off = function (eventName, callBack) {
        this._eventEmitterDelegate.off(eventName, callBack);
    };
    RenderableModel.prototype.on = function (eventName, callBack) {
        return this._eventEmitterDelegate.on(eventName, callBack);
    };
    RenderableModel.prototype.trigger = function (eventName, data) {
        this._eventEmitterDelegate.trigger(eventName, data);
    };
    RenderableModel.prototype.setClonedProperties = function (cloned) {
        cloned.size.set(cloned.size);
        cloned.pos.set(this.pos);
        cloned.scale.set(this.scale);
        cloned.anchor.set(this.anchor);
        cloned.rotationPoint.set(this.rotationPoint);
        cloned.angle3d = this.angle3d.clone(this);
        cloned.alpha = this.alpha;
        cloned.blendMode = this.blendMode;
        cloned.parent = null;
        this.children.forEach(function (c) {
            if ( true && !('clone' in c)) {
                console.error(c);
                throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not clone object: cloneable interface is not implemented");
            }
            var clonedChildren = c.clone();
            if ( true && !(clonedChildren instanceof RenderableModel)) {
                console.error(c);
                throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not clone object: \"clone\"  method must return Cloneable object");
            }
            cloned.appendChild(clonedChildren);
        });
        cloned.game = this.game;
    };
    RenderableModel.prototype.calcWorldRect = function () {
        this._screenRect.set(this.getSrcRect());
        var parent = this.parent;
        while (parent) {
            this._screenRect.addXY(parent.getSrcRect().point.x, parent.getSrcRect().point.y);
            parent = parent.parent;
        }
    };
    RenderableModel.prototype.beforeRender = function () {
        this.game.getRenderer().translate(this.pos.x, this.pos.y);
    };
    RenderableModel.prototype.isNeedAdditionalTransform = function () {
        return !(this.skew.equal(0) && this.scale.equal(1) && this.angle3d.x === 0 && this.angle3d.y === 0 && this.angle3d.z === 0);
    };
    RenderableModel.prototype.doAdditionalTransform = function () {
        var renderer = this.game.getRenderer();
        if (this.angle3d.z !== 0)
            renderer.rotateZ(this.angle3d.z);
        if (this.angle3d.x !== 0)
            renderer.rotateX(this.angle3d.x);
        if (this.angle3d.y !== 0)
            renderer.rotateY(this.angle3d.y);
    };
    RenderableModel.prototype.isInViewPort = function () {
        return _misc_mathEx__WEBPACK_IMPORTED_MODULE_1__[/* MathEx */ "a"].overlapTest(this.game.camera.getRectScaled(), this.getSrcRect());
    };
    RenderableModel.prototype._getParent = function () {
        return this.parent || this._layer || undefined;
    };
    return RenderableModel;
}());



/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Size; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _misc_objectPool__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _engine_geometry_abstract_observableEntity__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(18);



var Size = (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__[/* __extends */ "c"](Size, _super);
    function Size(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        var _this = _super.call(this) || this;
        _this._arr = [_this._width, _this._height];
        _this._width = width;
        _this._height = height;
        return _this;
    }
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
    Size.prototype.addWH = function (width, height) {
        if (height === void 0) { height = width; }
        this.setWH(this.width + width, this.height + height);
        return this;
    };
    Size.prototype.set = function (another) {
        this._width = another._width;
        this._height = another._height;
        this.triggerObservable();
        return this;
    };
    Size.prototype.isZero = function () {
        return this._width === 0 && this._height === 0;
    };
    Size.prototype.toArray = function () {
        this._arr[0] = this._width;
        this._arr[1] = this._height;
        return this._arr;
    };
    Size.prototype.toJSON = function () {
        return {
            width: this.width,
            height: this.height
        };
    };
    Size.rectPool = new _misc_objectPool__WEBPACK_IMPORTED_MODULE_1__[/* ObjectPool */ "a"](Size);
    return Size;
}(_engine_geometry_abstract_observableEntity__WEBPACK_IMPORTED_MODULE_2__[/* ObservableEntity */ "a"]));



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./engine/renderer/camera.ts
var camera = __webpack_require__(22);

// EXTERNAL MODULE: ./engine/geometry/point2d.ts
var point2d = __webpack_require__(4);

// CONCATENATED MODULE: ./engine/physics/unused/colliderEngine.ts
var ColliderEngine = (function () {
    function ColliderEngine(game) {
        this.relaxationCount = 15;
        this.posCorrectionRate = 0.8;
        this.game = game;
    }
    return ColliderEngine;
}());


// EXTERNAL MODULE: ./engine/debug/debugError.ts
var debugError = __webpack_require__(0);

// CONCATENATED MODULE: ./engine/game.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SCALE_STRATEGY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return game_Game; });





var SCALE_STRATEGY;
(function (SCALE_STRATEGY) {
    SCALE_STRATEGY[SCALE_STRATEGY["NO_SCALE"] = 0] = "NO_SCALE";
    SCALE_STRATEGY[SCALE_STRATEGY["FIT"] = 1] = "FIT";
    SCALE_STRATEGY[SCALE_STRATEGY["STRETCH"] = 2] = "STRETCH";
})(SCALE_STRATEGY || (SCALE_STRATEGY = {}));
var game_Game = (function () {
    function Game(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.width, width = _c === void 0 ? 320 : _c, _d = _b.height, height = _d === void 0 ? 240 : _d, _e = _b.scaleStrategy, scaleStrategy = _e === void 0 ? SCALE_STRATEGY.FIT : _e;
        this.scale = new point2d["a" /* Point2d */](1, 1);
        this.pos = new point2d["a" /* Point2d */](0, 0);
        this.camera = new camera["b" /* Camera */](this);
        this.gravityConstant = 0;
        this.fps = 0;
        this.collider = new ColliderEngine(this);
        this._scaleStrategy = SCALE_STRATEGY.FIT;
        this._lastTime = 0;
        this._currTime = 0;
        this._deltaTime = 0;
        this._running = false;
        this._destroyed = false;
        this._controls = [];
        Game.instance = this;
        if (true)
            window.game = this;
        this.width = width;
        this.height = height;
        this._scaleStrategy = scaleStrategy;
    }
    Game.getInstance = function () {
        return Game.instance;
    };
    Game.isOfType = function (instance, C) {
        return instance instanceof C;
    };
    Object.defineProperty(Game.prototype, "scaleStrategy", {
        get: function () {
            return this._scaleStrategy;
        },
        enumerable: true,
        configurable: true
    });
    Game.prototype.addControl = function (C) {
        var instance = new C(this);
        if (true) {
            for (var _i = 0, _a = this._controls; _i < _a.length; _i++) {
                var c = _a[_i];
                if (c.type === instance.type) {
                    throw new debugError["a" /* DebugError */]("control with type \"" + c.type + "\" added already");
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
            throw new debugError["a" /* DebugError */]('audio player is not set');
        }
        return this.audioPlayer;
    };
    Game.prototype.getControl = function (T) {
        for (var _i = 0, _a = this._controls; _i < _a.length; _i++) {
            var c = _a[_i];
            if (Game.isOfType(c, T))
                return c;
        }
        if (true)
            throw new debugError["a" /* DebugError */]('no such control');
        else
            {}
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
    Game.prototype.runScene = function (scene) {
        var _this = this;
        this._currentScene = scene;
        this.revalidate();
        scene.onPreloading();
        scene.resourceLoader.onProgress(function () {
            scene.onProgress(scene.resourceLoader.getProgress());
        });
        if (!this._running)
            this.update();
        this._running = true;
        scene.resourceLoader.onCompleted(function () {
            _this._currentScene.onReady();
        });
        scene.resourceLoader.startLoading();
    };
    Game.prototype.getCurrScene = function () {
        if ( true && !this._currentScene)
            throw new debugError["a" /* DebugError */]("current scene is not set yet");
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
            if (renderError) {
                throw new debugError["a" /* DebugError */]("rendering error with code " + renderError.code + " (" + renderError.desc + ")");
            }
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
        if (this._renderer) {
            this._renderer.cancelFullScreen();
            this._renderer.destroy();
        }
    };
    Game.prototype.revalidate = function () {
        if ( true && !this._renderer)
            throw new debugError["a" /* DebugError */]("game renderer is not set");
        this.camera.revalidate();
    };
    Game.UPDATE_TIME_RATE = 20;
    return Game;
}());

if (true) {
    var _cnt_1 = 0;
    game_Game.prototype.debug2 = function () {
        var val = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            val[_i] = arguments[_i];
        }
        console.log(val);
        _cnt_1++;
        if (_cnt_1 > 16)
            throw new debugError["a" /* DebugError */]('too many logs');
    };
}


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ObjectPool; });
/* harmony import */ var _debug_debugError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);

var ObjectPool = (function () {
    function ObjectPool(Class, numberOfInstances) {
        if (numberOfInstances === void 0) { numberOfInstances = 16; }
        this.Class = Class;
        this.numberOfInstances = numberOfInstances;
        this._pool = [];
        if ( true && !Class)
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not instantiate ObjectPool: class not provided in constructor");
    }
    ObjectPool.prototype.getFreeObject = function () {
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
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not get free object: no free object in pool");
        return undefined;
    };
    ObjectPool.prototype.releaseObject = function (obj) {
        var indexOf = this._pool.indexOf(obj);
        if ( true && indexOf === -1) {
            console.error(obj);
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not release the object: it does not belong to the pool");
        }
        this._pool[indexOf].release();
    };
    return ObjectPool;
}());



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export isObject */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return isArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return isEqual; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return removeFromArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return noop; });
var isObject = function (obj) {
    return obj === Object(obj);
};
var isArray = function (a) {
    return !!(a.splice) || !!(a.buffer);
};
var isEqualArray = function (a, b) {
    for (var i = 0, max = a.length; i < max; i++) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
};
var isEqualObject = function (a, b) {
    throw new Error('not implemented');
};
var isEqual = function (a, b) {
    if (a === null || a === undefined)
        return false;
    if (isArray(a) && isArray(b))
        return isEqualArray(a, b);
    else if (isObject(a) && isObject(b))
        return isEqualObject(a, b);
    return a === b;
};
var removeFromArray = function (arr, predicate) {
    var i = arr.length;
    var cnt = 0;
    while (i--) {
        if (predicate(arr[i])) {
            arr.splice(i, 1);
            cnt++;
        }
    }
    return cnt;
};
var noop = function (arg) { };


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MathEx; });
/* harmony import */ var _geometry_point2d__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _engine_geometry_mat4__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);


var MathEx;
(function (MathEx) {
    var Mat16Holder = _engine_geometry_mat4__WEBPACK_IMPORTED_MODULE_1__[/* mat4 */ "a"].Mat16Holder;
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
        return new _geometry_point2d__WEBPACK_IMPORTED_MODULE_0__[/* Point2d */ "a"](center.x - x, center.y - y);
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
        var res = (Math.random() * (max + 1 - min)) + min;
        if (res > max)
            res = max;
        else if (res < min)
            res = min;
        return res;
    };
    MathEx.randomInt = function (min, max) {
        return ~~MathEx.random(min, max);
    };
    MathEx.unProject = function (winPoint, width, height, viewProjectionMatrix) {
        var x = 2.0 * winPoint.x / width - 1;
        var y = 2.0 * winPoint.y / height - 1;
        var viewProjectionInverse = Mat16Holder.fromPool();
        _engine_geometry_mat4__WEBPACK_IMPORTED_MODULE_1__[/* mat4 */ "a"].inverse(viewProjectionInverse, viewProjectionMatrix);
        var point3D = [x, y, 0, 1];
        var res = Mat16Holder.fromPool();
        _engine_geometry_mat4__WEBPACK_IMPORTED_MODULE_1__[/* mat4 */ "a"].multMatrixVec(res, viewProjectionInverse, point3D);
        res.mat16[0] = (res.mat16[0] / 2 + 0.5) * width;
        res.mat16[1] = (res.mat16[1] / 2 + 0.5) * height;
        var result = new _geometry_point2d__WEBPACK_IMPORTED_MODULE_0__[/* Point2d */ "a"](res.mat16[0], res.mat16[1]);
        viewProjectionInverse.release();
        res.release();
        return result;
    };
})(MathEx || (MathEx = {}));


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./engine/debug/debugError.ts
var debugError = __webpack_require__(0);

// CONCATENATED MODULE: ./engine/renderer/webGl/base/vertexBuffer.ts

var vertexBuffer_VertexBuffer = (function () {
    function VertexBuffer(gl) {
        this.bufferItemSize = 0;
        this.bufferItemType = 0;
        this.dataLength = 0;
        if ( true && !gl)
            throw new debugError["a" /* DebugError */]("can not create VertexBuffer, gl context not passed to constructor, expected: VertexBuffer(gl)");
        this.gl = gl;
        this.buffer = gl.createBuffer();
        if ( true && !this.buffer)
            throw new debugError["a" /* DebugError */]("can not allocate memory for vertex buffer");
    }
    VertexBuffer.prototype.setData = function (bufferData, itemType, itemSize) {
        if (true) {
            if (!bufferData)
                throw new debugError["a" /* DebugError */]('can not set data to vertex buffer: bufferData not specified');
            if (!itemType)
                throw new debugError["a" /* DebugError */]('can not set data to vertex buffer: itemType not specified');
            if (!itemSize)
                throw new debugError["a" /* DebugError */]('can not set data to vertex buffer: itemSize not specified');
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
            throw new debugError["a" /* DebugError */]("attrName not provided");
        this.attrName = attrName;
    };
    VertexBuffer.prototype.bind = function (program) {
        if ( true && !program)
            throw new debugError["a" /* DebugError */]("can not bind VertexBuffer, program not specified");
        if ( true && !this.attrName)
            throw new debugError["a" /* DebugError */]("can not bind VertexBuffer, attribute name not specified");
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


// CONCATENATED MODULE: ./engine/renderer/webGl/base/indexBuffer.ts

var indexBuffer_IndexBuffer = (function () {
    function IndexBuffer(gl) {
        if ( true && !gl)
            throw new debugError["a" /* DebugError */]("can not create IndexBuffer, gl context not passed to constructor, expected: IndexBuffer(gl)");
        this.gl = gl;
        this.buffer = gl.createBuffer();
        if ( true && !this.buffer)
            throw new debugError["a" /* DebugError */]("can not allocate memory for index buffer");
    }
    IndexBuffer.prototype.setData = function (bufferData) {
        if (true) {
            if (!bufferData)
                throw new debugError["a" /* DebugError */]('can not set data to buffer: bufferData not specified');
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


// EXTERNAL MODULE: ./engine/renderer/webGl/debug/debugUtil.ts
var debugUtil = __webpack_require__(29);

// CONCATENATED MODULE: ./engine/renderer/webGl/base/bufferInfo.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DRAW_METHOD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return bufferInfo_BufferInfo; });




var glEnumToString = debugUtil["a" /* debugUtil */].glEnumToString;
var DRAW_METHOD;
(function (DRAW_METHOD) {
    DRAW_METHOD[DRAW_METHOD["LINE_STRIP"] = 0] = "LINE_STRIP";
    DRAW_METHOD[DRAW_METHOD["TRIANGLE_FAN"] = 1] = "TRIANGLE_FAN";
    DRAW_METHOD[DRAW_METHOD["TRIANGLE_STRIP"] = 2] = "TRIANGLE_STRIP";
    DRAW_METHOD[DRAW_METHOD["TRIANGLES"] = 3] = "TRIANGLES";
})(DRAW_METHOD || (DRAW_METHOD = {}));
var drawMethodToGlEnum = function (gl, m) {
    switch (m) {
        case DRAW_METHOD.LINE_STRIP:
            return gl.LINE_STRIP;
        case DRAW_METHOD.TRIANGLE_FAN:
            return gl.TRIANGLE_FAN;
        case DRAW_METHOD.TRIANGLE_STRIP:
            return gl.TRIANGLE_STRIP;
        case DRAW_METHOD.TRIANGLES:
            return gl.TRIANGLES;
    }
    if (true) {
        throw new debugError["a" /* DebugError */]("unknown drawMethod enum value: " + m);
    }
};
var bufferInfo_BufferInfo = (function () {
    function BufferInfo(gl, description) {
        this.posVertexBuffer = null;
        this.posIndexBuffer = null;
        this.texVertexBuffer = null;
        this.normalBuffer = null;
        this.numOfElementsToDraw = 0;
        this.gl = gl;
        if ( true && description.drawMethod === undefined)
            throw new debugError["a" /* DebugError */]("can not create BufferInfo: drawMethod not defined");
        this.drawMethod = drawMethodToGlEnum(gl, description.drawMethod);
        if ( true && !description.posVertexInfo)
            throw new debugError["a" /* DebugError */]("can not create BufferInfo: posVertexInfo is mandatory");
        this.posVertexBuffer = new vertexBuffer_VertexBuffer(gl);
        this.posVertexBuffer.setData(description.posVertexInfo.array, description.posVertexInfo.type, description.posVertexInfo.size);
        this.posVertexBuffer.setAttrName(description.posVertexInfo.attrName);
        if (description.posIndexInfo) {
            this.posIndexBuffer = new indexBuffer_IndexBuffer(gl);
            this.posIndexBuffer.setData(description.posIndexInfo.array);
        }
        else
            this.numOfElementsToDraw = this._getNumOfElementsToDraw(this.drawMethod);
        if (description.texVertexInfo) {
            this.texVertexBuffer = new vertexBuffer_VertexBuffer(gl);
            this.texVertexBuffer.setData(description.texVertexInfo.array, description.texVertexInfo.type, description.texVertexInfo.size);
            this.texVertexBuffer.setAttrName(description.texVertexInfo.attrName);
        }
        if (description.normalInfo) {
            this.normalBuffer = new vertexBuffer_VertexBuffer(gl);
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
    BufferInfo.prototype.draw = function () {
        if (this.posIndexBuffer) {
            this.gl.drawElements(this.drawMethod, this.posIndexBuffer.getBufferLength(), this.gl.UNSIGNED_SHORT, 0);
        }
        else {
            this.gl.drawArrays(this.drawMethod, 0, this.numOfElementsToDraw);
        }
    };
    BufferInfo.prototype._getNumOfElementsToDraw = function (drawMethod) {
        switch (drawMethod) {
            case this.gl.LINE_STRIP:
            case this.gl.TRIANGLE_FAN:
                return this.posVertexBuffer.getBufferLength() / 2;
            case this.gl.TRIANGLE_STRIP:
                return this.posVertexBuffer.getBufferLength() / 3;
            case this.gl.TRIANGLES:
                return this.posVertexBuffer.getBufferLength() / this.posVertexBuffer.getItemSize();
            default:
                throw new debugError["a" /* DebugError */]("unknown draw method: " + drawMethod + " (" + glEnumToString(this.gl, drawMethod) + ")");
        }
    };
    return BufferInfo;
}());



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return STRETCH_MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Image; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
/* harmony import */ var _abstract_shape__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(20);
/* harmony import */ var _engine_renderer_color__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
/* harmony import */ var _engine_geometry_point2d__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4);





var STRETCH_MODE;
(function (STRETCH_MODE) {
    STRETCH_MODE[STRETCH_MODE["STRETCH"] = 0] = "STRETCH";
    STRETCH_MODE[STRETCH_MODE["REPEAT"] = 1] = "REPEAT";
})(STRETCH_MODE || (STRETCH_MODE = {}));
var Image = (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__[/* __extends */ "c"](Image, _super);
    function Image(game) {
        var _this = _super.call(this, game) || this;
        _this.type = 'Image';
        _this.borderRadius = 0;
        _this.offset = new _engine_geometry_point2d__WEBPACK_IMPORTED_MODULE_4__[/* Point2d */ "a"]();
        _this.stretchMode = STRETCH_MODE.STRETCH;
        _this.fillColor.set(_engine_renderer_color__WEBPACK_IMPORTED_MODULE_3__[/* Color */ "a"].NONE);
        return _this;
    }
    Image.prototype.revalidate = function () {
        if ( true && !this.getResourceLink()) {
            console.error(this);
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_1__[/* DebugError */ "a"]("can not render Image: resourceLink is not specified");
        }
        if ( true && !this.getResourceLink().getTarget()) {
            console.error(this);
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_1__[/* DebugError */ "a"]("can not render Image: can not find texture by resource link");
        }
        var tex = this.getResourceLink().getTarget();
        if (this.size.isZero()) {
            this.size.width = tex.size.width;
            this.size.height = tex.size.height;
        }
        if (this._srcRect.size.isZero()) {
            this._srcRect.size.width = tex.size.width;
            this._srcRect.size.height = tex.size.height;
        }
    };
    Image.prototype.draw = function () {
        this.game.getRenderer().drawImage(this);
        return true;
    };
    Image.prototype.clone = function () {
        var cloned = new Image(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    };
    Image.prototype.getSrcRect = function () {
        return this._srcRect;
    };
    Image.prototype.setResourceLink = function (link) {
        if ( true && !link) {
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_1__[/* DebugError */ "a"]("can not set resource link: link is not passed");
        }
        this._resourceLink = link;
    };
    Image.prototype.getResourceLink = function () {
        return this._resourceLink;
    };
    Image.prototype.setClonedProperties = function (cloned) {
        cloned._srcRect.set(this._srcRect);
        cloned.borderRadius = this.borderRadius;
        cloned.offset.set(this.offset);
        cloned.stretchMode = this.stretchMode;
        cloned.setResourceLink(this.getResourceLink());
        _super.prototype.setClonedProperties.call(this, cloned);
    };
    return Image;
}(_abstract_shape__WEBPACK_IMPORTED_MODULE_2__[/* Shape */ "a"]));



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AbstractDrawer; });
/* harmony import */ var _engine_misc_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
/* harmony import */ var _engine_misc_fastMap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(35);



var AbstractDrawer = (function () {
    function AbstractDrawer(gl) {
        this.program = null;
        this.uniformCache = new _engine_misc_fastMap__WEBPACK_IMPORTED_MODULE_2__[/* FastMap */ "a"]();
        this.texturesToBind = { length: 0, texturesInfo: [] };
        this.gl = gl;
    }
    AbstractDrawer.prototype.destroy = function () {
        if (this.bufferInfo)
            this.bufferInfo.destroy();
        this.program.destroy();
    };
    AbstractDrawer.prototype.setUniform = function (name, value) {
        if ( true && !name) {
            console.trace();
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_1__[/* DebugError */ "a"]("can not set uniform with value " + value + ": name is not provided");
        }
        if ( true && value === null || value === undefined) {
            console.trace();
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_1__[/* DebugError */ "a"]("can not set uniform with value " + value);
        }
        if (this.uniformCache.has(name) && Object(_engine_misc_object__WEBPACK_IMPORTED_MODULE_0__[/* isEqual */ "b"])(this.uniformCache.get(name).value, value))
            return;
        if (Object(_engine_misc_object__WEBPACK_IMPORTED_MODULE_0__[/* isArray */ "a"])(value)) {
            if (!this.uniformCache.has(name))
                this.uniformCache.put(name, { value: new Array(value.length), dirty: true });
            var uniformInCache = this.uniformCache.get(name);
            var arr = uniformInCache.value;
            for (var i = 0, max = value.length; i < max; i++) {
                arr[i] = value[i];
            }
            uniformInCache.dirty = true;
        }
        else {
            this.uniformCache.put(name, { value: value, dirty: true });
        }
    };
    AbstractDrawer.prototype.attachTexture = function (uniformName, texture) {
        this.texturesToBind.texturesInfo[this.texturesToBind.length++] = { uniformName: uniformName, texture: texture };
    };
    AbstractDrawer.prototype.getAttachedTextureAt = function (i) {
        if ( true && i > this.texturesToBind.length - 1)
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_1__[/* DebugError */ "a"]("ca not find bound texture: out of range: index:" + i + ", length:" + this.texturesToBind);
        return this.texturesToBind.texturesInfo[i].texture;
    };
    AbstractDrawer.prototype.setUniformsFromMap = function (batch) {
        var keys = batch.getKeys();
        var values = batch.getValues();
        for (var i = 0; i < keys.length; i++) {
            this.setUniform(keys[i], values[i]);
        }
    };
    AbstractDrawer.prototype.draw = function () {
        this.bind();
        var keys = this.uniformCache.getKeys();
        var values = this.uniformCache.getValues();
        for (var i = 0; i < keys.length; i++) {
            if (!values[i].dirty)
                continue;
            this._setUniform(keys[i], values[i].value);
            values[i].dirty = false;
        }
        for (var i = 0, max = this.texturesToBind.length; i < max; i++) {
            var t = this.texturesToBind.texturesInfo[i];
            t.texture.bind(t.uniformName, i, this.program);
        }
        this.texturesToBind.length = 0;
        this.drawElements();
    };
    AbstractDrawer.prototype.bind = function () {
        if ( true && !this.program) {
            console.error(this);
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_1__[/* DebugError */ "a"]("can not init drawer: initProgram method must be invoked!");
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
    AbstractDrawer.prototype.drawElements = function () {
        this.bufferInfo.draw();
    };
    AbstractDrawer.prototype._setUniform = function (name, value) {
        this.program.setUniform(name, value);
    };
    AbstractDrawer.currentInstance = null;
    return AbstractDrawer;
}());



/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ResourceLink; });
var ResourceLink = (function () {
    function ResourceLink(url) {
        this.url = url;
    }
    ResourceLink.prototype.getUrl = function () {
        return this.url;
    };
    ResourceLink.prototype.setTarget = function (t) {
        this.target = t;
    };
    ResourceLink.prototype.getTarget = function () {
        return this.target;
    };
    return ResourceLink;
}());



/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ObservableEntity; });
/* harmony import */ var _engine_misc_object__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);

var ObservableEntity = (function () {
    function ObservableEntity() {
        this._onChanged = [];
        this._silent = false;
        this._captured = false;
    }
    ObservableEntity.prototype.silent = function (val) {
        this._silent = val;
        return this;
    };
    ObservableEntity.prototype.isCaptured = function () {
        return this._captured;
    };
    ObservableEntity.prototype.capture = function () {
        this._captured = true;
        return this;
    };
    ObservableEntity.prototype.release = function () {
        this._captured = false;
        return this;
    };
    ObservableEntity.prototype.forceTriggerChange = function () {
        for (var _i = 0, _a = this._onChanged; _i < _a.length; _i++) {
            var fn = _a[_i];
            fn();
        }
    };
    ObservableEntity.prototype.addOnChangeListener = function (f) {
        this._onChanged.push(f);
    };
    ObservableEntity.prototype.removeOnChangeListener = function (f) {
        Object(_engine_misc_object__WEBPACK_IMPORTED_MODULE_0__[/* removeFromArray */ "d"])(this._onChanged, function (it) { return it === f; });
    };
    ObservableEntity.prototype.observe = function (onChangedFn) {
        this.addOnChangeListener(onChangedFn);
    };
    ObservableEntity.prototype.triggerObservable = function () {
        if (this._silent)
            return;
        for (var _i = 0, _a = this._onChanged; _i < _a.length; _i++) {
            var fn = _a[_i];
            fn();
        }
    };
    return ObservableEntity;
}());



/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShaderProgram; });
/* harmony import */ var _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _shaderProgramUtils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);


var ShaderProgram = (function () {
    function ShaderProgram(gl, vertexSource, fragmentSource) {
        var vShader = Object(_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_1__[/* compileShader */ "b"])(gl, vertexSource, gl.VERTEX_SHADER);
        var fShader = Object(_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_1__[/* compileShader */ "b"])(gl, fragmentSource, gl.FRAGMENT_SHADER);
        this.program = Object(_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_1__[/* createProgram */ "c"])(gl, vShader, fShader);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);
        this.uniforms = Object(_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_1__[/* extractUniforms */ "e"])(gl, this);
        this.attributes = Object(_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_1__[/* extractAttributes */ "d"])(gl, this);
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
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("no uniform name was provided!");
        }
        var uniformWrapper = this.uniforms[name];
        if ( true && !uniformWrapper) {
            console.error('shader program failed', this);
            console.error('uniforms', this.uniforms);
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("no uniform with name " + name + " found!");
        }
        if (true) {
            if (ShaderProgram.currentProgram !== this) {
                console.error(this);
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not set uniform: target program is inactive");
            }
        }
        uniformWrapper.setter(this.gl, uniformWrapper.location, value);
    };
    ShaderProgram.prototype.bindBuffer = function (buffer, attrName) {
        if (true) {
            if (!attrName)
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not find attribute location: attrName not defined");
            if (this.attributes[attrName] === undefined) {
                console.log(this);
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not find attribute location for  " + attrName);
            }
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.getGlBuffer());
        var attrLocation = this.attributes[attrName];
        this.enableAttribute(attrName);
        this.gl.vertexAttribPointer(attrLocation, buffer.getItemSize(), buffer.getItemType(), false, 0, 0);
    };
    ShaderProgram.prototype.disableAttribute = function (attrName) {
        this.toggleAttribute(attrName, false);
    };
    ShaderProgram.prototype.enableAttribute = function (attrName) {
        this.toggleAttribute(attrName, true);
    };
    ShaderProgram.prototype.destroy = function () {
        this.gl.deleteProgram(this.program);
    };
    ShaderProgram.prototype.toggleAttribute = function (attrName, on) {
        if (this.attributes[attrName] === undefined) {
            console.log(this);
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("unbind error: can not find attribute location for  " + attrName);
        }
        var attrLocation = this.attributes[attrName];
        if (on)
            this.gl.enableVertexAttribArray(attrLocation);
        else
            this.gl.disableVertexAttribArray(attrLocation);
    };
    ShaderProgram.currentProgram = null;
    return ShaderProgram;
}());



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Shape; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _abstract_renderableModel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _engine_renderer_color__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);



var Shape = (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__[/* __extends */ "c"](Shape, _super);
    function Shape(game) {
        var _this = _super.call(this, game) || this;
        _this.color = _engine_renderer_color__WEBPACK_IMPORTED_MODULE_2__[/* Color */ "a"].BLACK.clone();
        _this.lineWidth = 0;
        _this.fillColor = _engine_renderer_color__WEBPACK_IMPORTED_MODULE_2__[/* Color */ "a"].RGB(100, 100, 100);
        _this.filters = [];
        return _this;
    }
    Shape.prototype.setWH = function (w, h) {
        if (h === void 0) { h = w; }
        this.setXYWH(this.pos.x, this.pos.y, w, h);
    };
    Shape.prototype.setXYWH = function (x, y, w, h) {
        this.pos.setXY(x, y);
        this.size.setWH(w, h);
        this.getSrcRect().setXYWH(x, y, w, h);
    };
    Shape.prototype.setClonedProperties = function (cloned) {
        cloned.color.set(this.color);
        cloned.lineWidth = this.lineWidth;
        if (!cloned.fillColor)
            cloned.fillColor = this.fillColor.clone();
        else
            cloned.fillColor.set(this.fillColor);
        cloned.filters = this.filters.slice();
        _super.prototype.setClonedProperties.call(this, cloned);
    };
    return Shape;
}(_abstract_renderableModel__WEBPACK_IMPORTED_MODULE_1__[/* RenderableModel */ "b"]));



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export INTERPOLATION_MODE */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Texture; });
/* harmony import */ var _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _engine_geometry_size__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);


var isPowerOf2 = function (value) {
    return (value & (value - 1)) === 0;
};
var INTERPOLATION_MODE;
(function (INTERPOLATION_MODE) {
    INTERPOLATION_MODE[INTERPOLATION_MODE["NEAREST"] = 0] = "NEAREST";
    INTERPOLATION_MODE[INTERPOLATION_MODE["LINEAR"] = 1] = "LINEAR";
})(INTERPOLATION_MODE || (INTERPOLATION_MODE = {}));
var Texture = (function () {
    function Texture(gl) {
        this.size = new _engine_geometry_size__WEBPACK_IMPORTED_MODULE_1__[/* Size */ "a"](0, 0);
        this.tex = null;
        this._currentTextureAt0 = null;
        if ( true && !gl)
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not create Texture, gl context not passed to constructor, expected: Texture(gl)");
        this.gl = gl;
        if (true) {
            if (!Texture.MAX_TEXTURE_IMAGE_UNITS)
                Texture.MAX_TEXTURE_IMAGE_UNITS = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        }
        this.tex = gl.createTexture();
        if ( true && !this.tex)
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not allocate memory for texture");
        this.setRawData(new Uint8Array([0, 255, 0, 255]), 1, 1);
    }
    Texture.prototype.setImage = function (img, width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        var gl = this.gl;
        if (true) {
            if (!(img || width || height))
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("texture.setImage: if image is null, width and height must be specified: tex.setImage(null,w,h)");
            var maxSupportedSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            if (width > maxSupportedSize || height > maxSupportedSize) {
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not create texture with size " + width + "x" + height + ", max supported size is " + maxSupportedSize);
            }
        }
        if (img)
            this.size.setWH(img.width, img.height);
        else
            this.size.setWH(width, height);
        this.beforeOperation();
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        if (img) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        }
        else {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        this.setFilters();
        this.setInterpolationMode(INTERPOLATION_MODE.LINEAR);
        this.afterOperation();
    };
    Texture.prototype.setRawData = function (data, width, height, mode) {
        if (mode === void 0) { mode = INTERPOLATION_MODE.LINEAR; }
        if (true) {
            var numOfBytes = width * height * 4;
            if (data.length !== numOfBytes) {
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("unexpected Uint8Array length, expected width*height*4 (" + width + "*" + height + "*4=" + numOfBytes + "), but is found " + data.length);
            }
        }
        var gl = this.gl;
        this.beforeOperation();
        this.size.setWH(width, height);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        this.setFilters();
        this.setInterpolationMode(mode);
        this.afterOperation();
    };
    Texture.prototype.bind = function (name, i, program) {
        if (true) {
            if (!name) {
                console.error(this);
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not bind texture: uniform name was not provided");
            }
            if (i > Texture.MAX_TEXTURE_IMAGE_UNITS - 1) {
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not bind texture with index " + i + ". Max supported value by device is " + Texture.MAX_TEXTURE_IMAGE_UNITS);
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
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("Texture.GetColorArray() failed!");
        var pixels = new Uint8Array(wxh * 4);
        gl.readPixels(0, 0, this.size.width, this.size.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        return pixels;
    };
    Texture.prototype.destroy = function () {
        this.gl.deleteTexture(this.tex);
    };
    Texture.prototype.getGlTexture = function () {
        return this.tex;
    };
    Texture.prototype.setInterpolationMode = function (mode) {
        if (mode === this.interpolationMode)
            return;
        this.beforeOperation();
        var gl = this.gl;
        var glMode;
        switch (mode) {
            case INTERPOLATION_MODE.LINEAR:
                glMode = gl.LINEAR;
                break;
            case INTERPOLATION_MODE.NEAREST:
                glMode = gl.NEAREST;
                break;
            default:
                if (true)
                    throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("unknown interpolation mode " + mode);
                break;
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glMode);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glMode);
        this.interpolationMode = mode;
        this.afterOperation();
    };
    Texture.prototype.beforeOperation = function () {
        if (this._currentTextureAt0 !== null)
            return;
        this._currentTextureAt0 = Texture.currInstances[0];
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.tex);
    };
    Texture.prototype.afterOperation = function () {
        if (this._currentTextureAt0)
            this.gl.bindTexture(this.gl.TEXTURE_2D, this._currentTextureAt0.tex);
        else
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this._currentTextureAt0 = null;
    };
    Texture.prototype.setFilters = function () {
        var gl = this.gl;
        var isPowerOfTwo = (isPowerOf2(this.size.width) && isPowerOf2(this.size.height));
        if (isPowerOfTwo) {
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }
        else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
    };
    Texture.currInstances = {};
    Texture.MAX_TEXTURE_IMAGE_UNITS = 0;
    return Texture;
}());



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CAMERA_MATRIX_MODE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Camera; });
/* harmony import */ var _debug_debugError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _misc_tween__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(25);
/* harmony import */ var _misc_mathEx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(13);
/* harmony import */ var _geometry_rect__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
/* harmony import */ var _geometry_point2d__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4);
/* harmony import */ var _engine_geometry_mat4__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(3);






var Mat16Holder = _engine_geometry_mat4__WEBPACK_IMPORTED_MODULE_5__[/* mat4 */ "a"].Mat16Holder;
var CAMERA_MATRIX_MODE;
(function (CAMERA_MATRIX_MODE) {
    CAMERA_MATRIX_MODE[CAMERA_MATRIX_MODE["MODE_TRANSFORM"] = 0] = "MODE_TRANSFORM";
    CAMERA_MATRIX_MODE[CAMERA_MATRIX_MODE["MODE_IDENTITY"] = 1] = "MODE_IDENTITY";
})(CAMERA_MATRIX_MODE || (CAMERA_MATRIX_MODE = {}));
var DIRECTION_CORRECTION;
(function (DIRECTION_CORRECTION) {
    DIRECTION_CORRECTION[DIRECTION_CORRECTION["RIGHT"] = 0] = "RIGHT";
    DIRECTION_CORRECTION[DIRECTION_CORRECTION["LEFT"] = 1] = "LEFT";
    DIRECTION_CORRECTION[DIRECTION_CORRECTION["UP"] = 2] = "UP";
    DIRECTION_CORRECTION[DIRECTION_CORRECTION["DOWN"] = 3] = "DOWN";
})(DIRECTION_CORRECTION || (DIRECTION_CORRECTION = {}));
var Camera = (function () {
    function Camera(game) {
        var _this = this;
        this.game = game;
        this.pos = new _geometry_point2d__WEBPACK_IMPORTED_MODULE_4__[/* Point2d */ "a"](0, 0);
        this.posZ = 0;
        this.scale = new _geometry_point2d__WEBPACK_IMPORTED_MODULE_4__[/* Point2d */ "a"](1, 1);
        this.matrixMode = CAMERA_MATRIX_MODE.MODE_TRANSFORM;
        this._rect = new _geometry_rect__WEBPACK_IMPORTED_MODULE_3__[/* Rect */ "a"]();
        this._rectIdentity = new _geometry_rect__WEBPACK_IMPORTED_MODULE_3__[/* Rect */ "a"]();
        this._rectScaled = new _geometry_rect__WEBPACK_IMPORTED_MODULE_3__[/* Rect */ "a"]();
        this.cameraShakeTween = null;
        this.cameraPosCorrection = {
            current: new _geometry_point2d__WEBPACK_IMPORTED_MODULE_4__[/* Point2d */ "a"](),
            max: new _geometry_point2d__WEBPACK_IMPORTED_MODULE_4__[/* Point2d */ "a"]()
        };
        this._updateRect();
        this.scale.observe(function () {
            _this.revalidate();
        });
    }
    Camera.prototype.revalidate = function () {
        this._rectIdentity.setXYWH(0, 0, this.game.width, this.game.height);
    };
    Camera.prototype.followTo = function (gameObject) {
        if (gameObject === null) {
            this.objFollowTo = null;
            return;
        }
        if ( true && gameObject === undefined)
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("Camera:followTo(gameObject) - gameObject not provided");
        this.objFollowTo = gameObject;
        this.objFollowToPrevPos = new _geometry_point2d__WEBPACK_IMPORTED_MODULE_4__[/* Point2d */ "a"]();
        this.objFollowToPrevPos.set(this.objFollowTo.pos);
        this.revalidate();
    };
    Camera.prototype.update = function () {
        var gameObject = this.objFollowTo;
        if (gameObject) {
            if ((gameObject.pos.x - this.objFollowToPrevPos.x) > 0)
                this.directionCorrection = DIRECTION_CORRECTION.RIGHT;
            else if ((gameObject.pos.x - this.objFollowToPrevPos.x) < 0)
                this.directionCorrection = DIRECTION_CORRECTION.LEFT;
            if ((gameObject.pos.y - this.objFollowToPrevPos.y) > 0)
                this.directionCorrection = DIRECTION_CORRECTION.DOWN;
            else if ((gameObject.pos.y - this.objFollowToPrevPos.y) < 0)
                this.directionCorrection = DIRECTION_CORRECTION.UP;
            this.objFollowToPrevPos.set(gameObject.pos);
            var _a = this.getRectScaled().size, wScaled = _a.width, hScaled = _a.height;
            if (this.directionCorrection === DIRECTION_CORRECTION.RIGHT)
                this.cameraPosCorrection.max.x = wScaled / 3;
            else if (this.directionCorrection === DIRECTION_CORRECTION.LEFT)
                this.cameraPosCorrection.max.x = -wScaled / 3;
            else if (this.directionCorrection === DIRECTION_CORRECTION.DOWN)
                this.cameraPosCorrection.max.y = hScaled / 3;
            else if (this.directionCorrection === DIRECTION_CORRECTION.UP)
                this.cameraPosCorrection.max.y = -hScaled / 3;
            var currCorrection = this.cameraPosCorrection.max.
                substract(this.cameraPosCorrection.current).
                multiply(0.05);
            this.cameraPosCorrection.current.add(currCorrection);
            var newPos = _geometry_point2d__WEBPACK_IMPORTED_MODULE_4__[/* Point2d */ "a"].fromPool();
            var pointToFollow = _geometry_point2d__WEBPACK_IMPORTED_MODULE_4__[/* Point2d */ "a"].fromPool();
            var scene = this.game.getCurrScene();
            var w = this.game.width;
            var h = this.game.height;
            var wDiv2 = w / 2;
            var hDiv2 = h / 2;
            pointToFollow.set(this.objFollowTo.pos);
            pointToFollow.addXY(-wDiv2, -hDiv2);
            newPos.x = this.pos.x + (pointToFollow.x + this.cameraPosCorrection.current.x - this.pos.x) * Camera.FOLLOW_FACTOR;
            newPos.y = this.pos.y + (pointToFollow.y + this.cameraPosCorrection.current.y - this.pos.y) * Camera.FOLLOW_FACTOR;
            if (newPos.x < 0)
                newPos.x = 0;
            if (newPos.y < 0)
                newPos.y = 0;
            if (newPos.x > scene.width - w)
                newPos.x = scene.width - w;
            if (newPos.y > scene.height - h)
                newPos.y = scene.height - h;
            this.pos.set(newPos);
            newPos.release();
            pointToFollow.release();
        }
        if (this.cameraShakeTween)
            this.cameraShakeTween.update();
        this._updateRect();
    };
    Camera.prototype.shake = function (amplitude, time) {
        var _this = this;
        var tweenTarget = { time: 0, point: new _geometry_point2d__WEBPACK_IMPORTED_MODULE_4__[/* Point2d */ "a"](0, 0) };
        this.cameraShakeTween = new _misc_tween__WEBPACK_IMPORTED_MODULE_1__[/* Tween */ "a"]({
            target: tweenTarget,
            time: time,
            to: { time: time },
            progress: function () {
                var r1 = _misc_mathEx__WEBPACK_IMPORTED_MODULE_2__[/* MathEx */ "a"].random(-amplitude / 2, amplitude / 2);
                var r2 = _misc_mathEx__WEBPACK_IMPORTED_MODULE_2__[/* MathEx */ "a"].random(-amplitude / 2, amplitude / 2);
                tweenTarget.point.setXY(r1, r2);
            },
            complete: function () { return _this.cameraShakeTween = null; }
        });
    };
    Camera.prototype._updateRect = function () {
        var p = _geometry_point2d__WEBPACK_IMPORTED_MODULE_4__[/* Point2d */ "a"].fromPool();
        var point00 = this.screenToWorld(p.setXY(0, 0));
        var pointWH = this.screenToWorld(p.setXY(this.game.width, this.game.height));
        this._rectScaled.setXYWH(point00.x, point00.y, pointWH.x - point00.x, pointWH.y - point00.y);
        p.release();
    };
    Camera.prototype.render = function () {
        var renderer = this.game.getRenderer();
        if (!this.scale.equal(1)) {
            renderer.translate(this.game.width / 2, this.game.height / 2, this.posZ);
            renderer.scale(this.scale.x, this.scale.y);
            renderer.translate(-this.game.width / 2, -this.game.height / 2);
        }
        if (!this.pos.equal(0))
            renderer.translate(-this.pos.x, -this.pos.y, 0);
        if (this.cameraShakeTween !== null)
            renderer.translate(this.cameraShakeTween.getTarget().point.x, this.cameraShakeTween.getTarget().point.y);
    };
    Camera.prototype.screenToWorld = function (p) {
        var mScale = Mat16Holder.fromPool();
        _engine_geometry_mat4__WEBPACK_IMPORTED_MODULE_5__[/* mat4 */ "a"].makeScale(mScale, this.scale.x, this.scale.y, 1);
        var point2d = _misc_mathEx__WEBPACK_IMPORTED_MODULE_2__[/* MathEx */ "a"].unProject(p, this.game.width, this.game.height, mScale);
        point2d.add(this.pos);
        mScale.release();
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
    Camera.FOLLOW_FACTOR = 0.1;
    return Camera;
}());



/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Rectangle; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _abstract_shape__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(20);


var Rectangle = (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__[/* __extends */ "c"](Rectangle, _super);
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
    Rectangle.prototype.clone = function () {
        var cloned = new Rectangle(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    };
    Rectangle.prototype.setClonedProperties = function (cloned) {
        cloned.borderRadius = this.borderRadius;
        cloned.size.set(this.size);
        cloned.lineWidth = this.lineWidth;
        _super.prototype.setClonedProperties.call(this, cloned);
    };
    return Rectangle;
}(_abstract_shape__WEBPACK_IMPORTED_MODULE_1__[/* Shape */ "a"]));



/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EventEmitterDelegate; });
/* harmony import */ var _engine_control_mouse_mouseEvents__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);
/* harmony import */ var _engine_misc_eventEmitter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(36);
/* harmony import */ var _engine_game__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(10);




var EventEmitterDelegate = (function () {
    function EventEmitterDelegate() {
    }
    EventEmitterDelegate.prototype.on = function (eventName, callBack) {
        if ( true && !_engine_game__WEBPACK_IMPORTED_MODULE_3__[/* Game */ "a"].getInstance().hasControl('MouseControl')) {
            if (eventName in _engine_control_mouse_mouseEvents__WEBPACK_IMPORTED_MODULE_0__[/* MOUSE_EVENTS */ "a"]) {
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_1__[/* DebugError */ "a"]('can not listen mouse events: mouse control is not added');
            }
        }
        if (this._emitter === undefined)
            this._emitter = new _engine_misc_eventEmitter__WEBPACK_IMPORTED_MODULE_2__[/* EventEmitter */ "a"]();
        this._emitter.on(eventName, callBack);
        return callBack;
    };
    EventEmitterDelegate.prototype.off = function (eventName, callBack) {
        if (this._emitter !== undefined)
            this._emitter.off(eventName, callBack);
    };
    EventEmitterDelegate.prototype.trigger = function (eventName, data) {
        if (this._emitter !== undefined)
            this._emitter.trigger(eventName, data);
    };
    return EventEmitterDelegate;
}());



/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./engine/misc/easing/linear.ts
var Easing;
(function (Easing) {
    Easing.linear = function (t, b, c, d) { return c * t / d + b; };
})(Easing || (Easing = {}));

// EXTERNAL MODULE: ./engine/game.ts + 1 modules
var game = __webpack_require__(10);

// CONCATENATED MODULE: ./engine/misc/tween.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return tween_Tween; });


var _accessByPath = function (obj, path) {
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
    var _a = _accessByPath(obj, path), targetObj = _a.targetObj, targetKey = _a.targetKey;
    targetObj[targetKey] = val;
};
var getValByPath = function (obj, path) {
    var _a = _accessByPath(obj, path), targetObj = _a.targetObj, targetKey = _a.targetKey;
    return targetObj[targetKey];
};
var tween_Tween = (function () {
    function Tween(tweenDesc) {
        this._propsToChange = [];
        this._startedTime = 0;
        this._currTime = 0;
        this._completed = false;
        this._delayBeforeStart = 0;
        this._target = tweenDesc.target;
        this._progressFn = tweenDesc.progress;
        this._completeFn = tweenDesc.complete;
        this._easeFn = tweenDesc.ease || Easing.linear;
        this._delayBeforeStart = tweenDesc.delayBeforeStart || 0;
        this._tweenTime = (tweenDesc.time || 1000) + this._delayBeforeStart;
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
        var currTime = game["a" /* Game */].getInstance().getTime();
        this._currTime = currTime;
        if (!this._startedTime)
            this._startedTime = currTime;
        var curTweenTime = currTime - this._startedTime;
        if (curTweenTime < this._delayBeforeStart)
            return;
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
        if (this._progressFn)
            this._progressFn(this._target);
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
        if (this._progressFn)
            this._progressFn(this._target);
        if (this._completeFn)
            this._completeFn(this._target);
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
    Tween.prototype.progress = function (_progressFn) {
        this._progressFn = _progressFn;
    };
    return Tween;
}());



/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export OVERFLOW */
/* unused harmony export LAYOUT_SIZE */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Container; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _engine_geometry_rect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _abstract_renderableModel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);
/* harmony import */ var _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(0);




var OVERFLOW;
(function (OVERFLOW) {
    OVERFLOW[OVERFLOW["HIDDEN"] = 0] = "HIDDEN";
    OVERFLOW[OVERFLOW["VISIBLE"] = 1] = "VISIBLE";
})(OVERFLOW || (OVERFLOW = {}));
var LAYOUT_SIZE;
(function (LAYOUT_SIZE) {
    LAYOUT_SIZE[LAYOUT_SIZE["FIXED"] = 0] = "FIXED";
    LAYOUT_SIZE[LAYOUT_SIZE["WRAP_CONTENT"] = 1] = "WRAP_CONTENT";
    LAYOUT_SIZE[LAYOUT_SIZE["MATCH_PARENT"] = 2] = "MATCH_PARENT";
})(LAYOUT_SIZE || (LAYOUT_SIZE = {}));
var Container = (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__[/* __extends */ "c"](Container, _super);
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
        _this.drawingRect = new _engine_geometry_rect__WEBPACK_IMPORTED_MODULE_1__[/* Rect */ "a"]();
        _this.maxWidth = 0;
        _this.maxHeight = 0;
        return _this;
    }
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
    Container.prototype.testLayout = function () {
        if (true) {
            if (this.layoutWidth === LAYOUT_SIZE.FIXED && this.size.width === 0)
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_3__[/* DebugError */ "a"]("layoutWidth is LAYOUT_SIZE.FIXED so width must be specified");
            if (this.layoutHeight === LAYOUT_SIZE.FIXED && this.size.height === 0)
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_3__[/* DebugError */ "a"]("layoutHeight is LAYOUT_SIZE.FIXED so height must be specified");
        }
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
        this.calcWorldRect();
        if (this.background)
            this.background.size.set(this.size);
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
        this.calcWorldRect();
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
    Container.prototype.calcWorldRect = function () {
        this._srcRect.setXYWH(this.pos.x, this.pos.y, this.size.width + this.marginLeft + this.marginRight, this.size.height + this.marginTop + this.marginBottom);
        this._screenRect.set(this._srcRect);
        var parent = this.parent;
        while (parent) {
            this._screenRect.addXY(parent.getSrcRect().point.x, parent.getSrcRect().point.y);
            parent = parent.parent;
        }
    };
    return Container;
}(_abstract_renderableModel__WEBPACK_IMPORTED_MODULE_2__[/* RenderableModel */ "b"]));



/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Incrementer; });
var val = 0;
var Incrementer = (function () {
    function Incrementer() {
    }
    Incrementer.getValue = function () {
        return val++;
    };
    return Incrementer;
}());



/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TweenableDelegate; });
/* harmony import */ var _engine_misc_tween__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25);

var TweenableDelegate = (function () {
    function TweenableDelegate() {
    }
    TweenableDelegate.prototype.tween = function (desc) {
        var t = new _engine_misc_tween__WEBPACK_IMPORTED_MODULE_0__[/* Tween */ "a"](desc);
        if (!this._tweens)
            this._tweens = [];
        this._tweens.push(t);
        return t;
    };
    TweenableDelegate.prototype.addTween = function (t) {
        if (!this._tweens)
            this._tweens = [];
        this._tweens.push(t);
    };
    TweenableDelegate.prototype.addTweenMovie = function (tm) {
        if (!this._tweenMovies)
            this._tweenMovies = [];
        this._tweenMovies.push(tm);
    };
    TweenableDelegate.prototype.update = function () {
        var _this = this;
        if (this._tweens)
            this._tweens.forEach(function (t, index) {
                t.update();
                if (t.isCompleted())
                    _this._tweens.splice(index, 1);
            });
        if (this._tweenMovies)
            this._tweenMovies.forEach(function (t, index) {
                t.update();
                if (t.isCompleted())
                    _this._tweenMovies.splice(index, 1);
            });
    };
    return TweenableDelegate;
}());



/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return debugUtil; });
var debugUtil;
(function (debugUtil) {
    var map;
    debugUtil.glEnumToString = function (gl, glEnum) {
        if (!map && true) {
            map = {};
            var keymap = gl;
            for (var k in keymap) {
                if (isFinite(keymap[k]))
                    map[keymap[k]] = k;
            }
        }
        return map[glEnum];
    };
})(debugUtil || (debugUtil = {}));


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShaderGenerator; });
/* harmony import */ var _base_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

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
        return Object(_base_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_0__[/* normalizeUniformName */ "f"])(name);
    };
    ShaderGenerator.prototype.addFragmentUniform = function (type, name, extractArrayName) {
        if (extractArrayName === void 0) { extractArrayName = false; }
        this.fragmentUniforms.push({ type: type, name: name });
        name = Object(_base_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_0__[/* normalizeUniformName */ "f"])(name);
        if (extractArrayName)
            name = name.split('[')[0];
        return name;
    };
    ShaderGenerator.prototype.addAttribute = function (type, name) {
        this.attributes.push({ type: type, name: name });
        return Object(_base_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_0__[/* normalizeUniformName */ "f"])(name);
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
    };
    ShaderGenerator.prototype.setFragmentMainFn = function (fnCode) {
        this.fragmentMainFn = fnCode;
    };
    ShaderGenerator.prototype.getVertexSource = function () {
        return ("\nprecision mediump float;\n\n" + this.prependedVertexCodeBlocks.map(function (v) { return "" + v; }).join('\n') + "\n\n" + this.vertexUniforms.map(function (u) { return "uniform   " + u.type + " " + u.name + ";"; }).join('\n') + "\n" + this.attributes.map(function (u) { return "attribute " + u.type + " " + u.name + ";"; }).join('\n') + "\n" + this.varyings.map(function (u) { return "varying   " + u.type + " " + u.name + ";"; }).join('\n') + "\n" + this.appendedVertexCodeBlocks.map(function (v) { return "" + v; }).join('\n') + "\n\n" + this.vertexMainFn);
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



/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Plane; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _abstractPrimitive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(37);


var Plane = (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__[/* __extends */ "c"](Plane, _super);
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
}(_abstractPrimitive__WEBPACK_IMPORTED_MODULE_1__[/* AbstractPrimitive */ "a"]));



/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./engine/resources/incrementer.ts
var incrementer = __webpack_require__(27);

// EXTERNAL MODULE: ./engine/resources/loaderUtil.ts
var loaderUtil = __webpack_require__(42);

// EXTERNAL MODULE: ./engine/resources/resourceLink.ts
var resourceLink = __webpack_require__(17);

// EXTERNAL MODULE: ./engine/debug/debugError.ts
var debugError = __webpack_require__(0);

// CONCATENATED MODULE: ./engine/resources/queue.ts

var queue_Queue = (function () {
    function Queue() {
        this.tasksResolved = 0;
        this.tasks = [];
        this.tasksProgressById = {};
        this.completed = false;
        this.nextTaskIndex = 0;
    }
    Queue.prototype.resolveTask = function (taskId) {
        if (true) {
            if (this.tasksProgressById[taskId] === undefined)
                throw new debugError["a" /* DebugError */]("can not resolve task: no task with id " + taskId);
            if (this.tasksProgressById[taskId] === 1)
                throw new debugError["a" /* DebugError */]("task with id " + taskId + " resolved already");
        }
        this.tasksResolved++;
        this.tasksProgressById[taskId] = 1;
        if (this.tasks.length === this.tasksResolved) {
            if (this.onProgress)
                this.onProgress(1);
            this.completed = true;
            if (this.onResolved)
                this.onResolved();
        }
        else {
            if (this.onProgress)
                this.onProgress(this.calcProgress());
            this.tasks[this.nextTaskIndex++]();
        }
    };
    Queue.prototype.addTask = function (taskFn, taskId) {
        if (this.tasksProgressById[taskId] !== undefined)
            return;
        this.tasks.push(taskFn);
        this.tasksProgressById[taskId] = 0;
    };
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
            if (this.onResolved)
                this.onResolved();
        }
        else {
            this.tasks[this.nextTaskIndex++]();
        }
    };
    Queue.prototype.size = function () {
        return this.tasks.length;
    };
    return Queue;
}());


// CONCATENATED MODULE: ./engine/resources/resourceLoader.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return resourceLoader_ResourceLoader; });
var loadRaw = loaderUtil["a" /* LoaderUtil */].loadRaw;




var resourceLoader_ResourceLoader = (function () {
    function ResourceLoader(game) {
        this.game = game;
        this.q = new queue_Queue();
        this.game = game;
    }
    ResourceLoader.prototype.loadImage = function (url) {
        var _this = this;
        var link = new resourceLink["a" /* ResourceLink */](url);
        this.q.addTask(function () {
            _this.game.getRenderer().loadTextureInfo(url, link, function () { return _this.q.resolveTask(url); });
        }, url);
        return link;
    };
    ResourceLoader.prototype.loadText = function (url) {
        var link = new resourceLink["a" /* ResourceLink */](url);
        this._loadText(url, function (data) { return link.setTarget(data); });
        return link;
    };
    ResourceLoader.prototype.loadJSON = function (url) {
        var link = new resourceLink["a" /* ResourceLink */](url);
        this._loadText(url, function (data) { return link.setTarget(JSON.parse(data)); });
        return link;
    };
    ResourceLoader.prototype.loadSound = function (url) {
        var _this = this;
        var link = new resourceLink["a" /* ResourceLink */](url);
        this.q.addTask(function () {
            _this.game.getAudioPlayer().loadSound(url, link, function () { return _this.q.resolveTask(url); });
        }, url);
        return link;
    };
    ResourceLoader.prototype.loadBinary = function (url) {
        var _this = this;
        var link = new resourceLink["a" /* ResourceLink */](url);
        this.q.addTask(function () {
            loadRaw(url, "arraybuffer", function (buff) {
                link.setTarget(buff);
                _this.q.resolveTask(url);
            });
        }, url);
        return link;
    };
    ResourceLoader.prototype.addNextTask = function (task) {
        var _this = this;
        var id = Date.now() + "_" + incrementer["a" /* Incrementer */].getValue();
        this.q.addTask(function () {
            task();
            _this.q.resolveTask(id);
        }, id);
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
    ResourceLoader.prototype._loadText = function (url, callback) {
        var _this = this;
        this.q.addTask(function () {
            loadRaw(url, "text", function (data) {
                callback(data);
                _this.q.resolveTask(url);
            });
        }, url);
    };
    return ResourceLoader;
}());



/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./engine/game.ts + 1 modules
var game = __webpack_require__(10);

// EXTERNAL MODULE: ./engine/misc/object.ts
var object = __webpack_require__(12);

// CONCATENATED MODULE: ./engine/misc/timer.ts


var timer_Timer = (function () {
    function Timer(parent, callback, interval, once) {
        this.parent = parent;
        this.once = once;
        this.lastTime = 0;
        this.interval = interval;
        this.callback = callback;
    }
    Timer.prototype.onUpdate = function () {
        var time = game["a" /* Game */].getInstance().getTime();
        if (!this.lastTime)
            this.lastTime = time;
        var delta = time - this.lastTime;
        if (delta !== 0 && delta > this.interval) {
            this.lastTime = time;
            this.callback();
            if (this.once)
                this.kill();
        }
    };
    Timer.prototype.kill = function () {
        var _this = this;
        Object(object["d" /* removeFromArray */])(this.parent.getTimers(), function (it) { return it === _this; });
    };
    return Timer;
}());


// CONCATENATED MODULE: ./engine/delegates/timerDelegate.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return timerDelegate_TimerDelegate; });

var timerDelegate_TimerDelegate = (function () {
    function TimerDelegate() {
    }
    TimerDelegate.prototype.setInterval = function (callback, interval) {
        return this._addTimer(callback, interval, false);
    };
    TimerDelegate.prototype.setTimeout = function (callback, interval) {
        return this._addTimer(callback, interval, true);
    };
    TimerDelegate.prototype.getTimers = function () {
        return this._timers;
    };
    TimerDelegate.prototype.update = function () {
        if (!this._timers)
            return;
        for (var _i = 0, _a = this._timers; _i < _a.length; _i++) {
            var t = _a[_i];
            t.onUpdate();
        }
    };
    TimerDelegate.prototype._addTimer = function (callback, interval, once) {
        var t = new timer_Timer(this, callback, interval, once);
        if (!this._timers)
            this._timers = [];
        this._timers.push(t);
        return t;
    };
    return TimerDelegate;
}());



/***/ }),
/* 34 */,
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FastMap; });
var FastMap = (function () {
    function FastMap() {
        this.keys = [];
        this.values = [];
    }
    FastMap.prototype.put = function (key, value) {
        var index = this.keys.indexOf(key);
        if (index === -1) {
            this.keys.push(key);
            this.values.push(value);
        }
        else {
            this.values[index] = value;
        }
    };
    FastMap.prototype.get = function (key) {
        var index = this.keys.indexOf(key);
        if (index === -1)
            return null;
        return this.values[index];
    };
    FastMap.prototype.has = function (key) {
        var index = this.keys.indexOf(key);
        return index > -1;
    };
    FastMap.prototype.remove = function (key) {
        var index = this.keys.indexOf(key);
        if (index === -1)
            return;
        this.keys.splice(index, 1);
        this.values.splice(index, 1);
    };
    FastMap.prototype.getKeys = function () {
        return this.keys;
    };
    FastMap.prototype.getValues = function () {
        return this.values;
    };
    return FastMap;
}());



/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EventEmitter; });
/* harmony import */ var _debug_debugError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);

var EventEmitter = (function () {
    function EventEmitter() {
        this.events = {};
    }
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
    EventEmitter.prototype.off = function (eventName, callback) {
        var es = this.events[eventName];
        if (!es)
            return;
        var index = es.indexOf(callback);
        if ( true && index === -1) {
            console.error(callback);
            throw new _debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not remove event listener " + eventName);
        }
        es.splice(index, 1);
    };
    EventEmitter.prototype.trigger = function (eventName, data) {
        var es = this.events[eventName];
        if (!es)
            return;
        var l = es.length;
        while (l--) {
            es[l](data);
        }
    };
    EventEmitter.prototype._on = function (name, callBack) {
        this.events[name] = this.events[name] || [];
        this.events[name].push(callBack);
    };
    return EventEmitter;
}());



/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AbstractPrimitive; });
var AbstractPrimitive = (function () {
    function AbstractPrimitive() {
    }
    return AbstractPrimitive;
}());



/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(1);

// EXTERNAL MODULE: ./engine/geometry/rect.ts
var rect = __webpack_require__(6);

// EXTERNAL MODULE: ./engine/debug/debugError.ts
var debugError = __webpack_require__(0);

// EXTERNAL MODULE: ./engine/model/impl/ui/abstract/container.ts
var abstract_container = __webpack_require__(26);

// EXTERNAL MODULE: ./engine/model/impl/geometry/rectangle.ts
var rectangle = __webpack_require__(23);

// EXTERNAL MODULE: ./engine/renderer/color.ts
var color = __webpack_require__(7);

// CONCATENATED MODULE: ./engine/model/impl/ui/components/vScroll.ts




var vScroll_VScroll = (function (_super) {
    tslib_es6["c" /* __extends */](VScroll, _super);
    function VScroll(game) {
        var _this = _super.call(this, game) || this;
        _this.type = 'VScroll';
        _this.maxValue = 0;
        _this.value = 0;
        _this.enabled = false;
        var bg = new rectangle["a" /* Rectangle */](game);
        bg.size.width = 5;
        bg.fillColor = new color["a" /* Color */](50, 50, 50, 10);
        bg.color = color["a" /* Color */].NONE.clone();
        var hnd = new rectangle["a" /* Rectangle */](game);
        hnd.size.height = 10;
        hnd.color = color["a" /* Color */].NONE.clone();
        hnd.fillColor = new color["a" /* Color */](10, 10, 10, 100);
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
}(abstract_container["a" /* Container */]));


// EXTERNAL MODULE: ./engine/misc/mathEx.ts
var mathEx = __webpack_require__(13);

// EXTERNAL MODULE: ./engine/control/mouse/mouseEvents.ts
var mouseEvents = __webpack_require__(5);

// CONCATENATED MODULE: ./engine/model/impl/ui/abstract/scrollableContainer.ts





var scrollableContainer_ScrollInfo = (function () {
    function ScrollInfo(game) {
        this.game = game;
        this.offset = 0;
        this.scrollHeight = 0;
        this._scrollVelocity = 0;
        this._deceleration = 0;
        this._enabled = false;
    }
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
        container.on(mouseEvents["a" /* MOUSE_EVENTS */].mouseDown, function (p) {
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
        container.on(mouseEvents["a" /* MOUSE_EVENTS */].mouseMove, function (p) {
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
        container.on(mouseEvents["a" /* MOUSE_EVENTS */].scroll, function (p) {
            _this._scrollVelocity = -p.nativeEvent.wheelDelta;
            _this._deceleration = 0;
        });
        container.on(mouseEvents["a" /* MOUSE_EVENTS */].mouseUp, function (p) {
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
        if (mathEx["a" /* MathEx */].closeTo(this._scrollVelocity, 0, 3)) {
            this._scrollVelocity = 0;
            this._deceleration = 0;
        }
    };
    ScrollInfo.prototype._initScrollBar = function () {
        this.vScroll = new vScroll_VScroll(this.game);
        this.vScroll.size.width = 5;
        this._container.appendChild(this.vScroll);
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
    return ScrollInfo;
}());

var scrollableContainer_ScrollableContainer = (function (_super) {
    tslib_es6["c" /* __extends */](ScrollableContainer, _super);
    function ScrollableContainer(game) {
        return _super.call(this, game) || this;
    }
    ScrollableContainer.prototype.update = function () {
        if (this.vScrollInfo)
            this.vScrollInfo.update();
        _super.prototype.update.call(this);
    };
    ScrollableContainer.prototype._initScrolling = function (desc) {
        if (desc.vertical) {
            this.vScrollInfo = new scrollableContainer_ScrollInfo(this.game);
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
    return ScrollableContainer;
}(abstract_container["a" /* Container */]));


// EXTERNAL MODULE: ./engine/model/impl/geometry/image.ts
var geometry_image = __webpack_require__(15);

// EXTERNAL MODULE: ./engine/geometry/size.ts
var size = __webpack_require__(9);

// EXTERNAL MODULE: ./engine/geometry/point2d.ts
var point2d = __webpack_require__(4);

// CONCATENATED MODULE: ./engine/model/impl/ui/components/textField.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TEXT_ALIGN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return WORD_BRAKE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return textField_TextField; });







var TEXT_ALIGN;
(function (TEXT_ALIGN) {
    TEXT_ALIGN[TEXT_ALIGN["LEFT"] = 0] = "LEFT";
    TEXT_ALIGN[TEXT_ALIGN["RIGHT"] = 1] = "RIGHT";
    TEXT_ALIGN[TEXT_ALIGN["CENTER"] = 2] = "CENTER";
    TEXT_ALIGN[TEXT_ALIGN["JUSTIFY"] = 3] = "JUSTIFY";
})(TEXT_ALIGN || (TEXT_ALIGN = {}));
var WORD_BRAKE;
(function (WORD_BRAKE) {
    WORD_BRAKE[WORD_BRAKE["PREDEFINED"] = 0] = "PREDEFINED";
    WORD_BRAKE[WORD_BRAKE["FIT"] = 1] = "FIT";
})(WORD_BRAKE || (WORD_BRAKE = {}));
var textField_TextInfo = (function () {
    function TextInfo(textField) {
        this.textField = textField;
        this.allCharsCached = [];
        this.size = new size["a" /* Size */]();
        this.pos = new point2d["a" /* Point2d */]();
        this.strings = [];
    }
    TextInfo.prototype.reset = function () {
        this.allCharsCached = [];
        this.strings = [];
        this.pos.setXY(this.textField.paddingLeft, this.textField.paddingTop);
    };
    TextInfo.prototype.newString = function () {
        this.pos.x = this.textField.paddingLeft;
        if (this.strings.length) {
            this.pos.y += this.textField.getFont().fontContext.lineHeight;
        }
        this.strings.push(new textField_StringInfo());
    };
    TextInfo.prototype.addChar = function (c) {
        this.strings[this.strings.length - 1].chars.push(c);
        this.allCharsCached.push(c);
        c.destRect.setPoint(this.pos);
        c.destRect.point.addXY(c.destOffsetX, c.destOffsetY);
        this.pos.addX(c.sourceRect.size.width + c.destOffsetX);
    };
    TextInfo.prototype.addWord = function (w) {
        for (var _i = 0, _a = w.chars; _i < _a.length; _i++) {
            var c = _a[_i];
            this.addChar(c);
        }
    };
    TextInfo.prototype.revalidate = function (defaultSymbolHeight) {
        this.size.setWH(this.textField.paddingLeft + this.textField.paddingRight, this.textField.paddingTop + this.textField.paddingBottom);
        for (var _i = 0, _a = this.strings; _i < _a.length; _i++) {
            var s = _a[_i];
            s.calcSize(defaultSymbolHeight);
            this.size.height += s.height;
            if (s.width > this.size.width)
                this.size.width = s.width;
        }
    };
    TextInfo.prototype.align = function (textAlign) {
        if ( true && TEXT_ALIGN[textAlign] === undefined) {
            var keys = Object.keys(TEXT_ALIGN).join(', ');
            throw new debugError["a" /* DebugError */]("can not align text: unknown enum type of TEXT_ALIGN: " + textAlign + ", expected: " + keys);
        }
        for (var _i = 0, _a = this.strings; _i < _a.length; _i++) {
            var s = _a[_i];
            s.align(textAlign, this.textField);
        }
    };
    return TextInfo;
}());
var textField_CharInfo = (function () {
    function CharInfo() {
        this.destRect = new rect["a" /* Rect */]();
        this.sourceRect = new rect["a" /* Rect */]();
        this.destOffsetX = 0;
        this.destOffsetY = 0;
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
var textField_WordInfo = (function (_super) {
    tslib_es6["c" /* __extends */](WordInfo, _super);
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
var textField_StringInfo = (function (_super) {
    tslib_es6["c" /* __extends */](StringInfo, _super);
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
                var totalWordsWidth = 0;
                for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
                    var w = words_1[_i];
                    w.revalidate();
                    totalWordsWidth += w.width;
                }
                var totalSpaceWidth = textField.size.width - totalWordsWidth;
                var oneSpaceWidth = totalSpaceWidth / (words.length - 1);
                if (oneSpaceWidth > textField.getFont().fontContext.lineHeight * 2)
                    return;
                var initialPosY = this.chars[0].destRect.point.y;
                var currXPointer = this.chars[0].destRect.point.x;
                for (var _a = 0, words_2 = words; _a < words_2.length; _a++) {
                    var w = words_2[_a];
                    w.moveTo(currXPointer, initialPosY);
                    currXPointer += w.width + oneSpaceWidth;
                }
                break;
            default:
                if (true)
                    throw new debugError["a" /* DebugError */]("unknown TEXT_ALIGN value: " + textAlign);
        }
    };
    StringInfo.prototype.toWords = function () {
        var res = [];
        var currWord = new textField_WordInfo();
        for (var _i = 0, _a = this.chars; _i < _a.length; _i++) {
            var ch = _a[_i];
            if (ch.symbol === ' ') {
                if (currWord.chars.length) {
                    res.push(currWord);
                    currWord = new textField_WordInfo();
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
    return StringInfo;
}(CharsHolder));
var textField_TextField = (function (_super) {
    tslib_es6["c" /* __extends */](TextField, _super);
    function TextField(game) {
        var _this = _super.call(this, game) || this;
        _this.type = 'TextField';
        _this.textAlign = TEXT_ALIGN.LEFT;
        _this.wordBreak = WORD_BRAKE.PREDEFINED;
        _this._text = '';
        _this._textInfo = new textField_TextInfo(_this);
        _this._symbolImage = new geometry_image["a" /* Image */](_this.game);
        _this._initScrolling({ vertical: true });
        return _this;
    }
    TextField.prototype.revalidate = function () {
        _super.prototype.revalidate.call(this);
        if ( true && !this._font)
            throw new debugError["a" /* DebugError */]("font is not provided");
        this._font.revalidate();
    };
    TextField.prototype.onGeometryChanged = function () {
        var textInfo = this._textInfo;
        textInfo.reset();
        textInfo.newString();
        var text = this._text;
        if (this.wordBreak === WORD_BRAKE.FIT) {
            text = text.split('\n').map(function (str) { return str.trim(); }).join(' ');
        }
        var strings = text.split('\n');
        var MAX_WIDTH = this.maxWidth - this.paddingLeft - this.paddingRight;
        for (var i = 0; i < strings.length; i++) {
            var str = strings[i];
            var words = str.split(' ');
            for (var j = 0; j < words.length; j++) {
                var w = words[j];
                var wordInfo = new textField_WordInfo();
                for (var k = 0; k < w.length; k++) {
                    var charInfo = this._getCharInfo(w[k]);
                    wordInfo.addChar(charInfo);
                }
                if (this.maxWidth && textInfo.pos.x + wordInfo.width > MAX_WIDTH && i < words.length - 1) {
                    textInfo.newString();
                }
                textInfo.addWord(wordInfo);
                if (i < str.length - 1) {
                    var spaceChar = this._getCharInfo(' ');
                    textInfo.addChar(spaceChar);
                }
            }
            if (i < strings.length - 1) {
                textInfo.newString();
            }
        }
        textInfo.revalidate(this._font.fontContext.lineHeight);
        this.size.width = textInfo.size.width;
        if (this.maxHeight !== 0 && textInfo.size.height > this.maxHeight) {
            this.size.height = this.maxHeight;
        }
        else {
            this.size.height = textInfo.size.height;
        }
        textInfo.align(this.textAlign);
        this.updateScrollSize(textInfo.size.height, this.size.height);
        _super.prototype.onGeometryChanged.call(this);
    };
    TextField.prototype.setText = function (text) {
        if (text === void 0) { text = ''; }
        this._text = text + '';
        this._dirty = true;
    };
    TextField.prototype.setTextAlign = function (ta) {
        this.textAlign = ta;
        this._dirty = true;
    };
    TextField.prototype.setWordBreak = function (wb) {
        this.wordBreak = wb;
        this._dirty = true;
    };
    TextField.prototype.getText = function () {
        return this._text;
    };
    TextField.prototype.setFont = function (font) {
        this._font = font;
        this._dirty = true;
    };
    TextField.prototype.getFont = function () {
        return this._font;
    };
    TextField.prototype.draw = function () {
        if (this.background)
            this.background.render();
        var renderer = this.game.getRenderer();
        var worldRectTmp = rect["a" /* Rect */].fromPool();
        worldRectTmp.set(this.getWorldRect());
        worldRectTmp.point.addXY(this.marginLeft + this.paddingLeft, this.marginTop + this.paddingTop);
        worldRectTmp.size.addWH(-this.marginRight - this.paddingRight - this.paddingLeft - this.paddingLeft, -this.marginBottom - this.paddingBottom - this.marginTop - this.paddingTop);
        renderer.lockRect(worldRectTmp);
        worldRectTmp.release();
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
            this._symbolImage.getSrcRect().set(charInfo.sourceRect);
            this._symbolImage.size.set(charInfo.sourceRect.size);
            this._symbolImage.pos.set(charInfo.destRect.point);
            if (this._symbolImage.size.height === 0)
                continue;
            this._symbolImage.render();
        }
        renderer.restore();
        renderer.unlockRect();
        return true;
    };
    TextField.prototype._getDefaultSymbolRect = function () {
        var defaultChar = ' ';
        if (!this._font.fontContext.symbols[' ']) {
            var firstSymbol = Object.keys(this._font.fontContext.symbols)[0];
            if ( true && !firstSymbol)
                throw new debugError["a" /* DebugError */]("no symbols in font");
            defaultChar = firstSymbol;
        }
        return this._font.fontContext.symbols[defaultChar];
    };
    TextField.prototype._getCharInfo = function (c) {
        var charRect = this._font.fontContext.symbols[c] || this._getDefaultSymbolRect();
        var charInfo = new textField_CharInfo();
        charInfo.symbol = c;
        charInfo.sourceRect = new rect["a" /* Rect */]();
        charInfo.sourceRect.fromJSON(charRect);
        charInfo.destRect.setWH(charRect.width, charRect.height);
        charInfo.destOffsetX = charRect.destOffsetX;
        charInfo.destOffsetY = charRect.destOffsetY;
        return charInfo;
    };
    return TextField;
}(scrollableContainer_ScrollableContainer));



/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Font; });
/* harmony import */ var _engine_game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _engine_renderer_color__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);
/* harmony import */ var _engine_resources_resourceLoader__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(32);




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
        var lineHeight = getFontHeight(strFont) + 2 * SYMBOL_PADDING;
        var symbols = {};
        var currX = 0, currY = 0, cnvHeight = lineHeight;
        for (var k = 0; k < arrFromTo.length; k++) {
            var arrFromToCurr = arrFromTo[k];
            for (var i = arrFromToCurr.from; i < arrFromToCurr.to; i++) {
                var currentChar = String.fromCharCode(i);
                var context2D = cnv.getContext('2d');
                var textWidth = context2D.measureText(currentChar).width;
                textWidth += 2 * SYMBOL_PADDING;
                if (textWidth === 0)
                    continue;
                if (currX + textWidth > w) {
                    currX = 0;
                    currY += lineHeight;
                    cnvHeight = currY + lineHeight;
                }
                var symbolRect = {};
                symbolRect.x = ~~currX + SYMBOL_PADDING;
                symbolRect.y = ~~currY + SYMBOL_PADDING;
                symbolRect.width = ~~textWidth - 2 * SYMBOL_PADDING;
                symbolRect.height = lineHeight - 2 * SYMBOL_PADDING;
                symbolRect.destOffsetX = symbolRect.destOffsetY = 0;
                symbols[currentChar] = symbolRect;
                currX += textWidth;
            }
        }
        return { symbols: symbols, width: w, height: cnvHeight, lineHeight: lineHeight };
    };
    var correctColor = function (canvas, color) {
        var _a = color.toJSON(), r = _a.r, g = _a.g, b = _a.b, a = _a.a;
        var ctx = canvas.getContext("2d");
        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var clamped = imgData.data;
        for (var i = 0; i < clamped.length; i += 4) {
            var rIndex = i;
            var gIndex = i + 1;
            var bIndex = i + 2;
            var aIndex = i + 3;
            var avg = (clamped[rIndex] + clamped[gIndex] + clamped[bIndex] + clamped[aIndex]) / 4;
            if (avg < 0) {
            }
            else {
                clamped[rIndex] = r;
                clamped[gIndex] = g;
                clamped[bIndex] = b;
                clamped[aIndex] = ~~(clamped[aIndex] * a / 255);
            }
        }
        ctx.putImageData(imgData, 0, 0);
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
        ctx.msImageSmoothingEnabled = false;
        ctx.oImageSmoothingEnabled = false;
        ctx.fillStyle = '#00000000';
        ctx.fillRect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = '#fff';
        var symbols = fontContext.symbols;
        Object.keys(symbols).forEach(function (symbol) {
            var rect = symbols[symbol];
            ctx.fillText(symbol, rect.x, rect.y);
        });
        correctColor(cnv, color);
        return cnv.toDataURL();
    };
})(FontFactory || (FontFactory = {}));
var Font = (function () {
    function Font(game) {
        this.game = game;
        this.type = 'Font';
        this.fontSize = 12;
        this.fontFamily = 'Monospace';
        this.fontColor = _engine_renderer_color__WEBPACK_IMPORTED_MODULE_1__[/* Color */ "a"].BLACK.clone();
    }
    Font.getSystemFont = function () {
        if (Font._systemFontInstance)
            return Font._systemFontInstance;
        var f = new Font(_engine_game__WEBPACK_IMPORTED_MODULE_0__[/* Game */ "a"].getInstance());
        f.createContext();
        var resourceLoader = new _engine_resources_resourceLoader__WEBPACK_IMPORTED_MODULE_3__[/* ResourceLoader */ "a"](_engine_game__WEBPACK_IMPORTED_MODULE_0__[/* Game */ "a"].getInstance());
        var link = resourceLoader.loadImage(f.createBitmap());
        resourceLoader.startLoading();
        f.setResourceLink(link);
        Font._systemFontInstance = f;
        return f;
    };
    Font.fromAtlas = function (game, link, fontContext) {
        var fnt = new Font(game);
        fnt.setResourceLink(link);
        fnt.fontContext = fontContext;
        return fnt;
    };
    Font.prototype.generate = function () {
        this.createContext();
        var base64 = this.createBitmap();
        var link = this.game.getCurrScene().resourceLoader.loadImage(base64);
        this.setResourceLink(link);
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
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_2__[/* DebugError */ "a"]("font context is not created. Did you invoke font.generate() method?");
            if (!this.getResourceLink())
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_2__[/* DebugError */ "a"]("font without resource link");
        }
    };
    Font.prototype.setResourceLink = function (link) {
        this._resourceLink = link;
    };
    Font.prototype.getResourceLink = function () {
        return this._resourceLink;
    };
    return Font;
}());



/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SimpleRectDrawer; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _primitives_plane__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(31);
/* harmony import */ var _base_shaderProgram__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);
/* harmony import */ var _abstract_abstractDrawer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(16);
/* harmony import */ var _base_bufferInfo__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(14);
/* harmony import */ var _engine_renderer_webGl_shaders_generators_shaderGenerator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(30);
/* harmony import */ var _engine_renderer_webGl_base_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2);
/* harmony import */ var _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(0);








var SimpleRectDrawer = (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__[/* __extends */ "c"](SimpleRectDrawer, _super);
    function SimpleRectDrawer(gl) {
        return _super.call(this, gl) || this;
    }
    SimpleRectDrawer.prototype.prepareShaderGenerator = function () {
        this.gen = new _engine_renderer_webGl_shaders_generators_shaderGenerator__WEBPACK_IMPORTED_MODULE_5__[/* ShaderGenerator */ "a"]();
        var gen = this.gen;
        this.a_position = gen.addAttribute(_engine_renderer_webGl_base_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_6__[/* GL_TYPE */ "a"].FLOAT_VEC4, 'a_position');
        this.a_texCoord = gen.addAttribute(_engine_renderer_webGl_base_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_6__[/* GL_TYPE */ "a"].FLOAT_VEC2, 'a_texCoord');
        this.u_vertexMatrix = gen.addVertexUniform(_engine_renderer_webGl_base_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_6__[/* GL_TYPE */ "a"].FLOAT_MAT4, 'u_vertexMatrix');
        this.u_textureMatrix = gen.addVertexUniform(_engine_renderer_webGl_base_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_6__[/* GL_TYPE */ "a"].FLOAT_MAT4, 'u_textureMatrix');
        gen.addVarying(_engine_renderer_webGl_base_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_6__[/* GL_TYPE */ "a"].FLOAT_VEC2, 'v_texCoord');
        gen.setVertexMainFn("\n            void main(){\n                gl_Position = u_vertexMatrix * a_position;\n                v_texCoord = (u_textureMatrix * vec4(a_texCoord, 0, 1)).xy;\n            } \n        ");
        gen.addFragmentUniform(_engine_renderer_webGl_base_shaderProgramUtils__WEBPACK_IMPORTED_MODULE_6__[/* GL_TYPE */ "a"].SAMPLER_2D, 'texture');
        gen.setFragmentMainFn("\n            void main(){\n                gl_FragColor = texture2D(texture, v_texCoord);\n            }\n        ");
    };
    SimpleRectDrawer.prototype.initProgram = function () {
        if (true) {
            if (!this.gen)
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_7__[/* DebugError */ "a"]("can not init simpleRectDrawer instance: prepareShaderGenerator method must be invoked");
        }
        this.primitive = new _primitives_plane__WEBPACK_IMPORTED_MODULE_1__[/* Plane */ "a"]();
        this.program = new _base_shaderProgram__WEBPACK_IMPORTED_MODULE_2__[/* ShaderProgram */ "a"](this.gl, this.gen.getVertexSource(), this.gen.getFragmentSource());
        this.bufferInfo = new _base_bufferInfo__WEBPACK_IMPORTED_MODULE_4__[/* BufferInfo */ "a"](this.gl, {
            posVertexInfo: { array: this.primitive.vertexArr, type: this.gl.FLOAT, size: 2, attrName: 'a_position' },
            posIndexInfo: { array: this.primitive.indexArr },
            texVertexInfo: { array: this.primitive.texCoordArr, type: this.gl.FLOAT, size: 2, attrName: 'a_texCoord' },
            drawMethod: _base_bufferInfo__WEBPACK_IMPORTED_MODULE_4__[/* DRAW_METHOD */ "b"].TRIANGLE_STRIP
        });
    };
    return SimpleRectDrawer;
}(_abstract_abstractDrawer__WEBPACK_IMPORTED_MODULE_3__[/* AbstractDrawer */ "a"]));



/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(1);

// EXTERNAL MODULE: ./engine/debug/debugError.ts
var debugError = __webpack_require__(0);

// EXTERNAL MODULE: ./engine/renderer/webGl/programs/abstract/abstractDrawer.ts
var abstractDrawer = __webpack_require__(16);

// EXTERNAL MODULE: ./engine/renderer/webGl/base/shaderProgram.ts
var shaderProgram = __webpack_require__(19);

// EXTERNAL MODULE: ./engine/renderer/webGl/base/bufferInfo.ts + 2 modules
var base_bufferInfo = __webpack_require__(14);

// EXTERNAL MODULE: ./engine/renderer/webGl/primitives/plane.ts
var plane = __webpack_require__(31);

// EXTERNAL MODULE: ./engine/renderer/webGl/base/shaderProgramUtils.ts
var shaderProgramUtils = __webpack_require__(2);

// EXTERNAL MODULE: ./engine/renderer/webGl/shaders/generators/shaderGenerator.ts
var shaderGenerator = __webpack_require__(30);

// EXTERNAL MODULE: ./engine/model/impl/geometry/image.ts
var geometry_image = __webpack_require__(15);

// CONCATENATED MODULE: ./engine/renderer/webGl/programs/impl/base/shapeDrawer.shader.ts

var SHAPE_TYPE;
(function (SHAPE_TYPE) {
    SHAPE_TYPE[SHAPE_TYPE["ELLIPSE"] = 0] = "ELLIPSE";
    SHAPE_TYPE[SHAPE_TYPE["RECT"] = 1] = "RECT";
})(SHAPE_TYPE || (SHAPE_TYPE = {}));
var FILL_TYPE;
(function (FILL_TYPE) {
    FILL_TYPE[FILL_TYPE["COLOR"] = 0] = "COLOR";
    FILL_TYPE[FILL_TYPE["TEXTURE"] = 1] = "TEXTURE";
    FILL_TYPE[FILL_TYPE["LINEAR_GRADIENT"] = 2] = "LINEAR_GRADIENT";
})(FILL_TYPE || (FILL_TYPE = {}));
var fragmentSource = "\nprecision mediump float;\n\n#define HALF                   .5\n#define ZERO                    0.\n#define ONE                     1.\n#define ERROR_COLOR             vec4(ONE,ZERO,ZERO,ONE)\n#define STRETCH_MODE_STRETCH    " + geometry_image["b" /* STRETCH_MODE */].STRETCH + "\n#define STRETCH_MODE_REPEAT     " + geometry_image["b" /* STRETCH_MODE */].REPEAT + "\n\nvec4 getStretchedImage(float tx,float ty){\n    vec2 txVec = vec2(tx,ty);\n    txVec += fract(u_texOffset);\n    txVec = mod(txVec,u_texRect.zw);\n    txVec += u_texRect.xy;\n    return texture2D(texture, txVec);\n}\n\nvec4 getRepeatedImage(float tx,float ty){\n    vec2 txVec = vec2(tx,ty)*u_repeatFactor;\n    txVec += fract(u_texOffset);  \n    txVec = mod(txVec,vec2(ONE,ONE));\n    return texture2D(texture, txVec);\n}\n\nvec4 getFillColor(){\n    if (u_fillType==" + FILL_TYPE.COLOR + ") return u_fillColor;\n    else if (u_fillType==" + FILL_TYPE.LINEAR_GRADIENT + ") {\n        vec2 polarCoords = vec2(length(v_position.xy),atan(v_position.y/v_position.x));\n        polarCoords.y+=u_fillLinearGradient[2].x;\n        vec2 rectCoords = vec2(polarCoords.x*cos(polarCoords.y),polarCoords.x*sin(polarCoords.y));\n        return mix(u_fillLinearGradient[0],u_fillLinearGradient[1],rectCoords.x);\n    }\n    else if (u_fillType==" + FILL_TYPE.TEXTURE + ") {\n        float tx = (v_position.x-u_rectOffsetLeft)/u_width*u_texRect[2]; \n        float ty = (v_position.y-u_rectOffsetTop)/u_height*u_texRect[3];\n        vec4 txVec;\n        if (u_stretchMode==STRETCH_MODE_STRETCH) txVec = getStretchedImage(tx,ty);\n        else if (u_stretchMode==STRETCH_MODE_REPEAT) txVec = getRepeatedImage(tx,ty);\n        else txVec = ERROR_COLOR;\n        return txVec;\n    }\n    else return ERROR_COLOR;\n}\nfloat calcRadiusAtAngle(float x,float y) {\n     float a = atan(y-HALF,x-HALF);\n     float cosA = cos(a);\n     float sinA = sin(a);\n     return u_rx*u_ry/sqrt(u_rx*u_rx*sinA*sinA+u_ry*u_ry*cosA*cosA);\n}\n\nvoid drawEllipse(){\n     float dist = distance(vec2(HALF,HALF),v_position.xy);\n     float rAtCurrAngle = calcRadiusAtAngle(v_position.x,v_position.y);\n     float angle = atan(v_position.y-HALF,v_position.x-HALF);\n     //if (angle<ZERO) angle = TWO_PI+angle;\n     bool isArcNotUsed = u_arcAngleFrom==u_arcAngleTo && u_arcAngleFrom==ZERO;\n     if (isArcNotUsed || (angle>u_arcAngleFrom && angle<u_arcAngleTo)) {\n         if (dist < rAtCurrAngle) {\n            if (dist > rAtCurrAngle - u_lineWidth) gl_FragColor = u_color;\n            else gl_FragColor = getFillColor();\n         }\n         else discard;\n     }\n     \n}\n\nvoid drawRect(){\n    float x = v_position.x - HALF;\n    float y = v_position.y - HALF;\n    float distX = abs(x);\n    float distY = abs(y);\n    float halfW = u_width  * HALF;\n    float halfH = u_height * HALF;\n    if (distX < halfW && distY < halfH) {\n        \n        if (distX>halfW - u_borderRadius && distY>halfH - u_borderRadius) {\n            vec2 borderCenter = vec2(0.,0.);\n            float posX = v_position.x, posY = v_position.y;\n            if (posX<HALF && posY<HALF) { // top left\n                borderCenter = vec2(HALF - halfW + u_borderRadius,HALF - halfH + u_borderRadius);\n            }\n            else if (posX>HALF && posY<HALF) { // top right\n                borderCenter = vec2(HALF + halfW - u_borderRadius,HALF - halfH + u_borderRadius); \n            }    \n            else if (posX<HALF && posY>HALF) { // bottom left\n                borderCenter = vec2(HALF - halfW + u_borderRadius,HALF + halfH - u_borderRadius); \n            }\n            else {  // bottom right\n                borderCenter = vec2(HALF + halfW - u_borderRadius,HALF + halfH - u_borderRadius);\n            }\n            float distToBorderCenter = distance(v_position.xy,borderCenter);\n            if (distToBorderCenter>u_borderRadius) discard;\n            else if (distToBorderCenter>u_borderRadius-u_lineWidth) gl_FragColor = u_color;\n            else gl_FragColor = getFillColor();\n        }\n        \n        else if (distX > halfW - u_lineWidth || distY > halfH - u_lineWidth)\n            gl_FragColor = u_color;\n        else \n            gl_FragColor = getFillColor();\n    }\n    else discard;\n}\n\nvoid main(){\n    if (u_shapeType==" + SHAPE_TYPE.ELLIPSE + ") drawEllipse();\n    else if (u_shapeType==" + SHAPE_TYPE.RECT + ") drawRect();\n    else gl_FragColor = ERROR_COLOR;\n    gl_FragColor.a*=u_alpha;\n}\n";

// CONCATENATED MODULE: ./engine/renderer/webGl/programs/impl/base/shapeDrawer.ts








var shapeDrawer_ShapeDrawer = (function (_super) {
    tslib_es6["c" /* __extends */](ShapeDrawer, _super);
    function ShapeDrawer(gl) {
        var _this = _super.call(this, gl) || this;
        var gen = new shaderGenerator["a" /* ShaderGenerator */]();
        gen.setVertexMainFn("\n            void main(){\n                v_position = a_position;\n                gl_Position = u_vertexMatrix * a_position;   \n            }\n        ");
        _this.u_vertexMatrix = gen.addVertexUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT_MAT4, 'u_vertexMatrix');
        _this.a_position = gen.addAttribute(shaderProgramUtils["a" /* GL_TYPE */].FLOAT_VEC4, 'a_position');
        gen.addVarying(shaderProgramUtils["a" /* GL_TYPE */].FLOAT_VEC4, 'v_position');
        _this.u_lineWidth = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT, 'u_lineWidth');
        _this.u_rx = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT, 'u_rx');
        _this.u_ry = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT, 'u_ry');
        _this.u_width = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT, 'u_width');
        _this.u_height = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT, 'u_height');
        _this.u_rectOffsetTop = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT, 'u_rectOffsetTop');
        _this.u_rectOffsetLeft = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT, 'u_rectOffsetLeft');
        _this.u_borderRadius = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT, 'u_borderRadius');
        _this.u_color = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT_VEC4, 'u_color');
        _this.u_alpha = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT, 'u_alpha');
        _this.u_fillColor = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT_VEC4, 'u_fillColor');
        _this.u_fillLinearGradient = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT_VEC4, 'u_fillLinearGradient[3]', true);
        _this.u_texRect = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT_VEC4, 'u_texRect');
        _this.u_texOffset = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT_VEC2, 'u_texOffset');
        gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].SAMPLER_2D, 'texture');
        _this.u_shapeType = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].INT, 'u_shapeType');
        _this.u_fillType = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].INT, 'u_fillType');
        _this.u_arcAngleFrom = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT, 'u_arcAngleFrom');
        _this.u_arcAngleTo = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT, 'u_arcAngleTo');
        _this.u_repeatFactor = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].FLOAT_VEC2, 'u_repeatFactor');
        _this.u_stretchMode = gen.addFragmentUniform(shaderProgramUtils["a" /* GL_TYPE */].INT, 'u_stretchMode');
        gen.setFragmentMainFn(fragmentSource);
        _this.program = new shaderProgram["a" /* ShaderProgram */](gl, gen.getVertexSource(), gen.getFragmentSource());
        _this.primitive = new plane["a" /* Plane */]();
        _this.bufferInfo = new base_bufferInfo["a" /* BufferInfo */](gl, {
            posVertexInfo: { array: _this.primitive.vertexArr, type: gl.FLOAT, size: 2, attrName: _this.a_position },
            posIndexInfo: { array: _this.primitive.indexArr },
            drawMethod: base_bufferInfo["b" /* DRAW_METHOD */].TRIANGLE_STRIP,
        });
        return _this;
    }
    return ShapeDrawer;
}(abstractDrawer["a" /* AbstractDrawer */]));


// EXTERNAL MODULE: ./engine/renderer/webGl/base/texture.ts
var base_texture = __webpack_require__(21);

// CONCATENATED MODULE: ./engine/renderer/webGl/base/frameBuffer.ts


var frameBuffer_FrameBuffer = (function () {
    function FrameBuffer(gl, width, height) {
        if ( true && !gl)
            throw new debugError["a" /* DebugError */]("can not create FrameBuffer, gl context not passed to constructor, expected: FrameBuffer(gl)");
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.texture = new base_texture["a" /* Texture */](gl);
        this.texture.setImage(null, width, height);
        this._init(gl, width, height);
    }
    FrameBuffer.prototype.bind = function () {
        if (FrameBuffer.currInstance === this)
            return;
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.glFrameBuffer);
        this.gl.viewport(0, 0, this.width, this.height);
        FrameBuffer.currInstance = this;
    };
    FrameBuffer.prototype.unbind = function () {
        this._checkBound();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        FrameBuffer.currInstance = null;
    };
    FrameBuffer.prototype.clear = function (color) {
        this._checkBound();
        var arr = color.asGL();
        this.gl.clearColor(arr[0], arr[1], arr[2], arr[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    };
    FrameBuffer.prototype.destroy = function () {
        this.gl.deleteRenderbuffer(this.glRenderBuffer);
        this.gl.deleteFramebuffer(this.glFrameBuffer);
    };
    FrameBuffer.prototype.getTexture = function () {
        return this.texture;
    };
    FrameBuffer.prototype._init = function (gl, width, height) {
        this.glRenderBuffer = gl.createRenderbuffer();
        if ( true && !this.glRenderBuffer)
            throw new debugError["a" /* DebugError */]("can not allocate memory for glRenderBuffer");
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.glRenderBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
        this.glFrameBuffer = gl.createFramebuffer();
        if ( true && !this.glFrameBuffer)
            throw new debugError["a" /* DebugError */]("can not allocate memory for glFrameBuffer");
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.glFrameBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture.getGlTexture(), 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.glRenderBuffer);
        var fbStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if ( true && fbStatus !== gl.FRAMEBUFFER_COMPLETE) {
            throw new debugError["a" /* DebugError */]("frame buffer status error: " + fbStatus + " (expected gl.FRAMEBUFFER_COMPLETE(" + gl.FRAMEBUFFER_COMPLETE + "))");
        }
        this.texture.unbind();
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    };
    FrameBuffer.prototype._checkBound = function () {
        if (true)
            return;
        if (FrameBuffer.currInstance !== this)
            throw new debugError["a" /* DebugError */]("frame buffer is not bound; call bind() method firstly");
    };
    FrameBuffer.currInstance = null;
    return FrameBuffer;
}());


// EXTERNAL MODULE: ./engine/geometry/mat4.ts
var mat4 = __webpack_require__(3);

// CONCATENATED MODULE: ./engine/renderer/webGl/base/matrixStack.ts

var Mat16Holder = mat4["a" /* mat4 */].Mat16Holder;
var matrixStack_MatrixStack = (function () {
    function MatrixStack() {
        this.stack = [];
        this.restore();
    }
    MatrixStack.prototype.restore = function () {
        var last = this.stack.pop();
        if (last !== undefined)
            last.release();
        if (this.stack.length < 1) {
            this.stack[0] = Mat16Holder.fromPool();
            mat4["a" /* mat4 */].makeIdentity(this.stack[0]);
        }
    };
    MatrixStack.prototype.save = function () {
        var copy = Mat16Holder.fromPool();
        copy.fromMat16(this.getCurrentMatrix().mat16);
        this.stack.push(copy);
    };
    MatrixStack.prototype.getCurrentMatrix = function () {
        return this.stack[this.stack.length - 1];
    };
    MatrixStack.prototype.setCurrentMatrix = function (m) {
        return this.stack[this.stack.length - 1] = m;
    };
    MatrixStack.prototype.translate = function (x, y, z) {
        if (z === void 0) { z = 0; }
        var t = Mat16Holder.fromPool();
        mat4["a" /* mat4 */].makeTranslation(t, x, y, z);
        var m = this.getCurrentMatrix();
        var result = Mat16Holder.fromPool();
        mat4["a" /* mat4 */].matrixMultiply(result, t, m);
        this.setCurrentMatrix(result);
        t.release();
        m.release();
        return this;
    };
    MatrixStack.prototype.skewX = function (angle) {
        var t = Mat16Holder.fromPool();
        mat4["a" /* mat4 */].makeXSkew(t, angle);
        var m = this.getCurrentMatrix();
        var result = Mat16Holder.fromPool();
        mat4["a" /* mat4 */].matrixMultiply(result, t, m);
        this.setCurrentMatrix(result);
        t.release();
        m.release();
        return this;
    };
    MatrixStack.prototype.skewY = function (angle) {
        var t = Mat16Holder.fromPool();
        mat4["a" /* mat4 */].makeYSkew(t, angle);
        var m = this.getCurrentMatrix();
        var result = Mat16Holder.fromPool();
        mat4["a" /* mat4 */].matrixMultiply(result, t, m);
        this.setCurrentMatrix(result);
        t.release();
        m.release();
        return this;
    };
    MatrixStack.prototype.rotateX = function (angleInRadians) {
        var t = Mat16Holder.fromPool();
        mat4["a" /* mat4 */].makeXRotation(t, angleInRadians);
        this._rotate(t);
        t.release();
        return this;
    };
    MatrixStack.prototype.rotateY = function (angleInRadians) {
        var t = Mat16Holder.fromPool();
        mat4["a" /* mat4 */].makeYRotation(t, angleInRadians);
        this._rotate(t);
        t.release();
        return this;
    };
    MatrixStack.prototype.rotateZ = function (angleInRadians) {
        var t = Mat16Holder.fromPool();
        mat4["a" /* mat4 */].makeZRotation(t, angleInRadians);
        this._rotate(t);
        t.release();
        return this;
    };
    MatrixStack.prototype.scale = function (x, y, z) {
        if (z === void 0) { z = 1; }
        var t = Mat16Holder.fromPool();
        mat4["a" /* mat4 */].makeScale(t, x, y, z);
        var m = this.getCurrentMatrix();
        var result = Mat16Holder.fromPool();
        mat4["a" /* mat4 */].matrixMultiply(result, t, m);
        this.setCurrentMatrix(result);
        t.release();
        m.release();
        return this;
    };
    MatrixStack.prototype.resetTransform = function () {
        this.getCurrentMatrix().release();
        var identity = Mat16Holder.fromPool();
        mat4["a" /* mat4 */].makeIdentity(identity);
        this.setCurrentMatrix(identity);
        return this;
    };
    MatrixStack.prototype.release = function () {
        for (var i = 0; i < this.stack.length; i++) {
            this.stack[i].release();
            return this;
        }
        return this;
    };
    MatrixStack.prototype._rotate = function (rotMat) {
        var m = this.getCurrentMatrix();
        var result = Mat16Holder.fromPool();
        mat4["a" /* mat4 */].matrixMultiply(result, rotMat, m);
        this.setCurrentMatrix(result);
        m.release();
    };
    return MatrixStack;
}());


// EXTERNAL MODULE: ./engine/geometry/rect.ts
var geometry_rect = __webpack_require__(6);

// EXTERNAL MODULE: ./engine/renderer/abstract/abstractCanvasRenderer.ts + 2 modules
var abstractCanvasRenderer = __webpack_require__(43);

// EXTERNAL MODULE: ./engine/renderer/color.ts
var color = __webpack_require__(7);

// EXTERNAL MODULE: ./engine/geometry/size.ts
var geometry_size = __webpack_require__(9);

// CONCATENATED MODULE: ./engine/renderer/webGl/programs/impl/base/meshDrawer.shader.ts
var vertexSource = "\nprecision mediump float;\n\nattribute vec4 a_position;\nattribute vec2 a_texcoord;\nattribute vec3 a_normal;\n\nuniform mat4 u_modelMatrix;\nuniform mat4 u_projectionMatrix;\n\nvarying vec2 v_texcoord;\nvarying vec3 v_normal;\n\nvoid main() {\n\n  gl_Position = u_projectionMatrix * u_modelMatrix * a_position;\n  v_texcoord = a_texcoord;\n    v_normal = (u_modelMatrix * vec4(a_normal, 0)).xyz;\n}\n";
var meshDrawer_shader_fragmentSource = "\nprecision mediump float;\n\nvarying vec2 v_texcoord;\nvarying vec3 v_normal;\n\nuniform sampler2D u_texture;\nuniform float u_alpha;\nuniform bool u_textureUsed;\nuniform bool u_lightUsed;\nuniform vec4 u_color;\nuniform mat4 u_modelMatrix;\n\n\nvoid main() {\n    \n    if (u_textureUsed) gl_FragColor = mix(u_color,texture2D(u_texture, v_texcoord),.5);\n    else gl_FragColor = u_color;\n    if (u_lightUsed) {\n        vec3 normal = normalize(v_normal);\n        vec3 lightDirectionInv = normalize(vec3(-1,-1,1));\n        float light = max(0.5,dot(normal, lightDirectionInv));\n        gl_FragColor.rgb *= light;\n    }\n    gl_FragColor.a *= u_alpha;\n}\n\n";

// CONCATENATED MODULE: ./engine/renderer/webGl/programs/impl/base/meshDrawer.ts






var meshDrawer_MeshDrawer = (function (_super) {
    tslib_es6["c" /* __extends */](MeshDrawer, _super);
    function MeshDrawer(gl) {
        var _this = _super.call(this, gl) || this;
        _this.a_position = 'a_position';
        _this.a_normal = 'a_normal';
        _this.a_texcoord = 'a_texcoord';
        _this.u_modelMatrix = 'u_modelMatrix';
        _this.u_projectionMatrix = 'u_projectionMatrix';
        _this.u_color = 'u_color';
        _this.u_alpha = 'u_alpha';
        _this.u_textureUsed = 'u_textureUsed';
        _this.u_lightUsed = 'u_lightUsed';
        _this.program = new shaderProgram["a" /* ShaderProgram */](gl, vertexSource, meshDrawer_shader_fragmentSource);
        return _this;
    }
    MeshDrawer.prototype.bindModel = function (mesh) {
        this.mesh = mesh;
        if (!this.mesh.bufferInfo)
            this._initBufferInfo(mesh.modelPrimitive.drawMethod, mesh.vertexItemSize);
        if (mesh.isLightAccepted() === undefined) {
            mesh.acceptLight(!!this.mesh.bufferInfo.normalBuffer);
        }
        this.bufferInfo = this.mesh.bufferInfo;
    };
    MeshDrawer.prototype.setModelMatrix = function (m) {
        this.setUniform(this.u_modelMatrix, m);
    };
    MeshDrawer.prototype.setProjectionMatrix = function (m) {
        this.setUniform(this.u_projectionMatrix, m);
    };
    MeshDrawer.prototype.setAlfa = function (a) {
        this.setUniform(this.u_alpha, 1);
    };
    MeshDrawer.prototype.setTextureUsed = function (used) {
        this.setUniform(this.u_textureUsed, used);
    };
    MeshDrawer.prototype.setLightUsed = function (used) {
        this.setUniform(this.u_lightUsed, used);
    };
    MeshDrawer.prototype.setColor = function (c) {
        this.setUniform(this.u_color, c.asGL());
    };
    MeshDrawer.prototype.bind = function () {
        if ( true && !this.mesh.modelPrimitive)
            throw new debugError["a" /* DebugError */]("can not bind modelDrawer;bindModel must be invoked firstly");
        _super.prototype.bind.call(this);
        if (!this.mesh.modelPrimitive.texCoordArr) {
            this.program.disableAttribute(this.a_texcoord);
        }
        else {
            this.program.enableAttribute(this.a_texcoord);
        }
        if (!this.mesh.modelPrimitive.normalArr) {
            this.program.disableAttribute(this.a_normal);
        }
        else {
            this.program.enableAttribute(this.a_normal);
        }
    };
    MeshDrawer.prototype.unbind = function () {
        this.mesh = null;
        _super.prototype.unbind.call(this);
    };
    MeshDrawer.prototype._initBufferInfo = function (drawMethod, vertexSize) {
        if (drawMethod === void 0) { drawMethod = base_bufferInfo["b" /* DRAW_METHOD */].TRIANGLES; }
        if (vertexSize === void 0) { vertexSize = 3; }
        var bufferInfo = {
            posVertexInfo: {
                array: this.mesh.modelPrimitive.vertexArr, type: this.gl.FLOAT,
                size: vertexSize, attrName: this.a_position
            },
            drawMethod: drawMethod
        };
        if (this.mesh.modelPrimitive.indexArr) {
            bufferInfo.posIndexInfo = {
                array: this.mesh.modelPrimitive.indexArr
            };
        }
        if (this.mesh.modelPrimitive.normalArr) {
            bufferInfo.normalInfo = {
                array: this.mesh.modelPrimitive.normalArr,
                type: this.gl.FLOAT,
                size: 3,
                attrName: this.a_normal
            };
        }
        if (this.mesh.modelPrimitive.texCoordArr) {
            bufferInfo.texVertexInfo = {
                array: this.mesh.modelPrimitive.texCoordArr, type: this.gl.FLOAT,
                size: 2, attrName: this.a_texcoord
            };
        }
        this.mesh.bufferInfo = new base_bufferInfo["a" /* BufferInfo */](this.gl, bufferInfo);
    };
    return MeshDrawer;
}(abstractDrawer["a" /* AbstractDrawer */]));


// EXTERNAL MODULE: ./engine/renderer/webGl/programs/impl/base/simpleRectDrawer.ts
var simpleRectDrawer = __webpack_require__(40);

// CONCATENATED MODULE: ./engine/renderer/webGl/base/doubleFrameBuffer.ts

var doubleFrameBuffer_DoubleFrameBuffer = (function () {
    function DoubleFrameBuffer(gl, width, height) {
        this.gl = gl;
        this.buffers = [
            new frameBuffer_FrameBuffer(gl, width, height),
            new frameBuffer_FrameBuffer(gl, width, height)
        ];
    }
    DoubleFrameBuffer.prototype.applyFilters = function (texture, filters) {
        var len = filters.length;
        if (len === 0)
            return texture;
        var filter = filters[0];
        filter.getDrawer().attachTexture('texture', texture);
        filter.doFilter(this.getDestBuffer());
        for (var i = 1; i < len; i++) {
            this.flip();
            filters[i].getDrawer().attachTexture('texture', this.getSourceBuffer().getTexture());
            filters[i].doFilter(this.getDestBuffer());
        }
        this.flip();
        return this.getSourceBuffer().getTexture();
    };
    DoubleFrameBuffer.prototype.destroy = function () {
        this.buffers.forEach(function (b) { return b.destroy(); });
    };
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
    return DoubleFrameBuffer;
}());


// EXTERNAL MODULE: ./engine/model/abstract/renderableModel.ts
var renderableModel = __webpack_require__(8);

// CONCATENATED MODULE: ./engine/renderer/webGl/blender/blender.ts


var blender_Blender = (function () {
    function Blender(gl) {
        this.gl = gl;
    }
    Blender.prototype.enable = function () {
        this.gl.enable(this.gl.BLEND);
    };
    Blender.prototype.disable = function () {
        this.gl.disable(this.gl.BLEND);
    };
    Blender.prototype.setBlendMode = function (blendMode) {
        var gl = this.gl;
        switch (blendMode) {
            case renderableModel["a" /* BLEND_MODE */].NORMAL:
                gl.blendEquation(gl.FUNC_ADD);
                gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                break;
            case renderableModel["a" /* BLEND_MODE */].ADDITIVE:
                gl.blendEquation(gl.FUNC_ADD);
                gl.blendFunc(gl.ONE, gl.ONE);
                break;
            case renderableModel["a" /* BLEND_MODE */].SUBSTRACTIVE:
                gl.blendEquation(gl.FUNC_SUBTRACT);
                gl.blendFunc(gl.ONE, gl.ONE);
                break;
            case renderableModel["a" /* BLEND_MODE */].REVERSE_SUBSTRACTIVE:
                gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT);
                gl.blendFunc(gl.ONE, gl.ONE);
                break;
            default:
                if (true) {
                    throw new debugError["a" /* DebugError */]("unknown blend mode: " + blendMode);
                }
                break;
        }
    };
    return Blender;
}());


// EXTERNAL MODULE: ./engine/renderer/webGl/debug/debugUtil.ts
var debugUtil = __webpack_require__(29);

// CONCATENATED MODULE: ./engine/renderer/webGl/webGlRenderer.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return webGlRenderer_WebGlRenderer; });



















var IDENTITY = mat4["a" /* mat4 */].IDENTITY;
var webGlRenderer_Mat16Holder = mat4["a" /* mat4 */].Mat16Holder;

var glEnumToString = debugUtil["a" /* debugUtil */].glEnumToString;
var getCtx = function (el) {
    var contextAttrs = { alpha: false, premultipliedAlpha: false };
    var possibles = ['webgl2', 'webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
    for (var _i = 0, possibles_1 = possibles; _i < possibles_1.length; _i++) {
        var p = possibles_1[_i];
        var ctx = el.getContext(p, contextAttrs);
        if (ctx)
            return ctx;
    }
    if (true)
        throw new debugError["a" /* DebugError */]("webGl is not accessible on this device");
    return null;
};
var SCENE_DEPTH = 1000;
var FLIP_TEXTURE_MATRIX = new matrixStack_MatrixStack().translate(0, 1).scale(1, -1).release().getCurrentMatrix().clone();
var FLIP_POSITION_MATRIX;
var zToWMatrix = webGlRenderer_Mat16Holder.create();
mat4["a" /* mat4 */].makeZToWMatrix(zToWMatrix, 1);
var BLACK = color["a" /* Color */].RGB(0, 0, 0, 0);
var makePositionMatrix = function (rect, viewSize, matrixStack) {
    var projectionMatrix = webGlRenderer_Mat16Holder.fromPool();
    mat4["a" /* mat4 */].ortho(projectionMatrix, 0, viewSize.width, 0, viewSize.height, -SCENE_DEPTH, SCENE_DEPTH);
    var scaleMatrix = webGlRenderer_Mat16Holder.fromPool();
    mat4["a" /* mat4 */].makeScale(scaleMatrix, rect.size.width, rect.size.height, 1);
    var translationMatrix = webGlRenderer_Mat16Holder.fromPool();
    mat4["a" /* mat4 */].makeTranslation(translationMatrix, rect.point.x, rect.point.y, 0);
    var matrix1 = webGlRenderer_Mat16Holder.fromPool();
    mat4["a" /* mat4 */].matrixMultiply(matrix1, scaleMatrix, translationMatrix);
    var matrix2 = webGlRenderer_Mat16Holder.fromPool();
    mat4["a" /* mat4 */].matrixMultiply(matrix2, matrix1, matrixStack.getCurrentMatrix());
    var matrix3 = webGlRenderer_Mat16Holder.fromPool();
    mat4["a" /* mat4 */].matrixMultiply(matrix3, matrix2, projectionMatrix);
    var matrix4 = webGlRenderer_Mat16Holder.fromPool();
    mat4["a" /* mat4 */].matrixMultiply(matrix4, matrix3, zToWMatrix);
    projectionMatrix.release();
    scaleMatrix.release();
    translationMatrix.release();
    matrix1.release();
    matrix2.release();
    matrix3.release();
    return matrix4;
};
var InstanceHolder = (function () {
    function InstanceHolder(clazz) {
        this.clazz = clazz;
    }
    InstanceHolder.prototype.getInstance = function (gl) {
        if (!this.instance)
            this.instance = new this.clazz(gl);
        return this.instance;
    };
    InstanceHolder.prototype.destroy = function () {
        if (this.instance)
            this.instance.destroy();
    };
    return InstanceHolder;
}());
var webGlRenderer_WebGlRenderer = (function (_super) {
    tslib_es6["c" /* __extends */](WebGlRenderer, _super);
    function WebGlRenderer(game) {
        var _this = _super.call(this, game) || this;
        _this.type = 'WebGlRenderer';
        _this.matrixStack = new matrixStack_MatrixStack();
        _this.shapeDrawerHolder = new InstanceHolder(shapeDrawer_ShapeDrawer);
        _this.meshDrawerHolder = new InstanceHolder(meshDrawer_MeshDrawer);
        _this.registerResize();
        _this._init();
        var m16hResult = webGlRenderer_Mat16Holder.fromPool();
        var m16Scale = webGlRenderer_Mat16Holder.fromPool();
        mat4["a" /* mat4 */].makeScale(m16Scale, _this.game.width, _this.game.height, 1);
        var m16Ortho = webGlRenderer_Mat16Holder.fromPool();
        mat4["a" /* mat4 */].ortho(m16Ortho, 0, _this.game.width, 0, _this.game.height, -1, 1);
        mat4["a" /* mat4 */].matrixMultiply(m16hResult, m16Scale, m16Ortho);
        FLIP_POSITION_MATRIX = m16hResult.clone();
        m16hResult.release();
        m16Scale.release();
        m16Ortho.release();
        return _this;
    }
    WebGlRenderer.prototype.drawImage = function (img) {
        if (true) {
            if (!img.getResourceLink()) {
                throw new debugError["a" /* DebugError */]("image resource link is not set");
            }
            if (!img.getResourceLink().getTarget()) {
                console.error(img);
                throw new debugError["a" /* DebugError */]("no target associated with resource link");
            }
        }
        this.beforeItemDraw(img.filters.length, img.blendMode);
        var texture = img.getResourceLink().getTarget();
        var maxSize = Math.max(img.size.width, img.size.height);
        var sd = this.shapeDrawerHolder.getInstance(this.gl);
        this.prepareShapeUniformInfo(img);
        sd.setUniform(sd.u_borderRadius, Math.min(img.borderRadius / maxSize, 1));
        sd.setUniform(sd.u_shapeType, SHAPE_TYPE.RECT);
        sd.setUniform(sd.u_fillType, FILL_TYPE.TEXTURE);
        var _a = texture.size, srcWidth = _a.width, srcHeight = _a.height;
        var _b = img.getSrcRect().point, srcRectX = _b.x, srcRectY = _b.y;
        var _c = img.getSrcRect().size, srcRectWidth = _c.width, srcRectHeight = _c.height;
        var srcArr = geometry_rect["a" /* Rect */].fromPool().setXYWH(srcRectX / srcWidth, srcRectY / srcHeight, srcRectWidth / srcWidth, srcRectHeight / srcHeight).release().toArray();
        sd.setUniform(sd.u_texRect, srcArr);
        var offSetArr = geometry_size["a" /* Size */].fromPool().setWH(img.offset.x / maxSize, img.offset.y / maxSize).release().toArray();
        sd.setUniform(sd.u_texOffset, offSetArr);
        sd.setUniform(sd.u_stretchMode, img.stretchMode);
        sd.attachTexture('texture', texture);
        sd.draw();
        this.afterItemDraw(img.filters, img.blendMode);
    };
    WebGlRenderer.prototype.drawMesh = function (mesh) {
        var md = this.meshDrawerHolder.getInstance(this.gl);
        md.bindModel(mesh);
        md.bind();
        if (mesh.invertY)
            this.matrixStack.scale(1, -1, 1);
        var matrix1 = this.matrixStack.getCurrentMatrix();
        var projectionMatrix = webGlRenderer_Mat16Holder.fromPool();
        mat4["a" /* mat4 */].ortho(projectionMatrix, 0, this.game.width, 0, this.game.height, -SCENE_DEPTH, SCENE_DEPTH);
        var matrix2 = webGlRenderer_Mat16Holder.fromPool();
        mat4["a" /* mat4 */].matrixMultiply(matrix2, projectionMatrix, zToWMatrix);
        md.setModelMatrix(matrix1.mat16);
        md.setProjectionMatrix(matrix2.mat16);
        md.setAlfa(mesh.alpha);
        var isTextureUsed = !!mesh.texture;
        md.setTextureUsed(isTextureUsed);
        md.setLightUsed(mesh.isLightAccepted());
        md.setColor(mesh.fillColor);
        md.attachTexture('u_texture', mesh.texture ? mesh.texture : this.nullTexture);
        if (mesh.depthTest)
            this.gl.enable(this.gl.DEPTH_TEST);
        md.draw();
        md.unbind();
        this.gl.disable(this.gl.DEPTH_TEST);
        zToWMatrix.release();
        projectionMatrix.release();
        matrix2.release();
    };
    WebGlRenderer.prototype.drawRectangle = function (rectangle) {
        var _a = rectangle.size, rw = _a.width, rh = _a.height;
        var maxSize = Math.max(rw, rh);
        var sd = this.shapeDrawerHolder.getInstance(this.gl);
        this.beforeItemDraw(rectangle.filters.length, rectangle.blendMode);
        this.prepareShapeUniformInfo(rectangle);
        sd.setUniform(sd.u_borderRadius, Math.min(rectangle.borderRadius / maxSize, 1));
        sd.setUniform(sd.u_shapeType, SHAPE_TYPE.RECT);
        sd.attachTexture('texture', this.nullTexture);
        sd.draw();
        this.afterItemDraw(rectangle.filters, rectangle.blendMode);
    };
    WebGlRenderer.prototype.drawLine = function (line) {
        var r = line.getRectangleRepresentation();
        this.drawRectangle(r);
    };
    WebGlRenderer.prototype.drawEllipse = function (ellipse) {
        var maxR = Math.max(ellipse.radiusX, ellipse.radiusY);
        var maxR2 = maxR * 2;
        this.beforeItemDraw(ellipse.filters.length, ellipse.blendMode);
        this.prepareShapeUniformInfo(ellipse);
        var sd = this.shapeDrawerHolder.getInstance(this.gl);
        var rect = geometry_rect["a" /* Rect */].fromPool();
        rect.setXYWH(0, 0, maxR2, maxR2);
        var size = geometry_size["a" /* Size */].fromPool();
        size.setWH(this.game.width, this.game.height);
        var pos16h = makePositionMatrix(rect, size, this.matrixStack);
        sd.setUniform(sd.u_vertexMatrix, pos16h.mat16);
        pos16h.release();
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
        sd.setUniform(sd.u_shapeType, SHAPE_TYPE.ELLIPSE);
        sd.setUniform(sd.u_width, 1);
        sd.setUniform(sd.u_height, 1);
        sd.setUniform(sd.u_rectOffsetLeft, 1);
        sd.setUniform(sd.u_rectOffsetTop, 1);
        sd.setUniform(sd.u_arcAngleFrom, ellipse.arcAngleFrom);
        sd.setUniform(sd.u_arcAngleTo, ellipse.arcAngleTo);
        sd.attachTexture('texture', this.nullTexture);
        sd.draw();
        this.afterItemDraw(ellipse.filters, ellipse.blendMode);
    };
    WebGlRenderer.prototype.setAlpha = function (a) {
        if (true)
            throw new debugError["a" /* DebugError */]('not implemented');
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
    WebGlRenderer.prototype.rotateX = function (angleInRadians) {
        this.matrixStack.rotateX(angleInRadians);
    };
    WebGlRenderer.prototype.rotateY = function (angleInRadians) {
        this.matrixStack.rotateY(angleInRadians);
    };
    WebGlRenderer.prototype.rotateZ = function (angleInRadians) {
        this.matrixStack.rotateZ(angleInRadians);
    };
    WebGlRenderer.prototype.translate = function (x, y, z) {
        if (z === void 0) { z = 0; }
        this.matrixStack.translate(x, y, z);
    };
    WebGlRenderer.prototype.skewX = function (angle) {
        this.matrixStack.skewX(angle);
    };
    WebGlRenderer.prototype.skewY = function (angle) {
        this.matrixStack.skewY(angle);
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
    WebGlRenderer.prototype.beforeFrameDraw = function (color) {
        this.save();
        this.finalFrameBuffer.bind();
        this.finalFrameBuffer.clear(color);
    };
    WebGlRenderer.prototype.afterFrameDraw = function (filters) {
        var texToDraw = this.doubleFrameBuffer.applyFilters(this.finalFrameBuffer.getTexture(), filters);
        this.finalFrameBuffer.unbind();
        this.gl.viewport(0, 0, this.fullScreenSize.width, this.fullScreenSize.height);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix, FLIP_TEXTURE_MATRIX.mat16);
        this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix, FLIP_POSITION_MATRIX.mat16);
        this.simpleRectDrawer.attachTexture('texture', texToDraw);
        this.simpleRectDrawer.draw();
        this.restore();
    };
    WebGlRenderer.prototype.getError = function () {
        if (false)
            {}
        var err = this.gl.getError();
        if (err !== this.gl.NO_ERROR) {
            console.log(abstractDrawer["a" /* AbstractDrawer */].currentInstance);
            return { code: err, desc: glEnumToString(this.gl, err) };
        }
        return undefined;
    };
    WebGlRenderer.prototype.putToCache = function (l, t) {
        var url = l.getUrl();
        if ( true && !url)
            throw new debugError["a" /* DebugError */]("no url is associated with resource link");
        this.renderableCache[url] = t;
    };
    WebGlRenderer.prototype.loadTextureInfo = function (url, link, onLoad) {
        var _this = this;
        var possibleTargetInCache = this.renderableCache[link.getUrl()];
        if (possibleTargetInCache) {
            link.setTarget(possibleTargetInCache);
            onLoad();
            return;
        }
        var img = new window.Image();
        img.src = url;
        img.onload = function () {
            var texture = new base_texture["a" /* Texture */](_this.gl);
            texture.setImage(img);
            _this.gl.bindTexture(_this.gl.TEXTURE_2D, _this.finalFrameBuffer.getTexture().getGlTexture());
            _this.putToCache(link, texture);
            link.setTarget(texture);
            onLoad();
        };
        if (true) {
            img.onerror = function () {
                throw new debugError["a" /* DebugError */]("Resource loading error: can not load resource with url \"" + url + "\"");
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
        this.shapeDrawerHolder.destroy();
        this.meshDrawerHolder.destroy();
        this.simpleRectDrawer.destroy();
        Object.keys(this.renderableCache).forEach(function (key) {
            var t = _this.renderableCache[key];
            t.destroy();
        });
    };
    WebGlRenderer.prototype._init = function () {
        var gl = getCtx(this.container);
        if ( true && !gl)
            throw new debugError["a" /* DebugError */]("WebGLRenderingContext is not supported by this device");
        this.gl = gl;
        this.nullTexture = new base_texture["a" /* Texture */](gl);
        this.simpleRectDrawer = new simpleRectDrawer["a" /* SimpleRectDrawer */](gl);
        this.simpleRectDrawer.prepareShaderGenerator();
        this.simpleRectDrawer.initProgram();
        this.preprocessFrameBuffer = new frameBuffer_FrameBuffer(gl, this.game.width, this.game.height);
        this.finalFrameBuffer = new frameBuffer_FrameBuffer(gl, this.game.width, this.game.height);
        this.doubleFrameBuffer = new doubleFrameBuffer_DoubleFrameBuffer(gl, this.game.width, this.game.height);
        this.blender = new blender_Blender(this.gl);
        this.blender.enable();
        this.blender.setBlendMode(renderableModel["a" /* BLEND_MODE */].NORMAL);
    };
    WebGlRenderer.prototype.prepareShapeUniformInfo = function (shape) {
        var _a = shape.size, rw = _a.width, rh = _a.height;
        var maxSize = Math.max(rw, rh);
        var sd = this.shapeDrawerHolder.getInstance(this.gl);
        var offsetX = 0, offsetY = 0;
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
        var rect = geometry_rect["a" /* Rect */].fromPool();
        rect.setXYWH(-offsetX, -offsetY, maxSize, maxSize);
        var size = geometry_size["a" /* Size */].fromPool();
        size.setWH(this.game.width, this.game.height);
        var pos16h = makePositionMatrix(rect, size, this.matrixStack);
        sd.setUniform(sd.u_vertexMatrix, pos16h.mat16);
        pos16h.release();
        rect.release();
        size.release();
        sd.setUniform(sd.u_lineWidth, Math.min(shape.lineWidth / maxSize, 1));
        sd.setUniform(sd.u_color, shape.color.asGL());
        sd.setUniform(sd.u_alpha, shape.alpha);
        var repeatFactor = geometry_size["a" /* Size */].fromPool();
        repeatFactor.setWH(shape.size.width / shape.getSrcRect().size.width, shape.size.height / shape.getSrcRect().size.height);
        sd.setUniform(sd.u_repeatFactor, repeatFactor.toArray());
        repeatFactor.release();
        sd.setUniform(sd.u_stretchMode, geometry_image["b" /* STRETCH_MODE */].STRETCH);
        if (shape.fillColor.type === 'LinearGradient') {
            sd.setUniform(sd.u_fillLinearGradient, shape.fillColor.asGL());
            sd.setUniform(sd.u_fillType, FILL_TYPE.LINEAR_GRADIENT);
        }
        else if (shape.fillColor.type === 'Color') {
            sd.setUniform(sd.u_fillColor, shape.fillColor.asGL());
            sd.setUniform(sd.u_fillType, FILL_TYPE.COLOR);
        }
    };
    WebGlRenderer.prototype.beforeItemDraw = function (numOfFilters, blendMode) {
        if (numOfFilters > 0 || blendMode !== renderableModel["a" /* BLEND_MODE */].NORMAL) {
            this.preprocessFrameBuffer.bind();
            this.preprocessFrameBuffer.clear(BLACK);
            this.blender.setBlendMode(renderableModel["a" /* BLEND_MODE */].NORMAL);
        }
        else {
            this.finalFrameBuffer.bind();
        }
    };
    WebGlRenderer.prototype.afterItemDraw = function (filters, blendMode) {
        if (filters.length > 0 || blendMode !== renderableModel["a" /* BLEND_MODE */].NORMAL) {
            this.blender.setBlendMode(renderableModel["a" /* BLEND_MODE */].NORMAL);
            var filteredTexture = this.doubleFrameBuffer.applyFilters(this.preprocessFrameBuffer.getTexture(), filters);
            this.blender.setBlendMode(blendMode);
            this.finalFrameBuffer.bind();
            this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_textureMatrix, IDENTITY);
            this.simpleRectDrawer.setUniform(this.simpleRectDrawer.u_vertexMatrix, FLIP_POSITION_MATRIX.mat16);
            this.simpleRectDrawer.attachTexture('texture', filteredTexture);
            this.simpleRectDrawer.draw();
            this.blender.setBlendMode(renderableModel["a" /* BLEND_MODE */].NORMAL);
        }
    };
    return WebGlRenderer;
}(abstractCanvasRenderer["a" /* AbstractCanvasRenderer */]));



/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoaderUtil; });
/* harmony import */ var _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);

var LoaderUtil;
(function (LoaderUtil) {
    LoaderUtil.loadRaw = function (url, responsetype, onLoad) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = responsetype;
        if (responsetype !== 'text') {
            request.setRequestHeader('Accept-Ranges', 'bytes');
            request.setRequestHeader('Content-Range', 'bytes');
        }
        request.onload = function () {
            if (request.readyState === 4) {
                if (request.status === 200)
                    onLoad(request.response);
                else if (true) {
                    throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not load resource with url '" + url + "', status " + request.status);
                }
            }
        };
        request.onprogress = function (e) {
        };
        if (true) {
            request.onerror = function (e) {
                console.error(e);
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not load resource with url " + url);
            };
            request.ontimeout = function (e) {
                console.error(e);
                throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_0__[/* DebugError */ "a"]("can not load resource with url " + url + ", timeout!");
            };
        }
        request.send();
    };
})(LoaderUtil || (LoaderUtil = {}));


/***/ }),
/* 43 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(1);

// EXTERNAL MODULE: ./engine/model/impl/ui/components/textField.ts + 2 modules
var components_textField = __webpack_require__(38);

// CONCATENATED MODULE: ./engine/misc/device.ts
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


// EXTERNAL MODULE: ./engine/game.ts + 1 modules
var engine_game = __webpack_require__(10);

// EXTERNAL MODULE: ./engine/geometry/size.ts
var size = __webpack_require__(9);

// EXTERNAL MODULE: ./engine/model/impl/general/font.ts
var font = __webpack_require__(39);

// CONCATENATED MODULE: ./engine/renderer/abstract/abstractRenderer.ts





var abstractRenderer_AbstractRenderer = (function () {
    function AbstractRenderer(game) {
        this.game = game;
        this.fullScreenSize = new size["a" /* Size */](0, 0);
        this.renderableCache = {};
        this.game = game;
        if (Device.isCocoonJS) {
            var dpr = window.devicePixelRatio || 1;
            this.fullScreenSize.setW(window.innerWidth * dpr);
            this.fullScreenSize.setH(window.innerHeight * dpr);
        }
        else {
            this.fullScreenSize.setWH(this.game.width, this.game.height);
        }
    }
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
    AbstractRenderer.prototype.beforeFrameDraw = function (color) { };
    AbstractRenderer.prototype.afterFrameDraw = function (filters) { };
    AbstractRenderer.prototype.registerResize = function () {
        var _this = this;
        this.onResize();
        window.addEventListener('resize', function () { return _this.onResize(); });
    };
    AbstractRenderer.prototype.destroy = function () {
        window.removeEventListener('resize', this.onResize);
    };
    AbstractRenderer.prototype.getError = function () {
        return undefined;
    };
    AbstractRenderer.prototype.drawImage = function (img) { };
    AbstractRenderer.prototype.drawNinePatch = function (img) { };
    AbstractRenderer.prototype.drawRectangle = function (rectangle) { };
    AbstractRenderer.prototype.lockRect = function (rect) { };
    AbstractRenderer.prototype.unlockRect = function () { };
    AbstractRenderer.prototype.drawLine = function (line) { };
    AbstractRenderer.prototype.drawMesh = function (m) { };
    AbstractRenderer.prototype.drawEllipse = function (ellispe) { };
    AbstractRenderer.prototype.resetTransform = function () { };
    AbstractRenderer.prototype.save = function () { };
    AbstractRenderer.prototype.restore = function () { };
    AbstractRenderer.prototype.translate = function (x, y, z) {
        if (z === void 0) { z = 0; }
    };
    AbstractRenderer.prototype.scale = function (x, y, z) {
        if (z === void 0) { z = 0; }
    };
    AbstractRenderer.prototype.rotateX = function (a) { };
    AbstractRenderer.prototype.skewX = function (a) { };
    AbstractRenderer.prototype.skewY = function (a) { };
    AbstractRenderer.prototype.rotateY = function (a) { };
    AbstractRenderer.prototype.rotateZ = function (a) { };
    AbstractRenderer.prototype.killObject = function (r) { };
    AbstractRenderer.prototype.log = function (args) {
        if (false)
            {}
        var textField = this.debugTextField;
        if (!textField) {
            textField = new components_textField["b" /* TextField */](this.game);
            textField.setFont(font["a" /* Font */].getSystemFont());
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
            else if (typeof txt === 'function') {
                txt = txt.toString();
            }
            else {
                if (typeof txt !== 'string') {
                    try {
                        txt = JSON.stringify(txt);
                    }
                    catch (e) {
                        txt = txt.toString();
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
    AbstractRenderer.prototype.onResize = function () {
        var container = this.container;
        if (this.game.scaleStrategy === engine_game["b" /* SCALE_STRATEGY */].NO_SCALE)
            return;
        else if (this.game.scaleStrategy === engine_game["b" /* SCALE_STRATEGY */].STRETCH) {
            var innerWidth = window.innerWidth;
            var innerHeight = window.innerHeight;
            container.style.width = innerWidth + "px";
            container.style.height = innerHeight + "px";
            this.game.scale.setXY(innerWidth / this.game.width, innerHeight / this.game.height);
            this.game.pos.setXY(0);
            return;
        }
        var canvasRatio = this.game.height / this.game.width;
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
    return AbstractRenderer;
}());


// CONCATENATED MODULE: ./engine/renderer/abstract/abstractCanvasRenderer.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return abstractCanvasRenderer_AbstractCanvasRenderer; });


var abstractCanvasRenderer_AbstractCanvasRenderer = (function (_super) {
    tslib_es6["c" /* __extends */](AbstractCanvasRenderer, _super);
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
    return AbstractCanvasRenderer;
}(abstractRenderer_AbstractRenderer));



/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./engine/model/impl/general/layer.ts
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
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var obj = _a[_i];
            obj.render();
        }
    };
    return Layer;
}());


// EXTERNAL MODULE: ./engine/renderer/color.ts
var color = __webpack_require__(7);

// EXTERNAL MODULE: ./engine/renderer/camera.ts
var camera = __webpack_require__(22);

// EXTERNAL MODULE: ./engine/resources/resourceLoader.ts + 1 modules
var resourceLoader = __webpack_require__(32);

// EXTERNAL MODULE: ./engine/misc/object.ts
var object = __webpack_require__(12);

// EXTERNAL MODULE: ./engine/delegates/tweenableDelegate.ts
var tweenableDelegate = __webpack_require__(28);

// EXTERNAL MODULE: ./engine/delegates/timerDelegate.ts + 1 modules
var timerDelegate = __webpack_require__(33);

// EXTERNAL MODULE: ./engine/delegates/eventEmitterDelegate.ts
var eventEmitterDelegate = __webpack_require__(24);

// CONCATENATED MODULE: ./engine/model/impl/general/scene.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return scene_Scene; });








var scene_Scene = (function () {
    function Scene(game) {
        this.game = game;
        this.type = "Scene";
        this.colorBG = color["a" /* Color */].WHITE.clone();
        this.filters = [];
        this._layers = [];
        this._tweenDelegate = new tweenableDelegate["a" /* TweenableDelegate */]();
        this._timerDelegate = new timerDelegate["a" /* TimerDelegate */]();
        this._eventEmitterDelegate = new eventEmitterDelegate["a" /* EventEmitterDelegate */]();
        this._uiLayer = new Layer(this.game);
        this.addLayer(new Layer(game));
        this.resourceLoader = new resourceLoader["a" /* ResourceLoader */](game);
    }
    Scene.prototype.revalidate = function () {
        if (!this.width) {
            this.width = this.game.width;
        }
        if (!this.height) {
            this.height = this.game.height;
        }
    };
    Scene.prototype.getLayers = function () {
        return this._layers;
    };
    Scene.prototype.getUiLayer = function () {
        return this._uiLayer;
    };
    Scene.prototype.getDefaultLayer = function () {
        return this._layers[0];
    };
    Scene.prototype.addLayer = function (layer) {
        this._layers.push(layer);
    };
    Scene.prototype.removeLayer = function (layer) {
        Object(object["d" /* removeFromArray */])(this._layers, function (it) { return it === layer; });
    };
    Scene.prototype.appendChild = function (go) {
        go.revalidate();
        this.getDefaultLayer().appendChild(go);
    };
    Scene.prototype.prependChild = function (go) {
        this.getDefaultLayer().prependChild(go);
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
    Scene.prototype.render = function () {
        this.beforeRender();
        var renderer = this.game.getRenderer();
        renderer.beforeFrameDraw(this.colorBG);
        this.game.camera.matrixMode = camera["a" /* CAMERA_MATRIX_MODE */].MODE_TRANSFORM;
        if (!this.resourceLoader.isCompleted()) {
            if (this.preloadingGameObject !== undefined) {
                this.renderPreloadingFrame();
            }
        }
        else {
            this.renderMainFrame();
        }
        renderer.afterFrameDraw(this.filters);
    };
    Scene.prototype.addTween = function (t) {
        this._tweenDelegate.addTween(t);
    };
    Scene.prototype.addTweenMovie = function (tm) {
        this._tweenDelegate.addTweenMovie(tm);
    };
    Scene.prototype.tween = function (desc) {
        return this._tweenDelegate.tween(desc);
    };
    Scene.prototype.setTimeout = function (callback, interval) {
        return this._timerDelegate.setTimeout(callback, interval);
    };
    Scene.prototype.setInterval = function (callback, interval) {
        return this._timerDelegate.setInterval(callback, interval);
    };
    Scene.prototype.off = function (eventName, callBack) {
        this._eventEmitterDelegate.off(eventName, callBack);
    };
    Scene.prototype.on = function (eventName, callBack) {
        return this._eventEmitterDelegate.on(eventName, callBack);
    };
    Scene.prototype.trigger = function (eventName, data) {
        this._eventEmitterDelegate.trigger(eventName, data);
    };
    Scene.prototype.destroy = function () {
        this.onDestroy();
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
        this.beforeUpdate();
        this.game.camera.update();
        this._tweenDelegate.update();
        this._timerDelegate.update();
        for (var _i = 0, _a = this._layers; _i < _a.length; _i++) {
            var l = _a[_i];
            l.update();
        }
        this._uiLayer.update();
        this.onUpdate();
    };
    Scene.prototype.renderMainFrame = function () {
        var renderer = this.game.getRenderer();
        renderer.save();
        this.game.camera.render();
        for (var _i = 0, _a = this._layers; _i < _a.length; _i++) {
            var l = _a[_i];
            l.render();
        }
        this.game.camera.matrixMode = camera["a" /* CAMERA_MATRIX_MODE */].MODE_TRANSFORM;
        this.onRender();
        renderer.restore();
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
    return Scene;
}());



/***/ }),
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GameObject; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _abstract_renderableModel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);



var GameObject = (function (_super) {
    tslib__WEBPACK_IMPORTED_MODULE_0__[/* __extends */ "c"](GameObject, _super);
    function GameObject(game) {
        var _this = _super.call(this, game) || this;
        _this.type = 'GameObject';
        _this.groupNames = [];
        _this.collideWith = [];
        _this._frameAnimations = {};
        return _this;
    }
    GameObject.prototype.revalidate = function () {
        var _this = this;
        this.sprite.revalidate();
        Object.keys(this._frameAnimations).forEach(function (key) {
            _this._frameAnimations[key].revalidate();
        });
        this.size.set(this.sprite.getSrcRect().size);
        _super.prototype.revalidate.call(this);
    };
    GameObject.prototype.clone = function () {
        var cloned = new GameObject(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    };
    GameObject.prototype.addFrameAnimation = function (name, fa) {
        fa.name = name;
        this._frameAnimations[name] = fa;
        fa.parent = this;
    };
    GameObject.prototype.playFrameAnimation = function (fr) {
        var frameAnimation;
        if (typeof fr === 'string') {
            frameAnimation = this._frameAnimations[fr];
        }
        else
            frameAnimation = fr;
        if ( true && !frameAnimation)
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_2__[/* DebugError */ "a"]("no such frame animation: '" + fr + "'");
        if (this._currFrameAnimation)
            this._currFrameAnimation.stop();
        this._currFrameAnimation = frameAnimation;
        frameAnimation.play();
    };
    GameObject.prototype.stopFrameAnimation = function () {
        this._currFrameAnimation.stop();
        this._currFrameAnimation = null;
    };
    GameObject.prototype.update = function () {
        _super.prototype.update.call(this);
        this.sprite.update();
        if (this._currFrameAnimation)
            this._currFrameAnimation.update();
    };
    GameObject.prototype.draw = function () {
        this.sprite.draw();
        return true;
    };
    GameObject.prototype.kill = function () {
        _super.prototype.kill.call(this);
    };
    GameObject.prototype.setClonedProperties = function (cloned) {
        var _this = this;
        if ( true && !('clone' in this.sprite)) {
            console.error(this.sprite);
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_2__[/* DebugError */ "a"]("can not clone sprite: cloneable interface is not implemented");
        }
        var clonedSprite = this.sprite.clone();
        if ( true && !(clonedSprite instanceof _abstract_renderableModel__WEBPACK_IMPORTED_MODULE_1__[/* RenderableModel */ "b"])) {
            console.error(this.sprite);
            throw new _engine_debug_debugError__WEBPACK_IMPORTED_MODULE_2__[/* DebugError */ "a"]("can not clone sprite: \"clone\"  method must return Renderable object");
        }
        cloned.sprite = clonedSprite;
        Object.keys(this._frameAnimations).forEach(function (key) {
            var fr = _this._frameAnimations[key].clone();
            fr.afterCloned(cloned);
            cloned.addFrameAnimation(key, fr);
        });
        if (this._currFrameAnimation)
            cloned._currFrameAnimation = cloned._frameAnimations[this._currFrameAnimation.name];
        _super.prototype.setClonedProperties.call(this, cloned);
    };
    return GameObject;
}(_abstract_renderableModel__WEBPACK_IMPORTED_MODULE_1__[/* RenderableModel */ "b"]));



/***/ }),
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */
/***/ (function(module, exports) {

module.exports = "data:image/jpeg;base64,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"

/***/ }),
/* 67 */,
/* 68 */,
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(129);


/***/ }),
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(1);

// EXTERNAL MODULE: ./engine/model/impl/general/gameObject.ts
var gameObject = __webpack_require__(49);

// EXTERNAL MODULE: ./engine/model/impl/general/scene.ts + 1 modules
var scene = __webpack_require__(44);

// EXTERNAL MODULE: ./engine/model/impl/geometry/image.ts
var geometry_image = __webpack_require__(15);

// EXTERNAL MODULE: ./demo/assets/engine.jpg
var engine = __webpack_require__(66);

// CONCATENATED MODULE: ./demo/basicBase64/mainScene.ts





var mainScene_MainScene = (function (_super) {
    tslib_es6["c" /* __extends */](MainScene, _super);
    function MainScene() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainScene.prototype.onPreloading = function () {
        this.resourceLink = this.resourceLoader.loadImage(engine);
    };
    MainScene.prototype.onReady = function () {
        return tslib_es6["b" /* __awaiter */](this, void 0, void 0, function () {
            var spr;
            return tslib_es6["d" /* __generator */](this, function (_a) {
                this.logoObj = new gameObject["a" /* GameObject */](this.game);
                spr = new geometry_image["a" /* Image */](this.game);
                spr.setResourceLink(this.resourceLink);
                this.logoObj.sprite = spr;
                this.logoObj.pos.fromJSON({ x: 10, y: 10 });
                this.appendChild(this.logoObj);
                return [2];
            });
        });
    };
    return MainScene;
}(scene["a" /* Scene */]));


// EXTERNAL MODULE: ./engine/game.ts + 1 modules
var game = __webpack_require__(10);

// EXTERNAL MODULE: ./engine/renderer/webGl/webGlRenderer.ts + 8 modules
var webGlRenderer = __webpack_require__(41);

// CONCATENATED MODULE: ./demo/basicBase64/index.ts



var basicBase64_game = new game["a" /* Game */]();
basicBase64_game.setRenderer(webGlRenderer["a" /* WebGlRenderer */]);
var mainScene = new mainScene_MainScene(basicBase64_game);
basicBase64_game.runScene(mainScene);


/***/ })
/******/ ]);
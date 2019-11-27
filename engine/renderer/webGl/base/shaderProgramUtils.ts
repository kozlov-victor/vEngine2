import {DebugError} from "@engine/debug/debugError";
import {ShaderProgram} from "./shaderProgram";
import {Int, Optional} from "@engine/core/declarations";
import {IKeyVal, isArray} from "@engine/misc/object";


interface IShaderErrorInfo {
    message:string;
    lineNum:number;
}

const parseErrors = (log:string):IShaderErrorInfo[]=> {
    if (!DEBUG) return [];
    const logs:IShaderErrorInfo[] = [];
    let result:RegExpMatchArray|null;

    while (!!(result = log.match(/ERROR\:([^\n]+)/))) {
        if (result.index!==undefined) log = log.slice((result.index + 1));

        const line:string = result[1].trim();
        const seps:string[] = line.split(':');
        const message:string = seps.slice(2).join(':').trim();
        const lineNum:number = +seps[1];
        logs.push({message, lineNum});
    }

    return logs;
};

export const compileShader = (gl:WebGLRenderingContext, shaderSource:string, shaderType:number):Optional<WebGLShader>=> {
    if (DEBUG) {
        if (!shaderSource) throw new DebugError(`can not compile shader: shader source not specified for type ${shaderType}`);
    }
    // Create the shader object
    const shader:WebGLShader = gl.createShader(shaderType)!;
    if (DEBUG && !shader) throw new DebugError(`can not allocate memory for shader: gl.createShader(shaderType)`);

    // Load the shader source
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check the compile status
    const compiled:number = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        // Something went wrong during compilation; get the error
        const lastError:string|null = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        if (lastError!==null) {
            if (DEBUG) {
                const parsedLogs = parseErrors(lastError!);
                const lines:string[] = shaderSource.split('\n');
                let errorMsg:string = '';
                const arrow:string = '----->';
                parsedLogs.forEach((inf:IShaderErrorInfo)=>{
                    const i:number = inf.lineNum-1;
                    if (lines[i].indexOf(arrow)===-1) lines[i]=`${arrow} ${lines[i]}`;
                    errorMsg+=`${lines[i]} <----${inf.message}\n`;
                });
                console.log(lines.join('\n'));
                throw new DebugError(`Error compiling shader: ${errorMsg?errorMsg:lastError}`);
            } else {
                throw new Error(lastError);
            }
        } else {
            throw new Error(DEBUG?'unknown compilation error':'');
        }


    }

    return shader || undefined;
};


export const createProgram = (gl:WebGLRenderingContext, vertexShader:WebGLShader,fragmentShader:WebGLShader):WebGLProgram=> {
    const program:WebGLProgram = gl.createProgram() as WebGLProgram;
    if (DEBUG && !program) throw new DebugError(`can not allocate memory for gl.createProgram()`);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // Check the link status
    const linked:boolean = gl.getProgramParameter(program, gl.LINK_STATUS) as boolean;
    if (!linked) {
        // something went wrong with the link
        const lastError:string|null = gl.getProgramInfoLog(program);
        if (lastError) {
            if (DEBUG) {
                const status:number|string = gl.getProgramParameter( program, gl.VALIDATE_STATUS);
                console.error('VALIDATE_STATUS',status);
                const vertexSource:string = gl.getShaderSource(vertexShader) as string;
                const fragmentSource:string = gl.getShaderSource(fragmentShader) as string;
                console.log(vertexSource);
                console.log('\n\n');
                console.log(fragmentSource);
                gl.deleteProgram(program);
                throw new DebugError(`Error in program linking. Last error "${lastError}", status: ${status}`);
            } else {
                gl.deleteProgram(program);
                throw new Error(lastError);
            }
        } else {
            throw new Error(DEBUG?'unknown linking error':'');
        }


    }
    return program;
};

let GL_TABLE:Optional<IKeyVal<string>>;

export const GL_TYPE = {
    FLOAT:      'float',
    FLOAT_VEC2: 'vec2',
    FLOAT_VEC3: 'vec3',
    FLOAT_VEC4: 'vec4',

    INT:        'int',
    INT_VEC2: 'ivec2',
    INT_VEC3: 'ivec3',
    INT_VEC4: 'ivec4',

    BOOL:       'bool',
    BOOL_VEC2: 'bvec2',
    BOOL_VEC3: 'bvec3',
    BOOL_VEC4: 'bvec4',

    FLOAT_MAT2: 'mat2',
    FLOAT_MAT3: 'mat3',
    FLOAT_MAT4: 'mat4',

    SAMPLER_2D: 'sampler2D',
    //SAMPLER_CUBE: 'samplerCube',
};

const mapType = (gl:WebGLRenderingContext, type:number):string=> {

    if (GL_TABLE===undefined) {
        const typeNames:string[] = Object.keys(GL_TYPE);

        GL_TABLE = {} as IKeyVal<string>;

        for (let i:number = 0; i < typeNames.length; ++i) {
            const tn:string = typeNames[i];
            GL_TABLE[(gl as unknown as IKeyVal<string>)[tn]] = (GL_TYPE as unknown as IKeyVal<string>)[tn]; //todo
        }
    }

    return GL_TABLE[type];
};

type GL = WebGLRenderingContext;
type LOC = WebGLUniformLocation;

export type UNIFORM_VALUE_PRIMITIVE_TYPE = number|Int|boolean;
export type UNIFORM_VALUE_TYPE = UNIFORM_VALUE_PRIMITIVE_TYPE|UNIFORM_VALUE_PRIMITIVE_TYPE[];

type UNIFORM_SETTER = (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=>void;


export interface IUniformWrapper {
    type:string;
    size:number;
    location: LOC;
    setter: UNIFORM_SETTER;
}

export interface IUniformsMap {
    [key:string]:IUniformWrapper;
}

export interface IAttributesMap {
    [key:string]:number;
}

export  const normalizeUniformName =(s:string):string=>{
    if (DEBUG && s.indexOf(' ')>-1) throw new DebugError(`bad uniform name: "${s}", check spaces!`);
    else return s;
};


export const extractUniforms = (gl:WebGLRenderingContext, program:ShaderProgram):IUniformsMap=> {
    const glProgram:WebGLProgram = program.getProgram();
    const activeUniforms:Int = gl.getProgramParameter(glProgram, gl.ACTIVE_UNIFORMS) as Int;
    const uniforms:IUniformsMap = {};

    for (let i:number = 0; i < activeUniforms; i++) {
        const uniformData:WebGLActiveInfo = gl.getActiveUniform(glProgram, i) as WebGLActiveInfo;
        if (DEBUG && !uniformData) throw new DebugError(`can not receive active uniforms info: gl.getActiveUniform()`);
        const type:string = mapType(gl, uniformData.type);
        const name:string = normalizeUniformName(uniformData.name);
        const location:WebGLUniformLocation = gl.getUniformLocation(glProgram, name)!;
        if (DEBUG && location===null) {
            // todo ie provide attrData.name but can not find location of unused attr
            console.log(program);
            throw new DebugError(`error finding uniform location: ${uniformData.name}`);
        }
        uniforms[name] = {
            type,
            size: uniformData.size,
            location,
            setter: getUniformSetter(uniformData.size,type)
        } as IUniformWrapper;

        if (name.indexOf('[')>-1) {
            const arrayName:string = name.split('[')[0];
            uniforms[arrayName] = uniforms[name];
        }
    }

    return uniforms;

};


export const extractAttributes = (gl:WebGLRenderingContext, program:ShaderProgram):IAttributesMap=>{
    const glProgram:WebGLProgram = program.getProgram();
    const activeAttributes:number = gl.getProgramParameter(glProgram, gl.ACTIVE_ATTRIBUTES) as number;
    const attrMap:IAttributesMap = {};
    for (let i:number = 0; i < activeAttributes; i++) {
        const attrData:WebGLActiveInfo = gl.getActiveAttrib(glProgram, i) as WebGLActiveInfo;
        if (DEBUG && !attrData) throw new DebugError(`can not receive active attribute info: gl.getActiveAttrib()`);
        const location:number = gl.getAttribLocation(glProgram, attrData.name);
        if (DEBUG && location<0) {
            console.log(program);
            throw new DebugError(`error finding attribute location: ${attrData.name}`);
        }
        attrMap[attrData.name] = location;
    }
    return attrMap;
};

// todo remove to object module
const isNumber = (val:UNIFORM_VALUE_TYPE):val is number=>{
    if (!DEBUG) return true;
    if (isNaN(parseFloat(String(val))) || !isFinite(Number(val)))
        throw new DebugError(`can not set uniform with value ${val}: expected argument of type number`);
    else return true;
};

const isInteger = (val:UNIFORM_VALUE_TYPE):val is number=>{
    if (!DEBUG) return true;
    isNumber(val);
    if (val!==~~val)
        throw new DebugError(`can not set uniform with value ${val}: expected argument of integer type, but ${val} found`);
    else return true;
};

const isBoolean = (val:UNIFORM_VALUE_TYPE):val is boolean=>{
    if (!DEBUG) return true;
    if (!(val===true || val===false))
        throw new DebugError(`can not set uniform with value ${val}: expected argument of boolean type, but ${val} found`);
    else return true;
};

const isArrayOfType = (val:UNIFORM_VALUE_TYPE,checker:(val:UNIFORM_VALUE_TYPE)=>boolean,size:number):val is number[]=> {
    if (!DEBUG) return true;
    if (!val)
        throw new DebugError(`can not set uniform  value: ${val}`);
    if (!isArray(val)) {
        console.error('Can not set uniform value',val);
        throw new DebugError(`can not set uniform with value [${val}]: expected argument of type Array`);
    }
    if (size!==undefined && (val as unknown as UNIFORM_VALUE_TYPE[]).length!==size)
        throw new DebugError(`can not set uniform with value [${val}]: expected array with size ${size}, but ${(val as unknown as UNIFORM_VALUE_TYPE[]).length} found`);
    for (let i:number=0;i<val.length;i++) {
        try {
            checker(val[i]);
        } catch (e){
            console.error('Can not set uniform array item',val);
            throw new DebugError(`can not set uniform array item with value [${val}]: unexpected array element type: ${(val as unknown as UNIFORM_VALUE_TYPE[])[i]}`);
        }
    }
    return true;
};

const getUniformSetter = (size:number,type:string):UNIFORM_SETTER=>{
    if (size===1) {
        switch (type) {
            case GL_TYPE.FLOAT: return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isNumber(value)) gl.uniform1f(location, value);
            };
            case GL_TYPE.FLOAT_VEC2:  return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isNumber,2)) gl.uniform2f(location, value[0], value[1]);
            };
            case GL_TYPE.FLOAT_VEC3:  return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isNumber,3)) gl.uniform3f(location, value[0], value[1], value[2]);
            };
            case GL_TYPE.FLOAT_VEC4:  return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isNumber,4)) gl.uniform4f(location, value[0], value[1], value[2], value[3]);
            };
            case GL_TYPE.INT:   return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isInteger(value)) gl.uniform1i(location, value as number);
            };
            case GL_TYPE.INT_VEC2: return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isInteger,2)) gl.uniform2i(location, value[0], value[1]);
            };
            case GL_TYPE.INT_VEC3: return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isInteger,3)) gl.uniform3i(location, value[0], value[1], value[2]);
            };
            case GL_TYPE.INT_VEC4: return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isInteger,4)) gl.uniform4i(location, value[0], value[1], value[2], value[3]);
            };
            case GL_TYPE.BOOL:  return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> { // todo ?
                if (isBoolean(value)) gl.uniform1i(location, value?1:0);
            };
            case GL_TYPE.BOOL_VEC2: return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isBoolean,2)) gl.uniform2i(location, value[0], value[1]);
            };
            case GL_TYPE.BOOL_VEC3: return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isBoolean,3))  gl.uniform3i(location, value[0], value[1], value[2]);
            };
            case GL_TYPE.BOOL_VEC4: return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isBoolean,4)) gl.uniform4i(location, value[0], value[1], value[2], value[3]);
            };
            case GL_TYPE.FLOAT_MAT2:  return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isNumber,2*2)) gl.uniformMatrix2fv(location, false, value as number[]); // location, transpose (Must be false), value
            };
            case GL_TYPE.FLOAT_MAT3:  return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isNumber,3*3)) gl.uniformMatrix3fv(location, false, value as number[]);
            };
            case GL_TYPE.FLOAT_MAT4:  return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isNumber,4*4)) gl.uniformMatrix4fv(location, false, value as number[]);
            };
            case GL_TYPE.SAMPLER_2D:return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isNumber(value)) gl.uniform1i(location, value);
            };
            default:
                if (DEBUG) throw new DebugError(`can not set uniform for type ${type} and size ${size}`);
                break;
        }
    } else {
        switch (type) {
            // ie
            // glsl:
            // uniform vec2 u_someVec2[3]
            // js:  u_someVec2 = [0,1, 2,3, 4,5];
            case GL_TYPE.FLOAT: return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isNumber,size)) gl.uniform1fv(location, value);
            };
            case GL_TYPE.FLOAT_VEC2:  return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isNumber,size*2)) gl.uniform2fv(location, value as number[]);
            };
            case GL_TYPE.FLOAT_VEC3:  return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isNumber,size*3)) gl.uniform3fv(location, value as number[]);
            };
            case GL_TYPE.FLOAT_VEC4:  return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isNumber,size*4)) gl.uniform4fv(location, value as number[]);
            };
            case GL_TYPE.INT:   return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isInteger,size)) gl.uniform1iv(location, value);
            };
            case GL_TYPE.INT_VEC2: return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isInteger,size*2)) gl.uniform2iv(location, value);
            };
            case GL_TYPE.INT_VEC3: return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isInteger,size*3)) gl.uniform3iv(location, value);
            };
            case GL_TYPE.INT_VEC4: return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isInteger,size*4)) gl.uniform4iv(location, value);
            };
            case GL_TYPE.BOOL:  return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isBoolean,size)) gl.uniform1iv(location, value);
            };
            case GL_TYPE.BOOL_VEC2: return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isBoolean,size*2)) gl.uniform2iv(location, value);
            };
            case GL_TYPE.BOOL_VEC3: return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isBoolean,size*3)) gl.uniform3iv(location, value as number[]);
            };
            case GL_TYPE.BOOL_VEC4: return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isBoolean,size*4)) gl.uniform4iv(location, value);
            };
            case GL_TYPE.SAMPLER_2D:return (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=> {
                if (isArrayOfType(value,isInteger,size)) gl.uniform1iv(location, value);
            };
            default:
                if (DEBUG) throw new DebugError(`can not set uniform for type ${type} and size ${size}`);
                break;
        }
    }
    throw new Error();
};

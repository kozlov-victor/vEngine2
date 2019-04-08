import {DebugError} from "@engine/debug/debugError";
import {ShaderProgram} from "./shaderProgram";
import {Int} from "@engine/declarations";
import {isArray} from "@engine/misc/object";


interface ShaderErrorInfo {
    message:string,
    lineNum:number
}

const parseErrors = (log:string):ShaderErrorInfo[]=> {
    if (!DEBUG) return [];
    let logs:ShaderErrorInfo[] = [];
    let result:RegExpMatchArray;

    while (!!(result = log.match(/ERROR\:([^\n]+)/))) {
        log = log.slice(result.index + 1);

        let line:string = result[1].trim();
        let seps:string[] = line.split(':');
        let message:string = seps.slice(2).join(':').trim();
        let lineNum:number = parseInt(seps[1], 10);
        logs.push({message, lineNum});
    }

    return logs
};

export const compileShader = (gl:WebGLRenderingContext, shaderSource:string, shaderType:number):WebGLShader|null=> {
    if (DEBUG) {
        if (!shaderSource) throw new DebugError(`can not compile shader: shader source not specified for type ${shaderType}`);
    }
    // Create the shader object
    let shader = gl.createShader(shaderType);
    if (DEBUG && !shader) throw new DebugError(`can not allocate memory for shader: gl.createShader(shaderType)`);

    // Load the shader source
    gl.shaderSource(shader, shaderSource);

    // Compile the shader
    gl.compileShader(shader);

    // Check the compile status
    let compiled:number = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        // Something went wrong during compilation; get the error
        let lastError:string = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        if (DEBUG) {
            let parsedLogs = parseErrors(lastError);
            let lines:string[] = shaderSource.split('\n');
            let errorMsg:string = '';
            let arrow:string = '----->';
            parsedLogs.forEach((inf:ShaderErrorInfo)=>{
                let i:number = inf.lineNum-1;
                if (lines[i].indexOf(arrow)==-1) lines[i]=`${arrow} ${lines[i]}`;
                errorMsg+=`${lines[i]} <----${inf.message}\n`;
            });
            console.log(lines.join('\n'));
            throw new DebugError(`Error compiling shader: ${errorMsg?errorMsg:lastError}`);
        } else {
            throw new Error(lastError);
        }

    }

    return shader;
};


export const createProgram = (gl:WebGLRenderingContext, vertexShader:WebGLShader,fragmentShader:WebGLShader):WebGLProgram=> {
    let program:WebGLProgram = gl.createProgram() as WebGLProgram;
    if (DEBUG && !program) throw new DebugError(`can not allocate memory for gl.createProgram()`);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    // Check the link status
    let linked:number = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        // something went wrong with the link
        gl.deleteProgram(program);
        let lastError:string = gl.getProgramInfoLog(program);
        if (DEBUG) {
            let status = gl.getProgramParameter( program, gl.VALIDATE_STATUS);
            console.error('VALIDATE_STATUS',status);
            throw new DebugError(`Error in program linking ${lastError}`);
        } else {
            throw new Error(lastError);
        }

    }
    return program;
};

let GL_TABLE:{[key:number]:string} = null;

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

    if (!GL_TABLE) {
        let typeNames:string[] = Object.keys(GL_TYPE);

        GL_TABLE = {} as {[key:number]:string};

        for (let i = 0; i < typeNames.length; ++i) {
            let tn:string = typeNames[i];
            GL_TABLE[(gl as any)[tn]] = (GL_TYPE as any)[tn]; //todo
        }
    }

    return GL_TABLE[type];
};

type GL = WebGLRenderingContext;
type LOC = WebGLUniformLocation;
type NUM = number;
type NUM_ARR = number[];
export type UNIFORM_VALUE_TYPE = number|number[]|Int|Int[]|boolean|boolean[];

type UNIFORM_SETTER = (gl:GL,location:LOC,value:UNIFORM_VALUE_TYPE)=>void;


export interface UniformWrapper {
    type:string,
    size:NUM,
    location: LOC,
    setter: UNIFORM_SETTER
}

export interface UniformsMap {
    [key:string]:UniformWrapper
}

export interface AttributesMap {
    [key:string]:number
}

export  const normalizeUniformName =(s:string):string=>{
    if (DEBUG && s.indexOf(' ')>-1) throw new DebugError(`bad uniform name: "${s}", check spaces!`);
    if (s.indexOf('[')>-1) return s.split('[')[0];
    else return s;
};

export const extractUniforms = (gl:WebGLRenderingContext, program:ShaderProgram):UniformsMap=> {
    const glProgram:WebGLProgram = program.getProgram();
    const activeUniforms:Int = gl.getProgramParameter(glProgram, gl.ACTIVE_UNIFORMS) as Int;
    const uniforms:UniformsMap = {};

    for (let i:number = 0; i < activeUniforms; i++) {
        let uniformData:WebGLActiveInfo = gl.getActiveUniform(glProgram, i) as WebGLActiveInfo;
        if (DEBUG && !uniformData) throw new DebugError(`can not receive active uniforms info: gl.getActiveUniform()`);
        let type:string = mapType(gl, uniformData.type);
        let name:string = normalizeUniformName(uniformData.name);
        let location:WebGLUniformLocation = gl.getUniformLocation(glProgram, name) as WebGLUniformLocation;
        // if (DEBUG && location===null) {
        //     console.log(program);
        //     throw new DebugError(`error finding uniform location: ${uniformData.name}`);
        // }
        // todo ie provide attrData.name but can not find location of unused attr

        uniforms[name] = {
            type,
            size: uniformData.size,
            location,
            setter: getUniformSetter(uniformData.size,type)
        } as UniformWrapper;
    }

    return uniforms;

};


export const extractAttributes = (gl:WebGLRenderingContext, program:ShaderProgram):AttributesMap=>{
    const glProgram:WebGLProgram = program.getProgram();
    const activeAttributes:number = gl.getProgramParameter(glProgram, gl.ACTIVE_ATTRIBUTES) as number;
    const attrMap:AttributesMap = {};
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

interface IChecker {
    check:(val:UNIFORM_VALUE_TYPE)=>void;
}

const TypeNumber:IChecker = {
    check: (val:UNIFORM_VALUE_TYPE):void=>{
        if (isNaN(parseFloat(String(val))) || !isFinite(Number(val)))
            throw new DebugError(`can not set uniform with value ${val}: expected argument of type number`);
    }
};

const TypeInt:IChecker = {
    check: (val:UNIFORM_VALUE_TYPE):void=>{
        TypeNumber.check(val);
        if (val!==~~val)
            throw new DebugError(`can not set uniform with value ${val}: expected argument of integer type, but ${val} found`);
    }
};

const TypeBool:IChecker = {
    check: (val:UNIFORM_VALUE_TYPE):void=>{
        if (!(val==true || val==false))
            throw new DebugError(`can not set uniform with value ${val}: expected argument of boolean type, but ${val} found`);
    }
};


const TypeArray = (checker:IChecker,size?:number):IChecker=>{
    return {
        check: (val:UNIFORM_VALUE_TYPE)=>{
            if (!val)
                throw new DebugError(`can not set uniform  value: ${val}`);
            if (!isArray(val)) {
                console.error('Can not set uniform value',val);
                throw new DebugError(`can not set uniform with value [${val}]: expected argument of type Array`);
            }
            if (size!==undefined && (val as any[]).length!==size)
                throw new DebugError(`can not set uniform with value [${val}]: expected array with size ${size}, but ${(val as any[]).length} found`);
            for (let i:number=0;i<val.length;i++) {
                try {
                    checker.check((val as any[])[i]);
                } catch (e){
                    console.error('Can not set uniform array item',val);
                    throw new DebugError(`can not set uniform array item with value [${val}]: unexpected array element type: ${(val as any[])[i]}`);
                }
            }
        }
    }
};

const expect = (value:UNIFORM_VALUE_TYPE,typeChecker:IChecker):void=>{
    typeChecker.check(value);
};

const getUniformSetter = (size:number,type:string):UNIFORM_SETTER=>{
    if (size===1) {
        switch (type) {
            case GL_TYPE.FLOAT: return (gl:GL,location:LOC,value:NUM)=> {
                DEBUG && expect(value,TypeNumber);
                gl.uniform1f(location, value);
            };
            case GL_TYPE.FLOAT_VEC2:  return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeNumber,2));
                gl.uniform2f(location, value[0], value[1]);
            };
            case GL_TYPE.FLOAT_VEC3:  return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeNumber,3));
                gl.uniform3f(location, value[0], value[1], value[2]);
            };
            case GL_TYPE.FLOAT_VEC4:  return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeNumber,4));
                gl.uniform4f(location, value[0], value[1], value[2], value[3]);
            };
            case GL_TYPE.INT:   return (gl:GL,location:LOC,value:NUM)=> {
                DEBUG && expect(value,TypeInt);
                gl.uniform1i(location, value);
            };
            case GL_TYPE.INT_VEC2: return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeInt,2));
                gl.uniform2i(location, value[0], value[1]);
            };
            case GL_TYPE.INT_VEC3: return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeInt,3));
                gl.uniform3i(location, value[0], value[1], value[2]);
            };
            case GL_TYPE.INT_VEC4: return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeInt,4));
                gl.uniform4i(location, value[0], value[1], value[2], value[3]);
            };
            case GL_TYPE.BOOL:  return (gl:GL,location:LOC,value:NUM)=> {
                DEBUG && expect(value,TypeBool);
                gl.uniform1i(location, value);
            };
            case GL_TYPE.BOOL_VEC2: return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeBool,2));
                gl.uniform2i(location, value[0], value[1]);
            };
            case GL_TYPE.BOOL_VEC3: return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeBool,3));
                gl.uniform3i(location, value[0], value[1], value[2]);
            };
            case GL_TYPE.BOOL_VEC4: return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeBool,4));
                gl.uniform4i(location, value[0], value[1], value[2], value[3]);
            };
            case GL_TYPE.FLOAT_MAT2:  return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeNumber,2*2));
                gl.uniformMatrix2fv(location, false, value); // location, transpose (Must be false), value
            };
            case GL_TYPE.FLOAT_MAT3:  return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeNumber,3*3));
                gl.uniformMatrix3fv(location, false, value);
            };
            case GL_TYPE.FLOAT_MAT4:  return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeNumber,4*4));
                gl.uniformMatrix4fv(location, false, value);
            };
            case GL_TYPE.SAMPLER_2D:return (gl:GL,location:LOC,value:NUM)=> {
                DEBUG && expect(value,TypeInt);
                gl.uniform1i(location, value);
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
            case GL_TYPE.FLOAT: return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeNumber,size));
                gl.uniform1fv(location, value);
            };
            case GL_TYPE.FLOAT_VEC2:  return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeNumber,size*2));
                gl.uniform2fv(location, value);
            };
            case GL_TYPE.FLOAT_VEC3:  return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeNumber,size*3));
                gl.uniform3fv(location, value);
            };
            case GL_TYPE.FLOAT_VEC4:  return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeNumber,size*4));
                gl.uniform4fv(location, value);
            };
            case GL_TYPE.INT:   return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeInt);
                gl.uniform1iv(location, value);
            };
            case GL_TYPE.INT_VEC2: return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeInt,size*2));
                gl.uniform2iv(location, value);
            };
            case GL_TYPE.INT_VEC3: return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeInt,size*3));
                gl.uniform3iv(location, value);
            };
            case GL_TYPE.INT_VEC4: return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeInt,size*4));
                gl.uniform4iv(location, value);
            };
            case GL_TYPE.BOOL:  return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeBool);
                gl.uniform1iv(location, value);
            };
            case GL_TYPE.BOOL_VEC2: return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeBool,size*2));
                gl.uniform2iv(location, value);
            };
            case GL_TYPE.BOOL_VEC3: return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeBool,size*3));
                gl.uniform3iv(location, value);
            };
            case GL_TYPE.BOOL_VEC4: return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeArray(TypeBool,size*4));
                gl.uniform4iv(location, value);
            };
            case GL_TYPE.SAMPLER_2D:return (gl:GL,location:LOC,value:NUM_ARR)=> {
                DEBUG && expect(value,TypeInt);
                gl.uniform1iv(location, value);
            };
            default:
                if (DEBUG) throw new DebugError(`can not set uniform for type ${type} and size ${size}`);
                break;
        }
    }
};

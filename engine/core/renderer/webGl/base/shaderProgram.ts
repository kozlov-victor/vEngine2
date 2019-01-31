

import {DebugError} from "../../../../debugError";



import {
    AttributesMap, compileShader, createProgram, extractAttributes, extractUniforms,
    UniformsMap
} from "./shaderProgramUtils";
import {VertexBuffer} from "./vertexBuffer";

export class ShaderProgram {

    static currentProgram:ShaderProgram = null;

    private readonly program:WebGLProgram;
    private readonly uniforms:UniformsMap;
    private readonly attributes:AttributesMap;
    private readonly gl:WebGLRenderingContext;


    constructor(gl:WebGLRenderingContext,vertexSource:string,fragmentSource:string) {
        let vShader:WebGLShader = compileShader(gl, vertexSource, gl.VERTEX_SHADER) as WebGLShader;
        let fShader:WebGLShader = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER) as WebGLShader;
        this.program = createProgram(gl, vShader, fShader);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);
        this.uniforms = extractUniforms(gl, this);
        this.attributes = extractAttributes(gl,this);
        this.gl = gl;
    }

    getProgram():WebGLProgram {
        return this.program;
    }

    bind(){
        this.gl.useProgram(this.program);
        ShaderProgram.currentProgram = this;
    }

    setUniform(name:string, value) {
        if (DEBUG && !name) {
            throw new DebugError(`no uniform name was provided!`);
        }
        let uniform = this.uniforms[name];
        if (DEBUG && !uniform) {
            //console.error(this);
            return;
            throw new DebugError(`no uniform with name ${name} found!`);
        }
        if (DEBUG) {
            if (ShaderProgram.currentProgram!==this) {
                console.error(this);
                throw new DebugError(`can not set uniform: target program is inactive`);
            }
        }
        uniform.setter(this.gl, uniform.location, value);
    }

    bindBuffer(buffer:VertexBuffer, attrName:string) {
        if (DEBUG) {
            if (!attrName) throw new DebugError(`can not found attribute location: attrLocationName not defined`);
            if (this.attributes[attrName]===undefined) {
                console.log(this);
                throw new DebugError(`can not found attribute location for  ${attrName}`);
            }
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.getGlBuffer());
        let attrLocation:number = this.attributes[attrName];
        this.gl.enableVertexAttribArray(attrLocation);
        this.gl.vertexAttribPointer(
            attrLocation,
            buffer.getItemSize(),
            buffer.getItemType(), // type of data
            false,  // if the content is normalized [0..1] vectors
            0,      // number of bytes to skip in between elements
            0       // offsets to the first element
        );
    }

    destroy(){
        this.gl.deleteProgram(this.program);
    }

}
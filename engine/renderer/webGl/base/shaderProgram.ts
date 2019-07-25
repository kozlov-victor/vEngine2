import {DebugError} from "@engine/debug/debugError";


import {
    IAttributesMap,
    compileShader,
    createProgram,
    extractAttributes,
    extractUniforms, UNIFORM_VALUE_TYPE,
    IUniformsMap, IUniformWrapper
} from "./shaderProgramUtils";
import {VertexBuffer} from "./vertexBuffer";

export class ShaderProgram {

    public static currentProgram:ShaderProgram|null = null;

    private readonly program:WebGLProgram;
    private readonly uniforms:IUniformsMap;
    private readonly attributes:IAttributesMap;
    private readonly gl:WebGLRenderingContext;


    constructor(gl:WebGLRenderingContext,vertexSource:string,fragmentSource:string) {
        const vShader:WebGLShader = compileShader(gl, vertexSource, gl.VERTEX_SHADER) as WebGLShader;
        const fShader:WebGLShader = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER) as WebGLShader;
        this.program = createProgram(gl, vShader, fShader);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);
        this.uniforms = extractUniforms(gl, this);
        this.attributes = extractAttributes(gl,this);
        this.gl = gl;
    }

    public getProgram():WebGLProgram {
        return this.program;
    }

    public bind():void{
        this.gl.useProgram(this.program);
        ShaderProgram.currentProgram = this;
    }

    public setUniform(name:string, value:UNIFORM_VALUE_TYPE):void {
        if (DEBUG && !name) {
            throw new DebugError(`no uniform name was provided!`);
        }
        const uniformWrapper:IUniformWrapper = this.uniforms[name];
        if (DEBUG && !uniformWrapper) {
            console.error('shader program failed',this);
            console.error('uniforms',this.uniforms);
            throw new DebugError(`no uniform with name ${name} found!`);
        }
        if (DEBUG) {
            if (ShaderProgram.currentProgram!==this) {
                console.error(this);
                throw new DebugError(`can not set uniform: target program is inactive`);
            }
        }
        uniformWrapper.setter(this.gl, uniformWrapper.location, value);
    }

    public bindBuffer(buffer:VertexBuffer, attrName:string) {
        if (DEBUG) {
            if (!attrName) throw new DebugError(`can not find attribute location: attrName not defined`);
            if (this.attributes[attrName]===undefined) {
                console.log(this);
                throw new DebugError(`can not find attribute location for  ${attrName}`);
            }
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.getGlBuffer());
        const attrLocation:GLuint = this.attributes[attrName];
        this.enableAttribute(attrName);
        this.gl.vertexAttribPointer(
            attrLocation,
            buffer.getItemSize(),
            buffer.getItemType(), // type of data
            false,  // if the content is normalized [0..1] vectors
            0,      // number of bytes to skip in between elements
            0       // offsets to the first element
        );
    }

    public disableAttribute(attrName:string){
        this.toggleAttribute(attrName,false);
    }

    public enableAttribute(attrName:string){
        this.toggleAttribute(attrName,true);
    }

    public destroy(){
        this.gl.deleteProgram(this.program);
    }

    private toggleAttribute(attrName:string,on:boolean){
        if (this.attributes[attrName]===undefined) {
            console.log(this);
            throw new DebugError(`unbind error: can not find attribute location for  ${attrName}`);
        }
        const attrLocation:GLuint = this.attributes[attrName];
        if (on) this.gl.enableVertexAttribArray(attrLocation);
        else this.gl.disableVertexAttribArray(attrLocation);
    }

}
import {DebugError} from "@engine/debug/debugError";


import {
    IAttributesMap,
    compileShader,
    createProgram,
    extractAttributes,
    extractUniformsFromShaderBin, UNIFORM_VALUE_TYPE,
    IUniformsMap, IUniformWrapper, extractUniformsAndAttributesFromShaderSource
} from "./shaderProgramUtils";
import {VertexBuffer} from "./vertexBuffer";
import {Optional} from "@engine/core/declarations";

export class ShaderProgram {

    private static currentProgram:Optional<ShaderProgram>;

    private readonly program:WebGLProgram;
    private readonly uniforms:IUniformsMap;
    private readonly uniformSourceNames:string[];
    private readonly attributeSourceNames:string[] = [];
    private readonly attributes:IAttributesMap;
    private readonly gl:WebGLRenderingContext;


    constructor(gl:WebGLRenderingContext,vertexSource:string,fragmentSource:string) {
        const vShader:WebGLShader = compileShader(gl, vertexSource, gl.VERTEX_SHADER) as WebGLShader;
        const fShader:WebGLShader = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER) as WebGLShader;
        this.program = createProgram(gl, vShader, fShader);
        gl.deleteShader(vShader);
        gl.deleteShader(fShader);
        this.uniforms = extractUniformsFromShaderBin(gl, this);
        this.attributes = extractAttributes(gl,this);
        const sourceExtracted:{attributes:string[],uniforms:string[]} =
            extractUniformsAndAttributesFromShaderSource(vertexSource,fragmentSource);
        this.attributeSourceNames = sourceExtracted.attributes;
        this.uniformSourceNames = sourceExtracted.uniforms;
        this.gl = gl;
    }

    public getProgram():WebGLProgram {
        return this.program;
    }

    public bind():void{
        if (ShaderProgram.currentProgram===this) return;
        this.gl.useProgram(this.program);
        ShaderProgram.currentProgram = this;
    }

    public unbind():void {
        // tslint:disable-next-line:no-null-keyword
        this.gl.useProgram(null);
        ShaderProgram.currentProgram = undefined;
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
                if (this.attributeSourceNames.indexOf(attrName)>-1) {
                    // its ok, buffer is present in source, but absent in bin code because is is unused and removed by compiler
                    // so, ignore this uniform
                    return;
                }
                console.log(this);
                throw new DebugError(`can not find attribute location for  ${attrName}`);
            }
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer.getGlBuffer());
        this.enableAttribute(attrName);
        const attrLocation:GLuint = this.attributes[attrName];
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

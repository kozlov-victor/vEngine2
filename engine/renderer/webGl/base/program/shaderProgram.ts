import {DebugError} from "@engine/debug/debugError";


import {
    IAttributesMap,
    compileShader,
    createProgram,
    extractAttributes,
    extractUniformsFromShader, UNIFORM_VALUE_TYPE,
    IUniformsMap, IUniformWrapper, extractUniformsAndAttributesFromShaderSource
} from "./shaderProgramUtils";
import {Optional} from "@engine/core/declarations";
import {VertexBuffer} from "@engine/renderer/webGl/base/buffer/vertexBuffer";

export class ShaderProgram {

    private static currentProgram:Optional<ShaderProgram>;

    private readonly _program:WebGLProgram;
    private readonly _uniforms:IUniformsMap;
    private readonly _uniformSourceNames:string[];
    private readonly _attributeSourceNames:string[] = [];
    private readonly _attributes:IAttributesMap;

    constructor(private readonly _gl:WebGLRenderingContext,vertexSource:string,fragmentSource:string) {
        const vShader = compileShader(_gl, vertexSource, _gl.VERTEX_SHADER) as WebGLShader;
        const fShader = compileShader(_gl, fragmentSource, _gl.FRAGMENT_SHADER) as WebGLShader;
        this._program = createProgram(_gl, vShader, fShader);
        _gl.deleteShader(vShader);
        _gl.deleteShader(fShader);
        this._uniforms = extractUniformsFromShader(_gl, this);
        this._attributes = extractAttributes(_gl,this);
        const sourceExtracted:{attributes:string[],uniforms:string[]} =
            extractUniformsAndAttributesFromShaderSource(vertexSource,fragmentSource);
        this._attributeSourceNames = sourceExtracted.attributes;
        this._uniformSourceNames = sourceExtracted.uniforms;
    }

    public getProgram():WebGLProgram {
        return this._program;
    }

    public bind():void{
        if (ShaderProgram.currentProgram===this) return;
        this._gl.useProgram(this._program);
        ShaderProgram.currentProgram = this;
    }

    public unbind():void {
        this._gl.useProgram(null);
        ShaderProgram.currentProgram = undefined;
    }

    public setUniform(name:string, value:UNIFORM_VALUE_TYPE):void {
        if (DEBUG && !name) {
            throw new DebugError(`no uniform name was provided!`);
        }
        const uniformWrapper:IUniformWrapper = this._uniforms[name];
        if (DEBUG && !uniformWrapper) {
            if (this._uniformSourceNames.indexOf(name)>-1) {
                // its ok, uniform is present in source, but absent in bin code because is is unused and removed by compiler
                // so, ignore this uniform
                return;
            }
            console.error('uniforms',this._uniforms);
            throw new DebugError(`no uniform with name ${name} found!`);
        }
        if (DEBUG) {
            if (ShaderProgram.currentProgram!==this) {
                console.error(this);
                throw new DebugError(`can not set uniform: target program is inactive`);
            }
        }
        uniformWrapper.setter(this._gl, uniformWrapper.location, value);
    }

    public bindVertexBuffer(buffer:VertexBuffer):void {
        const attrName = buffer.getAttrName();
        if (DEBUG) {
            if (!attrName) throw new DebugError(`can not find attribute location: attrName not defined`);
            if (this._attributes[attrName]===undefined) {
                if (this._attributeSourceNames.indexOf(attrName)>-1) {
                    // its ok, buffer is present in source, but absent in bin code because is is unused and removed by compiler
                    // so, ignore this attribute
                    return;
                }
                console.log(this);
                throw new DebugError(`can not find attribute location for  ${attrName}`);
            }
        }

        buffer.bind();
        this.enableAttribute(attrName);
        const attrLocation:GLuint = this._attributes[attrName];

        this._gl.vertexAttribPointer(
            attrLocation,
            buffer.getItemSize(),
            buffer.getItemType(),  // type of data
            false,       // if the content is normalized [0..1] vectors
            buffer.getStride(),    // number of bytes to skip in between elements
            buffer.getOffset()     // offsets to the first element
        );
    }

    public unbindVertexBuffer(buffer:VertexBuffer):void {
        const attrName = buffer.getAttrName();
        buffer.unbind();
        this.disableAttribute(attrName);
    }

    public disableAttribute(attrName:string):void{
        this.toggleAttribute(attrName,false);
    }

    public enableAttribute(attrName:string):void{
        this.toggleAttribute(attrName,true);
    }

    public destroy():void{
        this._gl.deleteProgram(this._program);
    }

    private toggleAttribute(attrName:string,on:boolean):void{
        if (this._attributes[attrName]===undefined) {
            console.log(this);
            throw new DebugError(`unbind error: can not find attribute location for ${attrName}`);
        }
        const attrLocation:GLuint = this._attributes[attrName];
        if (on) {
            this._gl.enableVertexAttribArray(attrLocation);
        }
        else {
            this._gl.disableVertexAttribArray(attrLocation);
        }

    }

}

import {DebugError} from "../../../../debugError";


import {VertexBuffer} from "./vertexBuffer";
import {IndexBuffer} from "./indexBuffer";
import {ShaderProgram} from "./shaderProgram";

export interface VertexArrayInfo {
    array:number[],
    type:number,
    size:number,
    attrName:string
}

export interface IndexArrayInfo {
    array:number[]
}

export interface BufferInfoDescription {
    posVertexInfo:VertexArrayInfo,
    posIndexInfo?:IndexArrayInfo,
    texVertexInfo?:VertexArrayInfo,
    normalInfo?:VertexArrayInfo,
    drawMethod:number
}

export class BufferInfo {

    gl:WebGLRenderingContext;

    posVertexBuffer:VertexBuffer = null;
    posIndexBuffer:IndexBuffer = null;
    texVertexBuffer:VertexBuffer = null;
    normalBuffer:VertexBuffer = null;
    drawMethod:number = null;
    numOfElementsToDraw:number = 0;

    constructor(gl:WebGLRenderingContext,description:BufferInfoDescription){
        this.gl = gl;

        if (DEBUG && description.drawMethod===undefined)
            throw new DebugError(`can not create BufferInfo: drawMethod not defined`);
        this.drawMethod = description.drawMethod;

        if (DEBUG && !description.posVertexInfo)
            throw new DebugError(`can not create BufferInfo: posVertexInfo is mandatory`);
        this.posVertexBuffer = new VertexBuffer(gl);
        this.posVertexBuffer.setData(
            description.posVertexInfo.array,
            description.posVertexInfo.type,
            description.posVertexInfo.size
        );
        this.posVertexBuffer.setAttrName(description.posVertexInfo.attrName);

        if (description.posIndexInfo) {
            this.posIndexBuffer = new IndexBuffer(gl);
            this.posIndexBuffer.setData(description.posIndexInfo.array);
        } else this.numOfElementsToDraw = this._getNumOfElementsToDraw(this.drawMethod);

        if (description.texVertexInfo) {
            this.texVertexBuffer = new VertexBuffer(gl);
            this.texVertexBuffer.setData(
                description.texVertexInfo.array,
                description.texVertexInfo.type,
                description.texVertexInfo.size);
            this.texVertexBuffer.setAttrName(description.texVertexInfo.attrName);
        }

        if (description.normalInfo) {
            this.normalBuffer = new VertexBuffer(gl);
            this.normalBuffer.setData(
                description.normalInfo.array,
                description.normalInfo.type,
                description.normalInfo.size);
            this.normalBuffer.setAttrName(description.normalInfo.attrName);
        }
    }

    bind(program:ShaderProgram){
        program.bind();
        if (this.posIndexBuffer) this.posIndexBuffer.bind();
        if (this.posVertexBuffer) this.posVertexBuffer.bind(program);
        if (this.texVertexBuffer) this.texVertexBuffer.bind(program);
        if (this.normalBuffer) this.normalBuffer.bind(program);
    }

    unbind(){
        if (this.posIndexBuffer) this.posIndexBuffer.unbind();
        if (this.posVertexBuffer) this.posVertexBuffer.unbind();
        if (this.texVertexBuffer) this.texVertexBuffer.unbind();
        if (this.normalBuffer) this.normalBuffer.unbind();
    }

    destroy(){
        if (this.posVertexBuffer) this.posVertexBuffer.destroy();
        if (this.posIndexBuffer) this.posIndexBuffer.destroy();
        if (this.texVertexBuffer) this.texVertexBuffer.destroy();
        if (this.normalBuffer) this.normalBuffer.destroy();
    }

    private _getNumOfElementsToDraw(drawMethod:number){
        switch (drawMethod) {
            case this.gl.LINE_STRIP:
            case this.gl.TRIANGLE_FAN:
                return this.posVertexBuffer.getBufferLength() / 2;
            default:
                throw new DebugError(`unknown draw method: ${drawMethod}`);
        }
    }

    draw(){
        if (this.posIndexBuffer!==null){
            this.gl.drawElements(
                this.drawMethod,
                this.posIndexBuffer.getBufferLength(),
                this.gl.UNSIGNED_SHORT,0
            );
        } else {
            this.gl.drawArrays(
                this.drawMethod,0,
                this.numOfElementsToDraw
            );
        }
    }


}
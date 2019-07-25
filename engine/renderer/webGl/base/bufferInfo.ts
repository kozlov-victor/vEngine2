import {DebugError} from "@engine/debug/debugError";


import {VertexBuffer} from "./vertexBuffer";
import {IndexBuffer} from "./indexBuffer";
import {ShaderProgram} from "./shaderProgram";
import {debugUtil} from "@engine/renderer/webGl/debug/debugUtil";
import glEnumToString = debugUtil.glEnumToString;

export interface IVertexArrayInfo {
    array:number[];
    type:number;
    size:number;
    attrName:string;
}

export interface IIndexArrayInfo {
    array:number[];
}

export interface IBufferInfoDescription {
    posVertexInfo:IVertexArrayInfo;
    posIndexInfo?:IIndexArrayInfo;
    texVertexInfo?:IVertexArrayInfo;
    normalInfo?:IVertexArrayInfo;
    drawMethod:DRAW_METHOD;
}

export enum DRAW_METHOD {
    LINE_STRIP,
    TRIANGLE_FAN,
    TRIANGLE_STRIP,
    TRIANGLES,
}

const drawMethodToGlEnum = (gl:WebGLRenderingContext,m:DRAW_METHOD):GLenum=>{
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
    if (DEBUG) {
        throw new DebugError(`unknown drawMethod enum value: ${m}`);
    }
};

export class BufferInfo {

    public gl:WebGLRenderingContext;

    public posVertexBuffer:VertexBuffer|null = null;
    public posIndexBuffer:IndexBuffer|null = null;
    public texVertexBuffer:VertexBuffer|null = null;
    public normalBuffer:VertexBuffer|null = null;
    public drawMethod:GLenum;
    public numOfElementsToDraw:number = 0;

    constructor(gl:WebGLRenderingContext,description:IBufferInfoDescription){
        this.gl = gl;

        if (DEBUG && description.drawMethod===undefined)
            throw new DebugError(`can not create BufferInfo: drawMethod not defined`);
        this.drawMethod = drawMethodToGlEnum(gl,description.drawMethod);

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

    public bind(program:ShaderProgram):void{
        program.bind();
        if (this.posIndexBuffer) this.posIndexBuffer.bind();
        if (this.posVertexBuffer) this.posVertexBuffer.bind(program);
        if (this.texVertexBuffer) this.texVertexBuffer.bind(program);
        if (this.normalBuffer) this.normalBuffer.bind(program);
    }

    public unbind():void{
        if (this.posIndexBuffer) this.posIndexBuffer.unbind();
        if (this.posVertexBuffer) this.posVertexBuffer.unbind();
        if (this.texVertexBuffer) this.texVertexBuffer.unbind();
        if (this.normalBuffer) this.normalBuffer.unbind();
    }

    public destroy():void{
        if (this.posVertexBuffer) this.posVertexBuffer.destroy();
        if (this.posIndexBuffer) this.posIndexBuffer.destroy();
        if (this.texVertexBuffer) this.texVertexBuffer.destroy();
        if (this.normalBuffer) this.normalBuffer.destroy();
    }

    public draw():void {
        if (this.posIndexBuffer){
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

    private _getNumOfElementsToDraw(drawMethod:number):number {
        switch (drawMethod) {
            case this.gl.LINE_STRIP:
            case this.gl.TRIANGLE_FAN:
                return this.posVertexBuffer!.getBufferLength() / 2;
            case this.gl.TRIANGLE_STRIP:
                return this.posVertexBuffer!.getBufferLength() / 3;
            case this.gl.TRIANGLES:
                return this.posVertexBuffer!.getBufferLength() / this.posVertexBuffer!.getItemSize();
            default:
                throw new DebugError(`unknown draw method: ${drawMethod} (${glEnumToString(this.gl,drawMethod)})`);
        }
    }

}
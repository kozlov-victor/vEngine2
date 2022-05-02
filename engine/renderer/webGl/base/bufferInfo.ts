import {DebugError} from "@engine/debug/debugError";


import {VertexBuffer} from "./vertexBuffer";
import {IndexBuffer} from "./indexBuffer";
import {ShaderProgram} from "./shaderProgram";
import {DebugUtil} from "@engine/renderer/webGl/debug/debugUtil";
import glEnumToString = DebugUtil.glEnumToString;
import {Optional} from "@engine/core/declarations";

export interface IVertexArrayInfo {
    array:Float32Array;
    type:number; // BYTE, FLOAT, INT, UNSIGNED_SHORT ...
    size:1|2|3|4|16;
    attrName:string;
    stride?:number; // number of bytes to skip in between elements
    offset?:number; // offsets to the first element
}

export interface IIndexArrayInfo {
    array:number[];
}

export interface IBufferInfoDescription {
    posVertexInfo:IVertexArrayInfo;
    posIndexInfo?:IIndexArrayInfo;
    texVertexInfo?:IVertexArrayInfo;
    colorVertexInfo?:IVertexArrayInfo;
    normalInfo?:IVertexArrayInfo;
    miscBuffersInfo?:IVertexArrayInfo[];
    drawMethod:DRAW_METHOD;
}

export const enum DRAW_METHOD {
    LINE_STRIP,
    TRIANGLE_FAN,
    TRIANGLE_STRIP,
    TRIANGLES,
    LINES,
    LINE_LOOP,
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
        case DRAW_METHOD.LINES:
            return gl.LINES;
        case DRAW_METHOD.LINE_LOOP:
            return gl.LINE_LOOP;
    }
    if (DEBUG) {
        throw new DebugError(`unknown drawMethod enum value: ${m}`);
    }
};

export class BufferInfo {

    public gl:WebGLRenderingContext;

    public posVertexBuffer:Optional<VertexBuffer>;
    public posIndexBuffer:Optional<IndexBuffer>;
    public texVertexBuffer:Optional<VertexBuffer>;
    public colorVertexBuffer:Optional<VertexBuffer>;
    public normalBuffer:Optional<VertexBuffer>;
    public miscVertexBuffers:VertexBuffer[] = [];
    public drawMethod:GLenum;
    public numOfElementsToDraw:number = 0;

    private _destroyed:boolean = false;

    constructor(gl:WebGLRenderingContext,description:IBufferInfoDescription){
        this.gl = gl;

        if (DEBUG && description.drawMethod===undefined)
            throw new DebugError(`can not create BufferInfo: drawMethod is not defined`);
        this.drawMethod = drawMethodToGlEnum(gl,description.drawMethod);

        if (DEBUG && !description.posVertexInfo)
            throw new DebugError(`can not create BufferInfo: posVertexInfo is mandatory`);
        this.posVertexBuffer = new VertexBuffer(gl);
        this.posVertexBuffer.setData(description.posVertexInfo);

        if (description.posIndexInfo) {
            this.posIndexBuffer = new IndexBuffer(gl);
            this.posIndexBuffer.setData(description.posIndexInfo.array);
        } else this.numOfElementsToDraw = this._getNumOfElementsToDraw(this.drawMethod);

        if (description.texVertexInfo) {
            this.texVertexBuffer = new VertexBuffer(gl);
            this.texVertexBuffer.setData(description.texVertexInfo);
        }

        if (description.colorVertexInfo) {
            this.colorVertexBuffer = new VertexBuffer(gl);
            this.colorVertexBuffer.setData(description.colorVertexInfo);
        }

        if (description.normalInfo) {
            this.normalBuffer = new VertexBuffer(gl);
            this.normalBuffer.setData(description.normalInfo);
        }

        if (description.miscBuffersInfo) {
            for (const d of description.miscBuffersInfo) {
                const buffer = new VertexBuffer(gl);
                buffer.setData(d);
                this.miscVertexBuffers.push(buffer);
            }
        }

    }

    public bind(program:ShaderProgram):void{
        program.bind();
        if (this.posIndexBuffer!==undefined) this.posIndexBuffer.bind();
        if (this.posVertexBuffer!==undefined) program.bindVertexBuffer(this.posVertexBuffer);
        if (this.texVertexBuffer!==undefined) program.bindVertexBuffer(this.texVertexBuffer);
        if (this.normalBuffer!==undefined) program.bindVertexBuffer(this.normalBuffer);
        if (this.colorVertexBuffer!==undefined) program.bindVertexBuffer(this.colorVertexBuffer);
        for (const b of this.miscVertexBuffers) program.bindVertexBuffer(b);
    }

    public unbind(program:ShaderProgram):void {
        program.unbind();
        if (this.posIndexBuffer !== undefined) this.posIndexBuffer.unbind();
        if (this.posVertexBuffer !== undefined) program.unbindVertexBuffer(this.posVertexBuffer);
        if (this.texVertexBuffer !== undefined) program.unbindVertexBuffer(this.texVertexBuffer);
        if (this.normalBuffer !== undefined) program.unbindVertexBuffer(this.normalBuffer);
        if (this.colorVertexBuffer !== undefined) program.unbindVertexBuffer(this.colorVertexBuffer);
        for (const b of this.miscVertexBuffers) program.unbindVertexBuffer(b);
    }

    public destroy():void{
        if (this.posVertexBuffer!==undefined) this.posVertexBuffer.destroy();
        if (this.posIndexBuffer!==undefined) this.posIndexBuffer.destroy();
        if (this.texVertexBuffer!==undefined) this.texVertexBuffer.destroy();
        if (this.normalBuffer!==undefined) this.normalBuffer.destroy();
        if (this.colorVertexBuffer!==undefined) this.colorVertexBuffer.destroy();
        for (const b of this.miscVertexBuffers) b.destroy();
        this._destroyed = true;
    }

    public isDestroyed():boolean {
        return this._destroyed;
    }

    public draw():void {
        if (this.posIndexBuffer!==undefined){
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

import {DebugError} from "@engine/debug/debugError";
import {AbstractBuffer} from "@engine/renderer/webGl/base/abstract/abstractBuffer";
import {Optional} from "@engine/core/declarations";
import {IVertexArrayInfo} from "@engine/renderer/webGl/base/bufferInfo";

export class VertexBuffer extends AbstractBuffer {

    private readonly buffer:WebGLBuffer;
    private vertexArrayInfo:IVertexArrayInfo;
    private dataLength:number = 0;
    private attrName:string;

    private static currentBuffer:Optional<VertexBuffer>;

    constructor(private readonly _gl:WebGLRenderingContext){
        super();
        if (DEBUG && !_gl) throw new DebugError(`can not create VertexBuffer, gl context not passed to the constructor, expected: new VertexBuffer(gl), found expected: new VertexBuffer(${_gl})`);
        this.buffer = _gl.createBuffer() as WebGLBuffer;
        if (DEBUG && !this.buffer) throw new DebugError(`can not allocate memory for vertex buffer`);
    }

    public setData(bufferData:Float32Array, desc:IVertexArrayInfo):void{
        if (DEBUG) {
            if (!bufferData) throw new DebugError('can not set data to vertex buffer: bufferData is not specified');
            if (!desc.type) throw new DebugError('can not set data to vertex buffer: itemType is not specified');
            if (!desc.size) throw new DebugError('can not set data to vertex buffer: itemSize is not specified');
        }
        const gl:WebGLRenderingContext = this._gl;

        const lastBound = VertexBuffer.currentBuffer;
        this.bind();
        // gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(bufferSubData));
        gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW); // DYNAMIC_DRAW, STREAM_DRAW
        this.unbind();
        if (lastBound && !lastBound.isDestroyed()) lastBound.bind();

        this.vertexArrayInfo = desc;
        this.dataLength = bufferData.length;
        this.attrName = desc.attrName;
    }

    public updateDada(bufferData:Float32Array):void {
        this.setData(bufferData,this.vertexArrayInfo);
    }

    public getAttrName():string {
        return this.attrName;
    }

    public bind():void {
        this.checkDestroyed();
        if (VertexBuffer.currentBuffer!==this) {
            this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this.getGlBuffer());
        }
        VertexBuffer.currentBuffer = this;
    }

    public unbind():void{
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
        VertexBuffer.currentBuffer = undefined;
    }

    public override destroy():void{
        this._gl.deleteBuffer(this.buffer);
        super.destroy();
    }

    public getGlBuffer():WebGLBuffer{
        return this.buffer;
    }

    public getItemSize():number{
        return this.vertexArrayInfo.size;
    }

    public getItemType():number{
        return this.vertexArrayInfo.type;
    }

    public getBufferLength():number{
        return this.dataLength;
    }

}

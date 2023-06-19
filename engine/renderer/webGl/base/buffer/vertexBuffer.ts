import {DebugError} from "@engine/debug/debugError";
import {AbstractBuffer} from "@engine/renderer/webGl/base/abstract/abstractBuffer";
import {Optional} from "@engine/core/declarations";
import {IVertexArrayInfo} from "@engine/renderer/webGl/base/buffer/bufferInfo";

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

    public setData(desc:IVertexArrayInfo,drawMethod:GLenum = this._gl.STATIC_DRAW):void{
        if (DEBUG) {
            if (!desc) throw new DebugError(`can not set data to vertex buffer: wrong desc parameter: ${desc}`);
            if (!desc.array) throw new DebugError('can not set data to vertex buffer: bufferData is not specified');
            if (!desc.type) throw new DebugError('can not set data to vertex buffer: itemType is not specified');
            if (!desc.size) throw new DebugError('can not set data to vertex buffer: itemSize is not specified');
        }
        const gl:WebGLRenderingContext = this._gl;

        const lastBound = VertexBuffer.currentBuffer;
        this.bind();
        // gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(bufferSubData));
        gl.bufferData(gl.ARRAY_BUFFER, desc.array, drawMethod); // DYNAMIC_DRAW, STREAM_DRAW
        if (lastBound && !lastBound.isDestroyed()) lastBound.bind();
        else this.unbind();

        this.vertexArrayInfo = desc;
        this.dataLength = desc.array.length;
        this.attrName = desc.attrName;
    }

    public updateData(bufferData:Float32Array):void {
        this.vertexArrayInfo.array = bufferData;
        this.setData(this.vertexArrayInfo,this._gl.DYNAMIC_DRAW);
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

    public getItemType():GLenum{
        return this.vertexArrayInfo.type;
    }

    public getBufferLength():number{
        return this.dataLength;
    }

    public getStride():number {
        return this.vertexArrayInfo.stride ?? 0;
    }

    public getOffset():number {
        return this.vertexArrayInfo.offset ?? 0;
    }

}

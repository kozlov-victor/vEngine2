import {DebugError} from "@engine/debug/debugError";
import {AbstractBuffer} from "@engine/renderer/webGl/base/abstract/abstractBuffer";
import {Optional} from "@engine/core/declarations";


export class IndexBuffer extends AbstractBuffer {

    private readonly _buffer:WebGLRenderbuffer;
    private _dataLength:number;

    private static currentBuffer:Optional<IndexBuffer>;

    constructor(private readonly _gl:WebGLRenderingContext){
        super();
        if (DEBUG && !_gl) throw new DebugError("can not create IndexBuffer, gl context not passed to constructor, expected: IndexBuffer(gl)");

        this._buffer = _gl.createBuffer() as WebGLRenderbuffer;
        if (DEBUG && !this._buffer) throw new DebugError(`can not allocate memory for index buffer`);
    }

    public setData(bufferData:number[]):void{
        if (DEBUG) {
            if (!bufferData) throw new DebugError('can not set data to buffer: bufferData not specified');
        }

        const gl:WebGLRenderingContext = this._gl;

        this._dataLength = bufferData.length;

        const lastBound = IndexBuffer.currentBuffer;
        this.bind();
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bufferData), gl.STATIC_DRAW);
        this.unbind();
        if (lastBound && !lastBound.isDestroyed()) lastBound.bind();
    }

    public getGlBuffer():WebGLRenderbuffer{
        return this._buffer;
    }

    public bind():void{
        this.checkDestroyed();
        if (IndexBuffer.currentBuffer!==this) {
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffer);
            IndexBuffer.currentBuffer = this;
        }
    }

    public unbind():void{
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, null);
        IndexBuffer.currentBuffer = undefined;
    }

    public override destroy():void{
        this._gl.deleteBuffer(this._buffer);
        super.destroy();
    }

    public getBufferLength():number{
        return this._dataLength;
    }

}

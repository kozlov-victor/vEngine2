import {DebugError} from "@engine/debug/debugError";
import {AbstractBuffer} from "@engine/renderer/webGl/base/abstract/abstractBuffer";


export class IndexBuffer extends AbstractBuffer {

    private readonly _buffer:WebGLRenderbuffer;
    private _dataLength:number;

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
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bufferData), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public getGlBuffer():WebGLRenderbuffer{
        return this._buffer;
    }

    public bind():void{
        this.checkDestroyed();
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffer);
    }

    public unbind():void{
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public override destroy():void{
        this._gl.deleteBuffer(this._buffer);
        super.destroy();
    }

    public getBufferLength():number{
        return this._dataLength;
    }

}

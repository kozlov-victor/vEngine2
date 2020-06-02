import {DebugError} from "@engine/debug/debugError";


export class IndexBuffer {

    private readonly _buffer:WebGLRenderbuffer;
    private _dataLength:number;

    constructor(private readonly _gl:WebGLRenderingContext){
        if (DEBUG && !_gl) throw new DebugError("can not create IndexBuffer, gl context not passed to constructor, expected: IndexBuffer(gl)");

        this._buffer = _gl.createBuffer() as WebGLRenderbuffer;
        if (DEBUG && !this._buffer) throw new DebugError(`can not allocate memory for index buffer`);
    }

    public setData(bufferData:number[]){
        if (DEBUG) {
            if (!bufferData) throw new DebugError('can not set data to buffer: bufferData not specified');
        }

        const gl:WebGLRenderingContext = this._gl;

        this._dataLength = bufferData.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bufferData), gl.STATIC_DRAW);
        // tslint:disable-next-line:no-null-keyword
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public getGlBuffer():WebGLRenderbuffer{
        return this._buffer;
    }

    public bind():void{
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._buffer);
    }

    public unbind():void{
        // tslint:disable-next-line:no-null-keyword
        this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public destroy():void{
        this._gl.deleteBuffer(this._buffer);
    }

    public getBufferLength():number{
        return this._dataLength;
    }

}

import {DebugError} from "@engine/debug/debugError";


export class IndexBuffer {

    private readonly gl:WebGLRenderingContext;
    private readonly buffer:WebGLRenderbuffer;
    private dataLength:number;
    
    constructor(gl:WebGLRenderingContext){
        if (DEBUG && !gl) throw new DebugError("can not create IndexBuffer, gl context not passed to constructor, expected: IndexBuffer(gl)");

        this.gl = gl;
        this.buffer = gl.createBuffer() as WebGLRenderbuffer;
        if (DEBUG && !this.buffer) throw new DebugError(`can not allocate memory for index buffer`);
    }

    public setData(bufferData:number[]){
        if (DEBUG) {
            if (!bufferData) throw new DebugError('can not set data to buffer: bufferData not specified');
        }

        const gl:WebGLRenderingContext = this.gl;

        this.dataLength = bufferData.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bufferData), gl.STATIC_DRAW);
        // tslint:disable-next-line:no-null-keyword
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public getGlBuffer():WebGLRenderbuffer{
        return this.buffer;
    }

    public bind():void{
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    }

    public unbind():void{
        // tslint:disable-next-line:no-null-keyword
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    public destroy():void{
        this.gl.deleteBuffer(this.buffer);
    }

    public getBufferLength():number{
        return this.dataLength;
    }

}

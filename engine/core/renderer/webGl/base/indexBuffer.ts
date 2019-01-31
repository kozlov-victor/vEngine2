import {DebugError} from "@engine/debugError";



export class IndexBuffer {

    private readonly gl:WebGLRenderingContext;
    private readonly buffer:WebGLRenderbuffer;
    private dataLength:number;
    
    constructor(gl:WebGLRenderingContext){
        if (DEBUG && !gl) throw new DebugError("can not create IndexBuffer, gl context not passed to constructor, expected: IndexBuffer(gl)");

        this.gl = gl;
        this.buffer = gl.createBuffer() as WebGLRenderbuffer;
        if (DEBUG && !this.buffer) throw new DebugError(`can not allocate memory for index buffer`);
        this.dataLength = null;
    }

    setData(bufferData:Array<number>){
        if (DEBUG) {
            if (!bufferData) throw new DebugError('can not set data to buffer: bufferData not specified');
        }

        const gl = this.gl;

        this.dataLength = bufferData.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bufferData), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    getGlBuffer():WebGLRenderbuffer{
        return this.buffer;
    }

    bind(){
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer);
    }

    unbind(){
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    destroy(){
        this.gl.deleteBuffer(this.buffer);
    }

    getBufferLength():number{
        return this.dataLength;
    }

}

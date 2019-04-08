import {DebugError} from "@engine/debug/debugError";


import {ShaderProgram} from "./shaderProgram";

export class VertexBuffer {

    private readonly gl:WebGLRenderingContext;
    private readonly buffer:WebGLBuffer;
    private bufferItemSize:number = 0;
    private bufferItemType:number = 0;
    private dataLength:number = 0;
    private attrName:string;

    constructor(gl:WebGLRenderingContext){
        if (DEBUG && !gl) throw new DebugError("can not create VertexBuffer, gl context not passed to constructor, expected: VertexBuffer(gl)");
        this.gl = gl;
        this.buffer = gl.createBuffer();
        if (DEBUG && !this.buffer) throw new DebugError(`can not allocate memory for vertex buffer`);
    }

    setData(bufferData:number[], itemType:number, itemSize:number):void{
        if (DEBUG) {
            if (!bufferData) throw new DebugError('can not set data to buffer: bufferData not specified');
            if (!itemType) throw new DebugError('can not set data to buffer: itemType not specified');
            if (!itemSize) throw new DebugError('can not set data to buffer: itemSize not specified');
        }
        const gl:WebGLRenderingContext = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        // gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(bufferSubData));
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW); // DYNAMIC_DRAW, STREAM_DRAW
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.bufferItemSize = itemSize;
        this.bufferItemType = itemType; // BYTE, FLOAT, INT, UNSIGNED_SHORT ...
        this.dataLength = bufferData.length;
    }

    setAttrName(attrName:string):void{
        if (DEBUG && !attrName) throw new DebugError(`attrName not provided`);
        this.attrName = attrName;
    }

    bind(program:ShaderProgram):void{
        if (DEBUG && !program) throw new DebugError("can not bind VertexBuffer, program not specified");
        if (DEBUG && !this.attrName) throw new DebugError("can not bind VertexBuffer, attribute name not specified");
        program.bindBuffer(this,this.attrName);
    }

    unbind():void{
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }

    destroy():void{
        this.gl.deleteBuffer(this.buffer);
    }

    getGlBuffer():WebGLBuffer{
        return this.buffer;
    }

    getItemSize():number{
        return this.bufferItemSize;
    }

    getItemType():number{
        return this.bufferItemType;
    }

    getBufferLength():number{
        return this.dataLength;
    }

}

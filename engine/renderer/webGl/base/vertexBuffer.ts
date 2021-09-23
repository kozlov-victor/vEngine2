import {DebugError} from "@engine/debug/debugError";
import {ShaderProgram} from "./shaderProgram";
import {AbstractBuffer} from "@engine/renderer/webGl/base/abstract/abstractBuffer";

export class VertexBuffer extends AbstractBuffer {

    private readonly buffer:WebGLBuffer;
    private bufferItemSize:1|2|3|4 = undefined!;
    private bufferItemType:number = 0;
    private dataLength:number = 0;
    private attrName:string;


    constructor(private readonly _gl:WebGLRenderingContext){
        super();
        if (DEBUG && !_gl) throw new DebugError("can not create VertexBuffer, gl context not passed to constructor, expected: VertexBuffer(gl)");
        this.buffer = _gl.createBuffer() as WebGLBuffer;
        if (DEBUG && !this.buffer) throw new DebugError(`can not allocate memory for vertex buffer`);
    }

    public setData(bufferData:Float32Array, itemType:number, itemSize:1|2|3|4):void{
        if (DEBUG) {
            if (!bufferData) throw new DebugError('can not set data to vertex buffer: bufferData is not specified');
            if (!itemType) throw new DebugError('can not set data to vertex buffer: itemType is not specified');
            if (!itemSize) throw new DebugError('can not set data to vertex buffer: itemSize is not specified');
        }
        const gl:WebGLRenderingContext = this._gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        // gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(bufferSubData));
        gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW); // DYNAMIC_DRAW, STREAM_DRAW
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        this.bufferItemSize = itemSize;
        this.bufferItemType = itemType; // BYTE, FLOAT, INT, UNSIGNED_SHORT ...
        this.dataLength = bufferData.length;
    }

    public updateDada(bufferData:Float32Array):void {
        console.log(bufferData);
        this.setData(bufferData,this.bufferItemType,this.bufferItemSize);
    }

    public setAttrName(attrName:string):void{
        if (DEBUG && !attrName) throw new DebugError(`attrName not provided`);
        this.attrName = attrName;
    }

    public bind(program:ShaderProgram):void{
        if (DEBUG && !program) throw new DebugError("can not bind VertexBuffer, program is not specified");
        if (DEBUG && !this.attrName) throw new DebugError("can not bind VertexBuffer, attribute name is not specified");
        this.checkDestroyed();
        program.bindBuffer(this,this.attrName);
    }

    public unbind():void{
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
    }

    public override destroy():void{
        this._gl.deleteBuffer(this.buffer);
        super.destroy();
    }

    public getGlBuffer():WebGLBuffer{
        return this.buffer;
    }

    public getItemSize():number{
        return this.bufferItemSize;
    }

    public getItemType():number{
        return this.bufferItemType;
    }

    public getBufferLength():number{
        return this.dataLength;
    }

}

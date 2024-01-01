
import {DebugError} from "@engine/debug/debugError";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {Texture} from "@engine/renderer/webGl/base/texture/texture";

const asGlRenderer = (game:Game):WebGlRenderer|undefined=>{
    const renderer = game.getRenderer();
    if (renderer.type==='WebGlRenderer') return renderer as WebGlRenderer;
    if (DEBUG) throw new DebugError(`WebGlRenderer is needed`);
    return undefined;
};

export class DataTexture extends Texture {

    private _data:Uint8Array;

    constructor(game:Game,width:number,height:number){
        super(asGlRenderer(game)!.getNativeContext());
        if (DEBUG) {
            if (width<=0 || height<=0) throw new DebugError(`wring data texture size: ${width}:${height}`);
        }
        this.size.setWH(width,height);
        this._data = new Uint8Array(this.size.width*this.size.height*4);
        super.setRawData(this._data,width,height);

    }


    public setNewData(data: Uint8Array):void {
        this._data = data;
        this.updateRawData();
    }

    public getData():Uint8Array {
        return this._data;
    }

    public setRawPixelAt(x:number, y:number, r:Uint8, g:Uint8, b:Uint8, a:Uint8):void {
        const position = (y*this.size.width + x)*4;
        const rawData = this.getData();
        if (DEBUG && (position<0 || position>rawData.length-1)) {
            throw new DebugError(`can not set raw pixel data at {${x},${y}}: position ${position} is out of range. Actual buffer length is ${this._data.length}`);
        }
        rawData[position  ] = r;
        rawData[position+1] = g;
        rawData[position+2] = b;
        rawData[position+3] = a;
    }

    public flush():void{
        this.updateRawData();
    }

    private updateRawData():void{
        const gl = this.gl;
        this.beforeOperation();
        // target: GLenum,
        // level: GLint,
        // xoffset: GLint,
        // yoffset: GLint,
        // width: GLsizei,
        // height: GLsizei,
        // format: GLenum,
        // type: GLenum,
        // pixels: ArrayBufferView
        gl.texSubImage2D(
            gl.TEXTURE_2D,
            0, 0, 0,
            this.size.width,this.size.height,
            gl.RGBA, gl.UNSIGNED_BYTE, this._data
        );
        this.afterOperation();
    }

}

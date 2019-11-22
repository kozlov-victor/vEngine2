import {Texture} from "@engine/renderer/webGl/base/texture";
import {DebugError} from "@engine/debug/debugError";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {ITexture} from "@engine/renderer/common/texture";

const asGlRenderer = (game:Game):WebGlRenderer|undefined=>{
    const renderer:AbstractRenderer = game.getRenderer();
    if (renderer.type==='WebGlRenderer') return renderer as WebGlRenderer;
    if (DEBUG) throw new DebugError(`WebGlRenderer is needed`);
    return undefined;
};

export class DataTexture extends Texture {

    private _data:Uint8Array;
    private readonly _link:ResourceLink<ITexture>;

    constructor(game:Game,width:number,height:number){
        super(asGlRenderer(game)!.getNativeContext());
        if (DEBUG) {
            if (width<=0 || height<=0) throw new DebugError(`wring data texture size: ${width}:${height}`);
        }
        this.size.setWH(width,height);
        this._data = new Uint8Array(this.size.width*this.size.height*4);
        super.setRawData(this._data,width,height);

        this._link = ResourceLink.create(this);
    }

    public getLink():ResourceLink<ITexture>{
        return this._link;
    }

    public setNewData(data: Uint8Array) {
        this._data = data;
        this.updateRawData();
    }

    public getData():Uint8Array {
        return this._data;
    }

    public setRawPixelAt(x:number,y:number,r:byte,g:byte,b:byte,a:byte):void {
        const position = (y*this.size.width + x)*4;
        const rawData:Uint8Array = this.getData();
        if (DEBUG && (position<0 || position>rawData.length-1)) {
            throw new DebugError(`can not set raw pixel data at {${x},${y}}: position ${position} is out of range. Actual buffer length is ${this._data.length}`);
        }
        rawData[position  ] = r;
        rawData[position+1] = g;
        rawData[position+2] = b;
        rawData[position+3] = a;
    }

    public flush(){
        this.updateRawData();
    }

    private updateRawData(){
        const gl:WebGLRenderingContext = this.gl;
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
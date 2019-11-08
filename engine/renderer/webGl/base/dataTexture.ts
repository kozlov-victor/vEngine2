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
    private _link:ResourceLink<ITexture>;

    constructor(game:Game,width:number,height:number){
        super(asGlRenderer(game)!.getNativeContext());
        if (DEBUG) {
            if (width<=0 || height<=0) throw new DebugError(`wring data texture size: ${width}:${height}`);
        }
        this.size.setWH(width,height);
        this._data = new Uint8Array(this.size.width*this.size.height*4);
        super.setRawData(this._data,width,height);

        const link:ResourceLink<Texture> = ResourceLink.create();
        (game.getRenderer() as WebGlRenderer).putToCache(link,this);
        link.setTarget(this);
        this._link = link;
    }

    public getLink():ResourceLink<ITexture>{
        return this._link;
    }

    public setData(data: Uint8Array) {
        this._data = data;
        super.setRawData(this._data, this.size.width, this.size.height);
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
        this.setData(this._data);
    }

}
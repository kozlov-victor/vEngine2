
import {Game} from "@engine/core/game";
import {Image} from "./image";
import {DebugError} from "@engine/debugError";
import {Size} from "@engine/core/geometry/size";
import {TextureInfo} from "@engine/core/renderer/webGl/renderPrograms/abstract/abstractDrawer";


export class NinePatchImage extends Image {

    private a:number = 0;
    private b:number = 0;
    private c:number = 0;
    private d:number = 0;

    private _patches:Image[] = [];

    /**
     *
     |-A-|--------|-B-|
    C|-1-|---2----|-3-|
     |---|--------|---|
     |-4-|   4    |-6-|
     |---|        |---|
     |---|--------|---|
    D|-7-|---8----|-9-|
     |---|--------|---|
     */
    constructor(game: Game) {
        super(game);
        for (let i=0;i<9;i++) {
            this._patches[i] = new Image(this.game);
        }
        this.getRect().observe(()=>{this.revalidate()});
    }

    private _revalidatePatches(){
        let ti:TextureInfo = this.game.getRenderer().renderableCache[this.getResourceLink().getId()];
        if (DEBUG || !ti) throw new DebugError(`can not find texture info by id ${this.getResourceLink().getId()}`);
        let texSize:Size = ti.texture.getSize();
        let destRect = this.getRect();
        let patch:Image;
        let a = this.a,b=this.b,c=this.c,d=this.d;
        // patch 1
        patch = this._patches[0];
        let patchCnt=1;
        patch.srcRect.setXYWH(0,0,a,c);
        patch.setXYWH(destRect.getPoint().x,destRect.getPoint().y,a,c);
        // patch 2
        patch = this._patches[patchCnt++];
        patch.srcRect.setXYWH(a,0,texSize.width-a-b,c);
        patch.setXYWH(destRect.x+a,destRect.y,destRect.width-a-c,c);
        // patch 3
        patch = this._patches[patchCnt++];
        patch.srcRect.setXYWH(texSize.width-b,0,b,c);
        patch.setXYWH(destRect.getPoint().x+destRect.width-b,destRect.getPoint().y,b,c);
        // patch 4
        patch = this._patches[patchCnt++];
        patch.srcRect.setXYWH(0, c, a,texSize.height - c - d);
        patch.setXYWH(destRect.x,destRect.y+c,a,destRect.height-c-d);
        // patch 5
        patch = this._patches[patchCnt++];
        patch.srcRect.setXYWH(a, c, texSize.width - a - b,texSize.height - c - d);
        patch.setXYWH(destRect.x + a,destRect.y+c,destRect.width - a - b,destRect.height-c-d);
        // patch 6
        patch = this._patches[patchCnt++];
        patch.srcRect.setXYWH(texSize.width - b, c, b,texSize.height - c - d);
        patch.setXYWH(destRect.x + destRect.width - b,destRect.y+c,b,destRect.height-c-d);
        // patch 7
        patch = this._patches[patchCnt++];
        patch.srcRect.setXYWH(0,texSize.height - d,a,d);
        patch.setXYWH(destRect.getPoint().x,destRect.getPoint().y+destRect.height - d,a,d);
        // patch 8
        patch = this._patches[patchCnt++];
        patch.srcRect.setXYWH(a,texSize.height - d,texSize.width-a-b,d);
        patch.setXYWH(destRect.x + a,destRect.y+destRect.height-d,destRect.width-a-b,d);
        // patch 9
        patch = this._patches[patchCnt++];
        patch.srcRect.setXYWH(texSize.width-b,texSize.height-d,b,d);
        patch.setXYWH(destRect.getPoint().x+destRect.width-b,destRect.getPoint().y+destRect.height-d,b,d);
        for (let i=0;i<9;i++) {
            this._patches[i].setResourceLink(this.getResourceLink());
        }
    }

    revalidate(){
        if (DEBUG && !this.getResourceLink()) {
            throw new DebugError(`can not render Image: resource link is not specified`);
        }
        let width:number = this.width;
        let height:number = this.height;
        if (width<this.a+this.b) width = this.a + this.b;
        if (height<this.c+this.d) height = this.c + this.d;
        this.setWH(width,height);
        this._revalidatePatches();
    }

    setABCD(a:number);
    setABCD(a:number,b:number,c:number,d:number);
    setABCD(a:number,b?:number,c?:number,d?:number) {
        if (b===undefined) b = a;
        if (c===undefined) c = b;
        if (d===undefined) d = c;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.revalidate();

    }

    draw():boolean{
        for (let i=0;i<9;i++) {
            this._patches[i].render(true);
        }
        return true;
    }

}
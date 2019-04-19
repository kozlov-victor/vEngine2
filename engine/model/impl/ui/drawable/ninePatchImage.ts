import {Game} from "@engine/game";
import {Image} from "./image";
import {DebugError} from "@engine/debug/debugError";
import {Size} from "@engine/geometry/size";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Rect} from "@engine/geometry/rect";

export class NinePatchImage extends Image {

    readonly type:string = 'NinePatchImage';
    private a:number = 0;
    private b:number = 0;
    private c:number = 0;
    private d:number = 0;

    private _patches:Image[] = new Array(10);

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
        for (let i:number=0;i<9;i++) {
            this._patches[i] = new Image(this.game);
        }
        this.getSrcRect().observe(()=>{this.revalidate()});
    }

    private _revalidatePatches():void{
        const t:Texture = this.getResourceLink().getTarget() as Texture;
        if (DEBUG || !t) {
            console.log(this.getResourceLink());
            throw new DebugError(`can not find texture by link provided`);
        }
        const texSize:Size = t.size;
        const destRect:Rect = this.getSrcRect();
        let patch:Image;
        const a:number = this.a,b:number=this.b,c:number=this.c,d:number=this.d;
        // patch 1
        patch = this._patches[0];
        let patchCnt:number=1;
        patch.getSrcRect().setXYWH(0,0,a,c);
        patch.setXYWH(destRect.point.x,destRect.point.y,a,c);
        // patch 2
        patch = this._patches[patchCnt++];
        patch.getSrcRect().setXYWH(a,0,texSize.width-a-b,c);
        patch.setXYWH(destRect.point.x+a,destRect.point.y,destRect.size.width-a-c,c);
        // patch 3
        patch = this._patches[patchCnt++];
        patch.getSrcRect().setXYWH(texSize.width-b,0,b,c);
        patch.setXYWH(destRect.point.x+destRect.size.width-b,destRect.point.y,b,c);
        // patch 4
        patch = this._patches[patchCnt++];
        patch.getSrcRect().setXYWH(0, c, a,texSize.height - c - d);
        patch.setXYWH(destRect.point.x,destRect.point.y+c,a,destRect.size.height-c-d);
        // patch 5
        patch = this._patches[patchCnt++];
        patch.getSrcRect().setXYWH(a, c, texSize.width - a - b,texSize.height - c - d);
        patch.setXYWH(destRect.point.x + a,destRect.point.y+c,destRect.size.width - a - b,destRect.size.height-c-d);
        // patch 6
        patch = this._patches[patchCnt++];
        patch.getSrcRect().setXYWH(texSize.width - b, c, b,texSize.height - c - d);
        patch.setXYWH(
            destRect.point.x + destRect.size.width - b,destRect.point.y+c,b,destRect.size.height-c-d
        );
        // patch 7
        patch = this._patches[patchCnt++];
        patch.getSrcRect().setXYWH(0,texSize.height - d,a,d);
        patch.setXYWH(destRect.point.x,destRect.point.y+destRect.size.height - d,a,d);
        // patch 8
        patch = this._patches[patchCnt++];
        patch.getSrcRect().setXYWH(a,texSize.height - d,texSize.width-a-b,d);
        patch.setXYWH(
            destRect.point.x + a,destRect.point.y+destRect.size.height-d,destRect.size.width-a-b,d
        );
        // patch 9
        patch = this._patches[patchCnt++];
        patch.getSrcRect().setXYWH(texSize.width-b,texSize.height-d,b,d);
        patch.setXYWH(destRect.point.x+destRect.size.width-b,destRect.point.y+destRect.size.height-d,b,d);
        for (let i:number=0;i<9;i++) {
            this._patches[i].setResourceLink(this.getResourceLink());
        }
    }

    revalidate():void {
        if (DEBUG && !this.getResourceLink()) {
            throw new DebugError(`can not render Image: resource link is not specified`);
        }
        let {width,height} = this.size;
        if (width<this.a+this.b) width = this.a + this.b;
        if (height<this.c+this.d) height = this.c + this.d;
        this.setWH(width,height);
        this._revalidatePatches();
    }

    setABCD(a:number):void;
    setABCD(a:number,b:number,c:number,d:number):void;
    setABCD(a:number,b?:number,c?:number,d?:number):void {
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
        for (let i:number=0;i<9;i++) {
            this._patches[i].render();
        }
        return true;
    }

}
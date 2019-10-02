import {Game} from "@engine/core/game";
import {Image} from "./image";
import {DebugError} from "@engine/debug/debugError";
import {Size} from "@engine/geometry/size";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/texture";

export class NinePatchImage extends RenderableModel {

    public readonly type:string = 'NinePatchImage';
    private a:number = 5;
    private b:number = 5;
    private c:number = 5;
    private d:number = 5;

    private _patches:Image[] = new Array(10);

    // resource
    private _resourceLink:ResourceLink<ITexture>;

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
        this.size.observe(()=>{this.revalidate();});
    }

    public revalidate():void {
        if (DEBUG && !this.getResourceLink()) {
            throw new DebugError(`can not render Image: resource link is not specified`);
        }
        let {width,height} = this.size;

        const t:Texture = this.getResourceLink().getTarget() as Texture;
        if (DEBUG && !t) {
            console.log(this.getResourceLink());
            throw new DebugError(`can not find texture by link provided`);
        }

        if (width===0) width = t.size.width;
        if (height===0) height = t.size.height;

        if (width<this.a+this.b) width = this.a + this.b;
        if (height<this.c+this.d) height = this.c + this.d;
        this.size.setWH(width,height);
        this._revalidatePatches();
    }

    public setABCD(a:number,b:number = a,c:number = b,d:number = c):void {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.revalidate();
    }

    public setResourceLink(link:ResourceLink<ITexture>):void{
        if (DEBUG && !link) {
            throw new DebugError(`can not set resource link: link is not passed`);
        }
        this._resourceLink = link;
        for (let i:number=0;i<9;i++) {
            this._patches[i] = new Image(this.game);
            this._patches[i].setResourceLink(link);
            this.appendChild(this._patches[i]);
        }
    }

    public getResourceLink():ResourceLink<ITexture>{
        return this._resourceLink;
    }

    public draw():boolean{
        return true;
    }

    private _revalidatePatches():void{
        const t:Texture = this.getResourceLink().getTarget() as Texture;
        const texSize:Size = t.size;
        const destSize:Size = this.size;
        let patch:Image;
        const a:number = this.a,b:number=this.b,c:number=this.c,d:number=this.d;
        // patch 1
        patch = this._patches[0];
        patch.setXYWH(0,0,a,c);
        patch.getSrcRect().setXYWH(0,0,a,c);
        // patch 2
        patch = this._patches[1];
        patch.setXYWH(a,0,destSize.width-a-c,c);
        patch.getSrcRect().setXYWH(a,0,texSize.width-a-b,c);
        // patch 3
        patch = this._patches[2];
        patch.setXYWH(destSize.width-b,0,b,c);
        patch.getSrcRect().setXYWH(texSize.width-b,0,b,c);
        // patch 4
        patch = this._patches[3];
        patch.setXYWH(0,c,a,destSize.height-c-d);
        patch.getSrcRect().setXYWH(0, c, a,texSize.height - c - d);
        // patch 5
        patch = this._patches[4];
        patch.setXYWH(a,c,destSize.width - a - b,destSize.height-c-d);
        patch.getSrcRect().setXYWH(a, c, texSize.width - a - b,texSize.height - c - d);
        // patch 6
        patch = this._patches[5];
        patch.setXYWH(destSize.width - b,c,b,destSize.height-c-d);
        patch.getSrcRect().setXYWH(texSize.width - b, c, b,texSize.height - c - d);
        // patch 7
        patch = this._patches[6];
        patch.setXYWH(0,destSize.height - d,a,d);
        patch.getSrcRect().setXYWH(0,texSize.height - d,a,d);
        // patch 8
        patch = this._patches[7];
        patch.setXYWH(a,destSize.height-d,destSize.width-a-b,d);
        patch.getSrcRect().setXYWH(a,texSize.height - d,texSize.width-a-b,d);
        // patch 9
        patch = this._patches[8];
        patch.setXYWH(destSize.width-b,destSize.height-d,b,d);
        patch.getSrcRect().setXYWH(texSize.width-b,texSize.height-d,b,d);
    }

}
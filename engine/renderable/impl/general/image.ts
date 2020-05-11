import {Game} from "@engine/core/game";
import {Rect} from "@engine/geometry/rect";
import {DebugError} from "@engine/debug/debugError";
import {Color} from "@engine/renderer/common/color";
import {Point2d} from "@engine/geometry/point2d";
import {ICloneable, IResource} from "@engine/core/declarations";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {RenderableModel} from "../../abstract/renderableModel";
import {IFilter} from "@engine/renderer/common/ifilter";

export const enum STRETCH_MODE {
    STRETCH,
    REPEAT
}

export class Image extends RenderableModel implements ICloneable<Image>,IResource<ITexture>{

    public readonly type:string = 'Image';
    public borderRadius:number = 0;
    public offset:Point2d = new Point2d();
    public stretchMode:STRETCH_MODE = STRETCH_MODE.STRETCH;
    public color:Color = Color.NONE.clone();
    public lineWidth:number = 0;
    private _pixelPerfect:boolean = false;

    // resource
    private _resourceLink:ResourceLink<ITexture>;

    private _srcRect:Rect = new Rect();

    constructor(game: Game) {
        super(game);
    }

    public revalidate():void {
        if (DEBUG && !this.getResourceLink()) {
            console.error(this);
            throw new DebugError(`can not render Image: resourceLink is not specified`);
        }
        if (DEBUG && !this.getResourceLink().getTarget()) {
            console.error(this);
            throw new DebugError(`can not render Image: can not find texture by resource link`);
        }
        const tex:ITexture = this.getResourceLink().getTarget();
        if (this.size.isZero()) {
            this.size.width = tex.size.width;
            this.size.height = tex.size.height;
        }
        if (this._srcRect.isZeroSize()) {
            this._srcRect.setWH(tex.size.width,tex.size.height);
        }
    }

    public draw():void{
        this.game.getRenderer().drawImage(this);
    }

    public clone():Image {
        const cloned:Image = new Image(this.game);
        this.setClonedProperties(cloned);
        return cloned;
    }

    public getSrcRect():Rect{
        return this._srcRect;
    }

    public setResourceLink(link:ResourceLink<ITexture>):void{
        if (DEBUG && !link) {
            throw new DebugError(`can not set resource link: link is not passed`);
        }
        this._resourceLink = link;
        this.revalidate();
    }

    public getResourceLink():ResourceLink<ITexture>{
        return this._resourceLink;
    }

    public setPixelPerfect(val:boolean):void{
        this._pixelPerfect = val;
    }

    public isPixelPerfect():boolean{
        return this._pixelPerfect;
    }

    protected setClonedProperties(cloned:Image):void {
        cloned._srcRect.set(this._srcRect);
        cloned.size.set(this.size);
        cloned.borderRadius = this.borderRadius;
        cloned.offset.set(this.offset);
        cloned.stretchMode = this.stretchMode;
        cloned.color = this.color.clone();
        cloned.lineWidth = this.lineWidth;
        cloned._pixelPerfect = this._pixelPerfect;
        cloned.setResourceLink(this.getResourceLink());
        super.setClonedProperties(cloned);
    }



}

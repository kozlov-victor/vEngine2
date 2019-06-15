import {Game} from "@engine/game";
import {Rect} from "@engine/geometry/rect";
import {DebugError} from "@engine/debug/debugError";
import {Shape} from "./abstract/shape";
import {Color} from "@engine/renderer/color";
import {Point2d} from "@engine/geometry/point2d";
import {ICloneable, IResource} from "@engine/declarations";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/texture";

export enum STRETCH_MODE {
    STRETCH,
    REPEAT
}

export class Image extends Shape implements ICloneable<Image>,IResource<ITexture>{

    public readonly type:string = 'Image';
    public borderRadius:number = 0;
    public offset:Point2d = new Point2d();
    public stretchMode:STRETCH_MODE = STRETCH_MODE.STRETCH;

    // resource
    private _resourceLink:ResourceLink<ITexture>;

    constructor(game: Game) {
        super(game);
        (this.fillColor as Color).set(Color.NONE);
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
        const tex:ITexture = (this.getResourceLink() as ResourceLink<ITexture>).getTarget();
        if (this.size.isZero()) {
            this.size.width = tex.size.width;
            this.size.height = tex.size.height;
        }
        if (this._srcRect.size.isZero()) {
            this._srcRect.size.width = tex.size.width;
            this._srcRect.size.height = tex.size.height;
        }
    }

    public draw():boolean{
        this.game.getRenderer().drawImage(this);
        return true;
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
        this._resourceLink = link;
    }

    public getResourceLink():ResourceLink<ITexture>{
        return this._resourceLink;
    }

    protected setClonedProperties(cloned:Image):void {
        cloned._srcRect.set(this._srcRect);
        cloned.borderRadius = this.borderRadius;
        cloned.offset.set(this.offset);
        cloned.stretchMode = this.stretchMode;
        cloned.setResourceLink(this.getResourceLink());
        super.setClonedProperties(cloned);
    }



}
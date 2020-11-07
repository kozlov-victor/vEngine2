import {Game} from "@engine/core/game";
import {Rect} from "@engine/geometry/rect";
import {DebugError} from "@engine/debug/debugError";
import {Color} from "@engine/renderer/common/color";
import {Point2d} from "@engine/geometry/point2d";
import {ICloneable} from "@engine/core/declarations";
import {ResourceLink, ResourceLinkState} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {RenderableModelWithResourceLink} from "@engine/renderable/abstract/renderableModelWithResourceLink";

export const enum STRETCH_MODE {
    STRETCH,
    REPEAT
}

export class Image extends RenderableModelWithResourceLink implements ICloneable<Image>{

    public readonly type:string = 'Image';
    public borderRadius:number = 0;
    public offset:Point2d = new Point2d();
    public stretchMode:STRETCH_MODE = STRETCH_MODE.STRETCH;
    public color:Color = Color.NONE.clone();
    public lineWidth:number = 0;

    private _pixelPerfect:boolean = false;
    private _srcRect:Rect = new Rect();

    constructor(game: Game) {
        super(game);
    }

    public revalidate():void {
        if (DEBUG && !this.getResourceLink()) {
            console.error(this);
            throw new DebugError(`can not render Image: resourceLink is not specified`);
        }
        if (DEBUG && this.getResourceLink().getState()!==ResourceLinkState.COMPLETED) {
            console.error(this);
            throw new DebugError(`can not render Image: wrong resource link state: ${this.getResourceLink().getState()}`);
        }
        if (DEBUG && !this.getResourceLink().getTarget()) {
            console.error(this);
            throw new DebugError(`can not render Image: resource link target is not defined`);
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

    public setProps(props:IImageProps):void{
        this.setResourceLink(props.resourceLink as ResourceLink<ITexture>);
        super.setProps(props);
        if (props.borderRadius!==undefined) this.borderRadius = props.borderRadius;
        if (props.color!==undefined) this.color.setRGBA(props.color.r,props.color.g,props.color.b,props.color.a);
        if (props.lineWidth!==undefined) this.lineWidth = props.lineWidth;
    }

    public getSrcRect():Rect{
        return this._srcRect;
    }

    public setResourceLink(link:ResourceLink<ITexture>):void{
        super.setResourceLink(link);
        if (this.size.isZero()) this.size.set(link.getTarget().size);
        if (this._srcRect.isZeroSize()) this._srcRect.setSize(this.size);
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

import {Game} from "@engine/core/game";
import {Rect} from "@engine/geometry/rect";
import {Color} from "@engine/renderer/common/color";
import {Point2d} from "@engine/geometry/point2d";
import {ICloneable} from "@engine/core/declarations";
import {ITexture} from "@engine/renderer/common/texture";
import {RenderableModelWithTexture} from "@engine/renderable/abstract/renderableModelWithTexture";

export const enum STRETCH_MODE {
    STRETCH,
    REPEAT
}

export class Image extends RenderableModelWithTexture implements ICloneable<Image>{

    public override readonly type:string = 'Image';
    public borderRadius:number = 0;
    public offset:Point2d = new Point2d();
    public stretchMode:STRETCH_MODE = STRETCH_MODE.STRETCH;
    public color:Color = Color.NONE.clone();
    public lineWidth:number = 0;
    public readonly srcRect:Rect = new Rect();

    private _pixelPerfect:boolean = false;

    constructor(game: Game,texture:ITexture) {
        super(game);
        this.setTexture(texture);
    }

    public draw():void{
        this.game.getRenderer().drawImage(this);
    }

    public override setTexture(texture:ITexture):void {
        super.setTexture(texture);
        if (this.size.isZero()) this.size.setFrom(texture.size);
        if (this.srcRect.width===0 || this.srcRect.height===0) this.srcRect.setSize(this.size);
    }

    public clone():Image {
        const cloned:Image = new Image(this.game,this.getTexture());
        this.setClonedProperties(cloned);
        return cloned;
    }

    public override setProps(props:IImageProps):void{
        super.setProps(props);
        if (props.borderRadius!==undefined) this.borderRadius = props.borderRadius;
        if (props.color!==undefined) this.color.setRGBA(props.color.r,props.color.g,props.color.b,props.color.a);
        if (props.lineWidth!==undefined) this.lineWidth = props.lineWidth;
    }


    public setPixelPerfect(val:boolean):void{
        this._pixelPerfect = val;
    }

    public isPixelPerfect():boolean{
        return this._pixelPerfect;
    }

    protected override setClonedProperties(cloned:Image):void {
        cloned.srcRect.setFrom(this.srcRect);
        cloned.size.setFrom(this.size);
        cloned.borderRadius = this.borderRadius;
        cloned.offset.setFrom(this.offset);
        cloned.stretchMode = this.stretchMode;
        cloned.color = this.color.clone();
        cloned.lineWidth = this.lineWidth;
        cloned._pixelPerfect = this._pixelPerfect;
        super.setClonedProperties(cloned);
    }

}

import {RenderableModel} from "./renderableModel";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {Image} from "@engine/renderable/impl/general/image";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {Size} from "@engine/geometry/size";
import {Optional} from "@engine/core/declarations";
import {AbstractGradient} from "@engine/renderable/impl/fill/abstract/abstractGradient";

export abstract class Shape extends RenderableModel implements IShapeProps{

    get lineWidth(): number {
        return this._lineWidth;
    }

    set lineWidth(value: number) {
        this._lineWidth = value;
    }

    public color:Color = Color.BLACK.clone();
    protected _lineWidth:number = 0;
    public fillColor:Color = Color.GREY.clone();
    public fillGradient:Optional<AbstractGradient>;

    protected constructor(game:Game){
        super(game);
    }

    public cacheAsBitmap():Image {
        const sizeInt:Size = new Size().setWH(~~this.size.width,~~this.size.height);
        const renderTarget:IRenderTarget =
            this.game.getRenderer().getHelper().
            createRenderTarget(this.game,sizeInt);

        const image:Image = new Image(this.game);
        image.size.set(sizeInt);
        this.renderToTexture(renderTarget,Color.NONE);
        image.setResourceLink(renderTarget.getResourceLink());
        renderTarget.destroy();
        return image;
    }

    public setProps(props:IShapeProps):void{
        super.setProps(props);
        if (props.color!==undefined) this.color.setRGBA(props.color.r,props.color.g,props.color.b,props.color.a);
        // tslint:disable-next-line:max-line-length
        if (props.fillColor!==undefined) (this.fillColor as Color).setRGBA(props.fillColor.r,props.fillColor.g,props.fillColor.b,props.fillColor.a);
        if (props.lineWidth!==undefined) this._lineWidth = props.lineWidth;
    }

    protected setClonedProperties(cloned:Shape):void{
        cloned.color.set(this.color);
        cloned._lineWidth = this._lineWidth;
        cloned.fillColor = this.fillColor.clone();
        if (this.fillGradient!==undefined) cloned.fillGradient = this.fillGradient.clone();
        cloned.filters = [...this.filters];
        super.setClonedProperties(cloned);
    }

}

import {RenderableModel} from "./renderableModel";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {LinearGradient} from "@engine/renderer/common/linearGradient";
import {Image} from "@engine/renderable/impl/general/image";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {Size} from "@engine/geometry/size";
import {Optional} from "@engine/core/declarations";

export abstract class Shape extends RenderableModel implements IShapeProps{

    public color:Color = Color.BLACK.clone();
    public lineWidth:number = 0;
    public fillColor:Color = Color.RGB(100,100,100);
    public fillGradient:Optional<LinearGradient>;

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
        if (props.fillColor!==undefined) (this.fillColor as Color).setRGBA(props.fillColor.r,props.fillColor.g,props.fillColor.b,props.fillColor.a);
        if (props.lineWidth!==undefined) this.lineWidth = props.lineWidth;
    }

    protected setClonedProperties(cloned:Shape):void{
        cloned.color.set(this.color);
        cloned.lineWidth = this.lineWidth;
        cloned.fillColor = this.fillColor.clone();
        if (this.fillGradient!==undefined) cloned.fillGradient = this.fillGradient.clone();
        cloned.filters = [...this.filters];
        super.setClonedProperties(cloned);
    }

}

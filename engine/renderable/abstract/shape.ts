import {RenderableModel} from "./renderableModel";
import {Color} from "@engine/renderer/common/color";
import {Game} from "@engine/core/game";
import {LinearGradient} from "@engine/renderer/common/linearGradient";
import {IFilter} from "@engine/renderer/common/ifilter";
import {Image} from "@engine/renderable/impl/general/image";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {Size} from "@engine/geometry/size";

export abstract class Shape extends RenderableModel {

    public color:Color = Color.BLACK.clone();
    public lineWidth:number = 0;
    public fillColor:Color|LinearGradient = Color.RGB(100,100,100);
    public filters: IFilter[] = [];

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
        this.renderToTexture(renderTarget,false);
        image.setResourceLink(renderTarget.getResourceLink());
        renderTarget.destroy();
        return image;
    }

    protected setClonedProperties(cloned:Shape):void{
        cloned.color.set(this.color);
        cloned.lineWidth = this.lineWidth;
        if (!cloned.fillColor)cloned.fillColor = this.fillColor.clone();
        else (cloned.fillColor as Color).set(this.fillColor as Color); //todo not very nice
        cloned.filters = [...this.filters];
        super.setClonedProperties(cloned);
    }

}

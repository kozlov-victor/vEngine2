import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {OffsetMapFilter} from "@engine/renderer/webGl/filters/texture/offsetMapFilter";
import {Texture} from "@engine/renderer/webGl/base/texture";

export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;
    private offsetMapLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadTexture('./assets/logo.png');
        this.offsetMapLink =  this.resourceLoader.loadTexture('./offsetMap/glass.jpg');
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady() {
        const spr:Image = new Image(this.game);
        spr.addBehaviour(new DraggableBehaviour(this.game));
        spr.setResourceLink(this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);

        const offsetMapFilter = new OffsetMapFilter(this.game,this.offsetMapLink.getTarget() as Texture);
        this.filters = [offsetMapFilter];

    }

}

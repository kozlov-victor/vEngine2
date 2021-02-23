import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {OffsetMapFilter} from "@engine/renderer/webGl/filters/texture/offsetMapFilter";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {TaskQueue} from "@engine/resources/taskQueue";

export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    private logoLink:ITexture;

    @Resource.Texture('./offsetMap/glass.jpg')
    private offsetMapLink:ITexture;

    public onPreloading(taskQueue:TaskQueue):void {
        super.onPreloading(taskQueue);
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady():void {
        const spr:Image = new Image(this.game,this.logoLink);
        spr.addBehaviour(new DraggableBehaviour(this.game));
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);

        const offsetMapFilter = new OffsetMapFilter(this.game,this.offsetMapLink);
        this.filters = [offsetMapFilter];

    }

}

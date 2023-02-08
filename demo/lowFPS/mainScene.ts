import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {TaskQueue} from "@engine/resources/taskQueue";


export class MainScene extends Scene {

    private logoLink:ITexture;
    private obj:Image;

    public override onPreloading(taskQueue:TaskQueue):void {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;

        taskQueue.addNextTask(async progress=>{
            this.logoLink = await taskQueue.getLoader().loadTexture('./assets/logo.png',progress);
        });

    }

    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady():void {
        const spr:Image = new Image(this.game,this.logoLink);
        spr.pos.setFrom({x:10,y:10});
        this.appendChild(spr);
        spr.transformPoint.setToCenter();
        spr.velocity.x = -50;
        this.obj = spr;

    }

    protected override onUpdate(): void {
        if (this.obj.pos.x<-150) this.obj.pos.x = this.game.size.width + 50;
    }

}

import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";


export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;
    private obj:Image;

    public onPreloading():void {
        this.logoLink = this.resourceLoader.loadTexture('./assets/logo.png');
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady():void {
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);
        spr.transformPoint.setToCenter();
        spr.velocity.x = -20;
        this.obj = spr;

    }

    protected onUpdate(): void {
        if (this.obj.pos.x<-150) this.obj.pos.x = this.game.size.width + 50;
    }

}

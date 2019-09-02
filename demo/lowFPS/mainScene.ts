import {Scene} from "@engine/core/scene";
import {GameObject} from "@engine/renderable/impl/general/gameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/color";
import {Image} from "@engine/renderable/impl/geometry/image";
import {ITexture} from "@engine/renderer/texture";


export class MainScene extends Scene {

    private obj:GameObject;
    private logoLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('./assets/logo.png');
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.width;
    }

    public onReady() {
        this.obj = new GameObject(this.game);
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        this.obj.sprite = spr;
        this.obj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.obj);
        this.obj.rotationPoint.setToCenter();
        this.obj.velocity.x = -20;

    }

    protected onUpdate(): void {
        if (this.obj.pos.x<-150) this.obj.pos.x = this.game.width + 50;
    }

}

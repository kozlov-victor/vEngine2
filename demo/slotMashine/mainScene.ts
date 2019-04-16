import {Scene} from "@engine/model/impl/scene";
import {Rectangle} from "@engine/model/impl/ui/drawable/rectangle";
import {Color} from "@engine/renderer/color";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {AbsoluteLayout} from "@engine/model/impl/ui/layouts/absoluteLayout";
import {TextureInfo} from "@engine/renderer/webGl/programs/abstract/abstractDrawer";
import {MathEx} from "@engine/misc/mathEx";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Mashine} from "./entities/mashine";
import {BarrelDistortionFilter} from "@engine/renderer/webGl/filters/textureFilters/barrelDistortionFilter";

export class MainScene extends Scene {

    private overlay:Image;
    wheelLink:ResourceLink;

    private mashine:Mashine;


    onPreloading() {
        this.overlay = new Image(this.game);
        this.overlay.setResourceLink(this.resourceLoader.loadImage(require('../slotMashine/resources/overlay.png')));
        this.wheelLink = this.resourceLoader.loadImage(require(`../slotMashine/resources/wheel.png`));

        const rect:Rectangle = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.width;
    }

    onReady() {

        this.mashine = new Mashine(this.game,this.wheelLink);
        this.mashine.connectToScene(this);

        this.appendChild(this.overlay);

        const filter:BarrelDistortionFilter = new BarrelDistortionFilter(this.game);
        this.filters = [filter];

        window.addEventListener('message',(e:MessageEvent)=>{
            const command = e.data as string;
            if (command=='spin') this.mashine.spin();
        })

    }

}

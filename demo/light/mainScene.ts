import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {SpriteSheet} from "@engine/model/impl/spriteSheet";
import {ResourceLink} from "@engine/resources/resourceLink";
import {LightArray} from "@engine/light/lightArray";
import {LightFilter} from "@engine/renderer/webGl/filters/light/lightFilter";
import {PointLight} from "@engine/light/pointLight";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MousePoint} from "@engine/control/mouse/mousePoint";

export class MainScene extends Scene {

    private logoObj:GameObject;
    private logoLink:ResourceLink;

    onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('../assets/logo.png');

    }

    onReady() {
        this.logoObj = new GameObject(this.game);
        let spr:SpriteSheet = new SpriteSheet(this.game);
        spr.setResourceLink(this.logoLink);
        this.logoObj.sprite = spr;
        this.logoObj.pos.fromJSON({x:10,y:10});
        this.appendChild(this.logoObj);

        const pointLight:PointLight = new PointLight(this.game);
        pointLight.isOn = true;
        pointLight.nearRadius = 10;
        pointLight.farRadius = 120;
        pointLight.pos.setXY(50,50);
        pointLight.color.setRGB(200,200,100);

        const lightArray:LightArray = new LightArray(this.game);
        lightArray.addPointLight(pointLight);
        lightArray.ambientLight.color.setRGB(10,10,10);

        const lightFilter:LightFilter = new LightFilter(this.game,lightArray);

        this.filters = [lightFilter];

        this.on(MOUSE_EVENTS.mouseMove,(e:MousePoint)=>{
            pointLight.pos.setXY(e.screenX,e.screenY);
        });


        (window as any).logoObj = this.logoObj;

    }

}

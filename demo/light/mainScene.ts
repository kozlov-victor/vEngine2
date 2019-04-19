import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {SpriteSheet} from "@engine/model/impl/spriteSheet";
import {ResourceLink} from "@engine/resources/resourceLink";
import {LightSet} from "@engine/light/lightSet";
import {LightFilter} from "@engine/renderer/webGl/filters/light/lightFilter";
import {PointLight} from "@engine/light/impl/pointLight";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MousePoint} from "@engine/control/mouse/mousePoint";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Color} from "@engine/renderer/color";

export class MainScene extends Scene {

    private logoObj:GameObject;
    private logoLink:ResourceLink;

    onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('../assets/logo.png');

    }

    onReady() {
        //this.colorBG = Color.BLACK;
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

        const lightSet:LightSet = new LightSet(this.game);
        lightSet.addPointLight(pointLight);
        lightSet.ambientLight.color.setRGB(10,10,10);
        lightSet.ambientLight.intensity = 0.1;

        const lightFilter:LightFilter = new LightFilter(this.game,lightSet);

        //this.filters = [lightFilter];
        this.logoObj.sprite.filters = [lightFilter];

        this.on(MOUSE_EVENTS.mouseMove,(e:MousePoint)=>{
            pointLight.pos.setXY(e.screenX,e.screenY);
        });
        this.logoObj.addBehaviour(new DraggableBehaviour(this.game));


        (window as any).logoObj = this.logoObj;

    }

}

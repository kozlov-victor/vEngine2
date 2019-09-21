import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {LightSet} from "@engine/light/lightSet";
import {LightFilter} from "@engine/renderer/webGl/filters/light/lightFilter";
import {PointLight} from "@engine/light/impl/pointLight";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IMousePoint} from "@engine/control/mouse/mousePoint";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Color} from "@engine/renderer/color";
import {Image} from "@engine/renderable/impl/geometry/image";
import {DirectionalLight} from "@engine/light/impl/directionalLight";
import {ITexture} from "@engine/renderer/texture";

export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('./assets/logo.png');

    }

    public onReady() {
        this.colorBG = Color.BLACK;
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);

        const pointLight:PointLight = new PointLight(this.game);
        pointLight.nearRadius = 10;
        pointLight.farRadius = 120;
        pointLight.pos.setXY(50,50);
        pointLight.color.setRGB(200,200,100);

        const dirLight:DirectionalLight = new DirectionalLight(this.game);
        dirLight.nearRadius = 20;
        dirLight.farRadius = 100;
        dirLight.pos.setXY(100,100);
        dirLight.direction = [-1,0,0];
        dirLight.color.setRGB(100,0,0);

        const lightSet:LightSet = new LightSet(this.game);
        lightSet.addPointLight(pointLight);
        lightSet.addPointLight(dirLight);
        lightSet.ambientLight.color.setRGB(10,10,10);
        lightSet.ambientLight.intensity = 0.1;

        const lightFilter:LightFilter = new LightFilter(this.game,lightSet);

        this.filters = [lightFilter];
        spr.filters = [lightFilter];

        this.on(MOUSE_EVENTS.mouseMove,(e:IMousePoint)=>{
            pointLight.pos.setXY(e.screenX,e.screenY);
            dirLight.pos.set(pointLight.pos);
        });
        spr.addBehaviour(new DraggableBehaviour(this.game));


    }

}

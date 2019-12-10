import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {LightSet} from "@engine/light/lightSet";
import {LightFilter} from "@engine/renderer/webGl/filters/light/lightFilter";
import {PointLight} from "@engine/light/impl/pointLight";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IMousePoint} from "@engine/control/mouse/mousePoint";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image";
import {DirectionalLight} from "@engine/light/impl/directionalLight";
import {ITexture} from "@engine/renderer/common/texture";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {DrawingSurface} from "@engine/renderable/impl/general/drawingSurface";

export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;
    private normalMapLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('./lightNormalMap/ship.png');
        this.normalMapLink = this.resourceLoader.loadImage('./lightNormalMap/shipNormal.png');

    }

    public onReady() {
        this.colorBG = Color.BLACK;
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);

        const pointLight:PointLight = new PointLight(this.game);
        pointLight.nearRadius = 90;
        pointLight.farRadius = 120;
        pointLight.pos.setXY(50,50);
        pointLight.color.setRGB(255,255,255);

        const lightSet:LightSet = new LightSet(this.game);
        lightSet.addPointLight(pointLight);
        lightSet.ambientLight.color.setRGB(210,210,210);
        lightSet.ambientLight.intensity = 0.9;

        const surf:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        const sprNormal:Image = new Image(this.game);
        sprNormal.setResourceLink(this.normalMapLink);
        sprNormal.pos.fromJSON({x:10,y:10});
        surf.drawModel(sprNormal);

        const lightFilter:LightFilter = new LightFilter(this.game,lightSet);
        lightFilter.setNormalMap(surf.getResourceLink().getTarget() as Texture);


        spr.filters = [lightFilter];

        this.on(MOUSE_EVENTS.mouseMove,(e:IMousePoint)=>{
            pointLight.pos.setXY(e.screenX,e.screenY);
        });
        spr.addBehaviour(new DraggableBehaviour(this.game));


    }

}

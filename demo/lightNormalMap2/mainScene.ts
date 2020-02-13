import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {LightSet} from "@engine/light/lightSet";
import {LightFilter} from "@engine/renderer/webGl/filters/light/lightFilter";
import {PointLight} from "@engine/light/impl/pointLight";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ISceneMousePoint} from "@engine/control/mouse/mousePoint";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {DrawingSurface} from "@engine/renderable/impl/general/drawingSurface";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";

export class MainScene extends Scene {

    private normalMapLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.normalMapLink = this.resourceLoader.loadTexture('./lightNormalMap2/coin1.jpg');
    }

    public onReady() {

        const pointLight:PointLight = new PointLight(this.game);
        pointLight.nearRadius = 290;
        pointLight.farRadius = 1220;
        pointLight.pos.setXY(50,50);
        pointLight.color.setRGB(255,255,200);

        const lightSet:LightSet = new LightSet(this.game);
        lightSet.addPointLight(pointLight);
        lightSet.ambientLight.color.setRGB(12,12,50);
        lightSet.ambientLight.intensity = 0.9;

        const surf:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        const sprNormal:Image = new Image(this.game);
        sprNormal.setResourceLink(this.normalMapLink);
        surf.drawModel(sprNormal);

        const lightFilter:LightFilter = new LightFilter(this.game,lightSet);
        lightFilter.setNormalMap(surf.getResourceLink().getTarget() as Texture);


        const rect:Rectangle = new Rectangle(this.game);
        rect.size.set(this.game.size);
        (rect.fillColor as Color).setRGB(244,122,2);
        rect.filters = [lightFilter];

        this.on(MOUSE_EVENTS.mouseMove,(e:ISceneMousePoint)=>{
            pointLight.pos.setXY(e.screenX,e.screenY);
        });
        this.appendChild(rect);


    }

}
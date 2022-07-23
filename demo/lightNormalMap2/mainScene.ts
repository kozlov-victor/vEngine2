import {Scene} from "@engine/scene/scene";
import {LightSet} from "@engine/lighting/lightSet";
import {LightFilter} from "@engine/renderer/webGl/filters/light/lightFilter";
import {PointLight} from "@engine/lighting/impl/pointLight";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ISceneMouseEvent} from "@engine/control/mouse/mousePoint";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {TaskQueue} from "@engine/resources/taskQueue";

export class MainScene extends Scene {

    private normalMapLink:ITexture;

    public override onPreloading(taskQueue:TaskQueue):void {
        taskQueue.addNextTask(async progress=>{
            this.normalMapLink = await taskQueue.getLoader().loadTexture('./lightNormalMap2/coin1.jpg');
        });
    }

    public override onReady():void {

        const pointLight:PointLight = new PointLight(this.game);
        pointLight.nearRadius = 290;
        pointLight.farRadius = 1220;
        pointLight.pos.setXY(50,50);
        pointLight.color.setRGB(255,255,200);
        pointLight.appendTo(this);

        const lightSet:LightSet = new LightSet(this.game,[pointLight]);
        lightSet.ambientLight.color.setRGB(12,12,50);
        lightSet.ambientLight.intensity = 0.9;

        const surf:DrawingSurface = new DrawingSurface(this.game,this.game.size);
        const sprNormal:Image = new Image(this.game,this.normalMapLink);
        surf.drawModel(sprNormal);

        const lightFilter:LightFilter = new LightFilter(this.game,lightSet);
        lightFilter.setNormalMap(surf.getTexture());


        const rect:Rectangle = new Rectangle(this.game);
        rect.size.setFrom(this.game.size);
        rect.fillColor.setRGB(244,122,2);
        rect.filters = [lightFilter];

        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e:ISceneMouseEvent)=>{
            pointLight.pos.setXY(e.screenX,e.screenY);
        });
        this.appendChild(rect);


    }

}

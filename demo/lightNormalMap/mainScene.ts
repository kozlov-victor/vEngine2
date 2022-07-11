import {Scene} from "@engine/scene/scene";
import {LightSet} from "@engine/lighting/lightSet";
import {LightFilter} from "@engine/renderer/webGl/filters/light/lightFilter";
import {PointLight} from "@engine/lighting/impl/pointLight";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ISceneMouseEvent} from "@engine/control/mouse/mousePoint";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {TaskQueue} from "@engine/resources/taskQueue";

export class MainScene extends Scene {

    private logoLink:ITexture;
    private normalMapLink:ITexture;

    public override onPreloading(taskQueue:TaskQueue):void {

        taskQueue.addNextTask(async process=>{
            this.logoLink = await taskQueue.getLoader().loadTexture('./lightNormalMap/rocks.png',process);
        });
        taskQueue.addNextTask(async process=>{
            this.normalMapLink = await taskQueue.getLoader().loadTexture('./lightNormalMap/rocks-normal.png',process);
        });
    }

    public override onReady():void {
        this.backgroundColor = Color.BLACK;
        const spr:Image = new Image(this.game,this.logoLink);
        spr.pos.setXY(10,10);
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
        const sprNormal:Image = new Image(this.game,this.normalMapLink);
        sprNormal.pos.setXY(10,10);
        surf.drawModel(sprNormal);

        const lightFilter:LightFilter = new LightFilter(this.game,lightSet);
        lightFilter.setNormalMap(surf.getTexture());


        spr.filters = [lightFilter];

        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e:ISceneMouseEvent)=>{
            pointLight.pos.setXY(e.screenX,e.screenY);
        });


    }

}

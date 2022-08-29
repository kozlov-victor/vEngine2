import {Scene} from "@engine/scene/scene";
import {LightSet} from "@engine/lighting/lightSet";
import {LightFilter} from "@engine/renderer/webGl/filters/light/lightFilter";
import {PointLight} from "@engine/lighting/impl/pointLight";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ISceneMouseEvent} from "@engine/control/mouse/mousePoint";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image/image";
import {DirectionalLight} from "@engine/lighting/impl/directionalLight";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    @Resource.Texture('./assets/logo.png')
    public readonly logoLink:ITexture;

    public override onReady():void {
        this.camera.scale.setXY(0.6);
        this.camera.pos.setXY(-5);

        this.backgroundColor = Color.BLACK;
        const spr:Image = new Image(this.game,this.logoLink);
        spr.pos.fromJSON({x:10,y:10});
        this.appendChild(spr);

        const pointLight:PointLight = new PointLight(this.game);
        pointLight.nearRadius = 10;
        pointLight.farRadius = 120;
        pointLight.pos.setXY(50,50);
        pointLight.color.setRGB(200,200,100);
        pointLight.appendTo(this);

        const dirLight = new DirectionalLight(this.game);
        dirLight.nearRadius = 20;
        dirLight.farRadius = 100;
        dirLight.pos.setXY(100,100);
        dirLight.direction.setXY(-1,0);
        dirLight.color.setRGB(100,0,0);
        dirLight.appendTo(this);

        const lightSet:LightSet = new LightSet(this.game,[pointLight,dirLight]);
        lightSet.ambientLight.color.setRGB(10,10,10);
        lightSet.ambientLight.intensity = 0.1;

        const lightFilter:LightFilter = new LightFilter(this.game,lightSet);

        this.filters = [lightFilter];
        spr.filters = [lightFilter];

        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e:ISceneMouseEvent)=>{
            pointLight.pos.setXY(e.sceneX,e.sceneY);
            dirLight.pos.setFrom(pointLight.pos);
        });
        spr.addBehaviour(new DraggableBehaviour(this.game));


    }

}

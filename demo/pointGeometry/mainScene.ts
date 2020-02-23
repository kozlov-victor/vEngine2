import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image";
import {Vec2} from "@engine/geometry/vec2";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ISceneMousePoint} from "@engine/control/mouse/mousePoint";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export class MainScene extends Scene {

    private ship:RenderableModel;


    public onPreloading() {
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.resourceLoader.loadTexture('./pointGeometry/ship.png'));
        this.ship = spr;
    }



    public onReady() {
        this.colorBG.setRGB(244,244,244);
        this.ship.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        this.appendChild(this.ship);
        this.ship.anchorPoint.setXY(this.ship.size.width/2,this.ship.size.height/2);
        this.ship.transformPoint.set(this.ship.anchorPoint);
        const center:Vec2 = new Vec2().set(this.ship.pos);
        const point:Vec2 = new Vec2();
        this.on(MOUSE_EVENTS.mouseMove,(p:ISceneMousePoint)=>{
            point.setXY(p.screenX,p.screenY);
            console.log(point.toJSON());
            this.ship.angle = center.getAngleTo(point);
        });

    }

}

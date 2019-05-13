import {Scene} from "@engine/model/impl/scene";
import {GameObject} from "@engine/model/impl/gameObject";
import {Image} from "@engine/model/impl/ui/drawable/image";
import {Vec2} from "@engine/geometry/vec2";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MousePoint} from "@engine/control/mouse/mousePoint";

export class MainScene extends Scene {

    private ship:GameObject;


    onPreloading() {
        this.ship = new GameObject(this.game);
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.resourceLoader.loadImage('ship.png'));
        this.ship.sprite = spr;
    }



    onReady() {
        this.ship.pos.setXY(this.game.width/2,this.game.height/2);
        this.appendChild(this.ship);
        this.ship.anchor.setXY(this.ship.size.width/2,this.ship.size.height/2);
        this.ship.rotationPoint.set(this.ship.anchor);
        const center:Vec2 = new Vec2().set(this.ship.pos);
        const point:Vec2 = new Vec2();
        this.on(MOUSE_EVENTS.mouseMove,(p:MousePoint)=>{
            point.setXY(p.screenX,p.screenY);
            console.log(point.toJSON());
            const angle:number = center.getAngleTo(point);
            this.ship.angle = angle;
        })

    }

}

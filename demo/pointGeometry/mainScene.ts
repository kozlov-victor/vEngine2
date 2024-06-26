import {Scene} from "@engine/scene/scene";
import {Image} from "@engine/renderable/impl/general/image/image";
import {Vec2} from "@engine/geometry/vec2";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ISceneMouseEvent} from "@engine/control/mouse/mousePoint";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    private ship:RenderableModel;

    @Resource.Texture('./pointGeometry/ship.png')
    public readonly link:ITexture;


    public override onReady():void {

        this.ship = new Image(this.game, this.link);

        this.backgroundColor.setRGB(244,244,244);
        this.ship.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        this.appendChild(this.ship);
        this.ship.anchorPoint.setXY(this.ship.size.width/2,this.ship.size.height/2);
        this.ship.transformPoint.setFrom(this.ship.anchorPoint);
        const center:Vec2 = new Vec2(this.ship.pos.x,this.ship.pos.y);
        const point:Vec2 = new Vec2(0,0);
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(p:ISceneMouseEvent)=>{
            point.x = p.screenX;
            point.y = p.screenY;
            console.log(point);
            this.ship.angle = Vec2.angleTo(center,point);
        });

    }

}

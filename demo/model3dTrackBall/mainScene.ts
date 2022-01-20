import {Scene} from "@engine/scene/scene";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {Int, Optional} from "@engine/core/declarations";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Torus} from "@engine/renderer/webGl/primitives/torus";

export class MainScene extends Scene {

    public override onReady():void {

        const obj:Model3d = new Model3d(this.game,new Torus(12,50, 3 as Int,8 as Int));
        obj.material.diffuseColor.setRGB(222,22,12);
        obj.material.diffuseColorMix = 0.5;
        obj.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        obj.size.setWH(100,100);
        this.appendChild(obj);


        let lastPoint:Optional<{x:number,y:number}>;
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove, (e)=>{
            if (!e.isMouseDown) return;
            if (lastPoint===undefined) lastPoint = {x:e.sceneX,y:e.screenY};
            const offsetX:number = e.sceneX - lastPoint.x;
            const offsetY:number = e.sceneY - lastPoint.y;
            const factor = 1.4;
            obj.angle3d.x-=offsetY/this.game.size.width*factor;
            obj.angle3d.y+=offsetX/this.game.size.height*factor;
            lastPoint.x = e.sceneX;
            lastPoint.y = e.sceneY;
        });
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseUp, _=>{
            lastPoint = undefined;
        });
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseLeave, _=>{
            lastPoint = undefined;
        });
    }

}

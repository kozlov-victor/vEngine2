import {Scene} from "@engine/scene/scene";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {Int, Optional} from "@engine/core/declarations";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Torus} from "@engine/renderer/webGl/primitives/torus";

export class MainScene extends Scene {



    public onPreloading() {

    }



    public onReady() {

        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(222,22,12);
        obj.colorMix = 0.5;
        obj.modelPrimitive = new Torus(12,50, 3 as Int,8 as Int);
        obj.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        obj.size.setWH(100,100);
        this.appendChild(obj);


        let lastPoint:Optional<{x:number,y:number}>;
        this.on(MOUSE_EVENTS.mouseMove, (e)=>{
            if (!e.isMouseDown) return;
            if (lastPoint===undefined) lastPoint = {x:e.sceneX,y:e.screenY};
            const offsetX:number = e.sceneX - lastPoint.x;
            const offsetY:number = e.sceneY - lastPoint.y;
            obj.angle3d.x-=offsetY/this.game.size.width;
            obj.angle3d.y+=offsetX/this.game.size.height;
            lastPoint.x = e.sceneX;
            lastPoint.y = e.sceneY;
        });
        this.on(MOUSE_EVENTS.mouseUp, (e)=>{
            lastPoint = undefined;
        });
        this.on(MOUSE_EVENTS.mouseLeave, (e)=>{
            lastPoint = undefined;
        });
    }

}

import {Scene} from "@engine/scene/scene";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {TrackBall} from "../model3dFromFbx/trackBall";
import {Knot} from "@engine/renderer/webGl/primitives/knot";

export class MainScene extends Scene {


    @Resource.Texture('./model3d/Texture-67.jpg')
    private texture:ITexture;


    public override onReady():void {
        const obj:Model3d = new Model3d(this.game,new Knot(200, 50));
        obj.material.diffuseColor.setRGB(12,222,12);
        obj.material.diffuseColorMix = 0.1;
        obj.texture = this.texture;
        obj.pos.setXY(200,100);
        obj.size.setWH(100,100);
        this.appendChild(obj);

        const timer = this.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },20);
        this.mouseEventHandler.once(MOUSE_EVENTS.click, _=>{
            timer.kill();
            new TrackBall(this,obj);
        });
    }

}

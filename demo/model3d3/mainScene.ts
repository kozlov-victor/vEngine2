import {Scene} from "@engine/scene/scene";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {TrackBall} from "../model3dFromFbx/trackBall";
import {Knot} from "@engine/renderer/webGl/primitives/knot";
import {DRAW_METHOD} from "@engine/renderer/webGl/base/bufferInfo";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";

export class MainScene extends Scene {


    @Resource.Texture('./model3d/Texture-67.jpg')
    public readonly texture:ITexture;


    public override onReady():void {

        const container = new SimpleGameObjectContainer(this.game);
        container.appendTo(this);

        const obj:Model3d = new Model3d(this.game,new Knot(200,50));
        obj.material.diffuseColor.setRGB(12,222,12);
        obj.material.diffuseColorMix = 0.1;
        obj.texture = this.texture;
        obj.pos.setXYZ(200,100, -100);
        obj.size.setWH(100,100);
        obj.appendTo(container);

        const wire = new Knot(200,55);
        wire.drawMethod = DRAW_METHOD.LINES;
        const copy:Model3d = new Model3d(this.game,wire);
        copy.material.diffuseColor.setRGB(255,0,0);
        copy.material.diffuseColorMix = 1;
        copy.pos.setFrom(obj.pos);
        copy.size.setFrom(obj.size);
        copy.appendTo(container);

        const timer = this.setInterval(()=>{
            container.angle3d.x+=0.01;
            container.angle3d.y+=0.01;
        },20);
        this.mouseEventHandler.once(MOUSE_EVENTS.click, _=>{
            timer.kill();
            new TrackBall(this,container);
        });
    }

}

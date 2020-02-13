import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Mesh} from "@engine/renderable/abstract/mesh";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {ITexture} from "@engine/renderer/common/texture";
import {Torus} from "@engine/renderer/webGl/primitives/torus";
import {Int} from "@engine/core/declarations";

export class MainScene extends Scene {

    private logoObj:Mesh;
    private logoLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadTexture('./assets/repeat.jpg');
    }



    public onReady() {
        const obj:Model3d = new Model3d(this.game);
        this.logoObj = obj;
        obj.fillColor.setRGB(12,222,12);
        obj.colorMix = 0.7;
        obj.modelPrimitive = new Torus(12,50, 3 as Int,8 as Int);
        obj.texture = this.logoLink.getTarget();
        obj.pos.setXY(200,100);
        obj.size.setWH(100,100);
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },20);
    }

}
import {Scene} from "@engine/scene/scene";
import {Mesh2d} from "@engine/renderable/abstract/mesh2d";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {ITexture} from "@engine/renderer/common/texture";
import {Torus} from "@engine/renderer/webGl/primitives/torus";
import {Int} from "@engine/core/declarations";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    private logoObj:Mesh2d;

    @Resource.Texture('./assets/repeat.jpg')
    public readonly logoLink:ITexture;


    public override onReady():void {
        const obj:Model3d = new Model3d(this.game,new Torus(12,50, 3 as Int,8 as Int));
        this.logoObj = obj;
        obj.material.diffuseColor.setRGB(12,222,12);
        obj.material.diffuseColorMix = 0.7;
        obj.texture = this.logoLink;
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

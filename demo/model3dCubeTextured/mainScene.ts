import {Scene} from "@engine/scene/scene";
import {Cube} from "@engine/renderer/webGl/primitives/cube";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    @Resource.Texture('./model3dCubeTextured/logo.png')
    private logoLink:ITexture;


    public override onReady():void {

        const obj:Model3d = new Model3d(this.game,new Cube(150));
        obj.fillColor.setRGB(12,22,122);
        obj.texture = this.logoLink;
        obj.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        this.appendChild(obj);
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },20);

    }

}

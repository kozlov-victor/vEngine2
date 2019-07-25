import {Scene} from "@engine/model/impl/general/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {Cube} from "@engine/renderer/webGl/primitives/cube";
import {Model3d} from "@engine/model/impl/general/model3d";

export class MainScene extends Scene {

    private logoLink:ResourceLink<Texture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('./model3dCubeTextured/logo.png');
    }


    public onReady() {

        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(12,22,122);
        obj.modelPrimitive = new Cube(150);
        obj.texture = this.logoLink.getTarget();
        obj.pos.setXY(this.game.width/2,this.game.height/2);
        this.appendChild(obj);
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },20);



    }

}

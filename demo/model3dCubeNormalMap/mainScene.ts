import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Cube} from "@engine/renderer/webGl/primitives/cube";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {ITexture} from "@engine/renderer/texture";

export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;
    private normalsLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('./model3dCubeNormalMap/wood.png');
        this.normalsLink = this.resourceLoader.loadImage('./model3dCubeNormalMap/wood_normal.png');
    }


    public onReady() {

        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(255,255,255);
        obj.modelPrimitive = new Cube(150);
        obj.texture = this.logoLink.getTarget();
        obj.normalsTexture = this.normalsLink.getTarget();
        obj.pos.setXY(this.game.width/2,this.game.height/2);
        this.appendChild(obj);
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },20);



    }

}

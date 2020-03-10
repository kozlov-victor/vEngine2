import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Cube} from "@engine/renderer/webGl/primitives/cube";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Source} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    @Source.Texture('./assets/repeat.jpg')
    private baseTextureLink:ResourceLink<ITexture>;

    @Source.CubeTexture(
        './cubeMapTexture/textures/cm_left.jpg',
        './cubeMapTexture/textures/cm_right.jpg',
        './cubeMapTexture/textures/cm_top.jpg',
        './cubeMapTexture/textures/cm_bottom.jpg',
        './cubeMapTexture/textures/cm_front.jpg',
        './cubeMapTexture/textures/cm_back.jpg'
    )
    private cubeTextureLink:ResourceLink<ICubeMapTexture>;


    public onReady() {

        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(12,22,122);
        obj.modelPrimitive = new Cube(150);
        obj.texture = this.baseTextureLink.getTarget();
        obj.colorMix = 0.4;
        obj.cubeMapTexture = this.cubeTextureLink.getTarget();
        obj.reflectivity = 0.9;
        obj.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        this.appendChild(obj);
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },20);


    }

}

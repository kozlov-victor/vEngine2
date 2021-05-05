import {Scene} from "@engine/scene/scene";
import {Cube} from "@engine/renderer/webGl/primitives/cube";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    @Resource.Texture('./assets/repeat.jpg')
    private baseTextureLink:ITexture;

    @Resource.CubeTexture(
        './cubeMapTexture/textures/cm_left.jpg',
        './cubeMapTexture/textures/cm_right.jpg',
        './cubeMapTexture/textures/cm_top.jpg',
        './cubeMapTexture/textures/cm_bottom.jpg',
        './cubeMapTexture/textures/cm_front.jpg',
        './cubeMapTexture/textures/cm_back.jpg'
    )
    private cubeTextureLink:ICubeMapTexture;


    public onReady():void {

        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(12,22,122);
        obj.modelPrimitive = new Cube(150);
        obj.texture = this.baseTextureLink;
        obj.colorMix = 0.4;
        obj.cubeMapTexture = this.cubeTextureLink;
        obj.reflectivity = 0.9;
        obj.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        this.appendChild(obj);
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },20);


    }

}

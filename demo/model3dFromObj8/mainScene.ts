import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {ICubeMapTexture} from "@engine/renderer/common/texture";
import {ObjParser} from "../model3dFromObj/objParser";


export class MainScene extends Scene {

    private data1Link:ResourceLink<string>;
    private cubeTextureLink:ResourceLink<ICubeMapTexture>;


    public onPreloading() {
        this.data1Link = this.resourceLoader.loadText('./model3dFromObj8/test.obj');
        this.cubeTextureLink = this.resourceLoader.loadCubeTexture(
            './cubeMapTexture/textures/cm_left.jpg',
            './cubeMapTexture/textures/cm_right.jpg',
            './cubeMapTexture/textures/cm_top.jpg',
            './cubeMapTexture/textures/cm_bottom.jpg',
            './cubeMapTexture/textures/cm_front.jpg',
            './cubeMapTexture/textures/cm_back.jpg',
        );

    }


    public onReady() {

        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(122,255,255);
        obj.modelPrimitive = new ObjParser().parse(this.data1Link.getTarget() as string);
        obj.pos.setXY(200,250);
        obj.cubeMapTexture = this.cubeTextureLink.getTarget();
        obj.reflectivity = 0.03;
        obj.size.setWH(200,200);
        obj.scale.setXY(2,2);
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.z-=0.01;
        },20);


    }

}

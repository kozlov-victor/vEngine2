import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {ITexture} from "@engine/renderer/common/texture";
import {ObjParser} from "../model3dFromObj/objParser";


export class MainScene extends Scene {

    private data1Link:ResourceLink<string>;


    private dataTextureLink:ResourceLink<ITexture>;

    public onPreloading():void {
        this.data1Link = this.resourceLoader.loadText('./model3dFromObj6/tiger.x.obj');
        this.dataTextureLink = this.resourceLoader.loadTexture('./model3dFromObj6/tiger.png');
    }


    public onReady():void {

        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(255,255,255);
        obj.modelPrimitive = new ObjParser().parse(this.data1Link.getTarget() as string);
        obj.texture = this.dataTextureLink.getTarget();
        obj.pos.setXY(200,250);
        obj.size.setWH(200,200);
        obj.scale.setXYZ(320);
        this.appendChild(obj);
        //obj.acceptLight(false);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            // obj.angle3d.x+=0.01;
            obj.angle3d.y-=0.01;
        },20);


    }

}

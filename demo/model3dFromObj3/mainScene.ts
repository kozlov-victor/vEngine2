import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {ITexture} from "@engine/renderer/texture";
import {ObjParser} from "../model3dFromObj/objParser";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";


export class MainScene extends Scene {

    private data1Link:ResourceLink<string>;

    private dataTextureLink:ResourceLink<ITexture>;
    private dataTextureNormalLink:ResourceLink<ITexture>;

    public onPreloading() {
        // https://free3d.com/ru/3d-models/obj
        this.data1Link = this.resourceLoader.loadText('./model3dFromObj3/earth.obj');
        this.dataTextureLink = this.resourceLoader.loadImage('./model3dFromObj3/earth.jpg');
        this.dataTextureNormalLink = this.resourceLoader.loadImage('./model3dFromObj3/earth_normal.jpg');
    }


    public onReady() {

        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(255,255,255);
        obj.modelPrimitive = new ObjParser().parse(this.data1Link.getTarget() as string);
        obj.pos.setXY(200,250);
        obj.size.setWH(200,200);
        obj.scale.setXY(1);
        obj.texture = this.dataTextureLink.getTarget();
        obj.normalsTexture = this.dataTextureLink.getTarget();
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj.angle3d.y-=0.005;
        },20);


    }

}

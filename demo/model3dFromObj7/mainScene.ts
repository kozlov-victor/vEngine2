import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {ITexture} from "@engine/renderer/common/texture";
import {ObjParser} from "../model3dFromObj/objParser";
import {Resource} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {

    @Resource.Text('./model3dFromObj7/mushroom_tube_A.obj')
    private data1Link:string;

    @Resource.Texture('./model3dFromObj7/mushroom_tube_tex.png')
    private dataTextureLink:ITexture;

    // //https://www.reinerstilesets.de/graphics/3d-grafiken/3d-plants/
    @Resource.Texture('./model3dFromObj7/mushroom_tube_NM.png')
    private dataTextureNormalLink:ITexture;

    public onReady():void {

        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(255,255,255);
        obj.modelPrimitive = new ObjParser().parse(this.data1Link);
        obj.pos.setXY(200,250);
        obj.size.setWH(200,200);
        obj.scale.setXYZ(60);
        obj.texture = this.dataTextureLink;
        obj.normalsTexture = this.dataTextureNormalLink;
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            //obj.angle3d.x+=0.01;
            obj.angle3d.y-=0.01;
        },20);


    }

}

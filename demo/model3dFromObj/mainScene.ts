import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {ObjParser} from "./objParser";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";


export class MainScene extends Scene {


    @Resource.Text('./model3dFromObj/cow-nonormals.obj')
    private data1Link:string;

    @Resource.Text('./model3dFromObj/cube_texture2.obj')
    private data2Link:string;

    @Resource.Text('./model3dFromObj/diamond.obj')
    private data3Link:string;

    @Resource.Texture('./assets/repeat.jpg')
    private dataTextureLink:ITexture;


    public onReady():void {

        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(255,255,255);
        obj.modelPrimitive = new ObjParser().parse(this.data1Link);
        obj.pos.setXY(200,250);
        obj.size.setWH(200,200);
        obj.scale.setXYZ(60);
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj.angle3d.y-=0.01;
        },20);


        const obj3:Model3d = new Model3d(this.game);
        obj3.fillColor.setRGB(100,250,100);
        obj3.modelPrimitive = new ObjParser().parse(this.data3Link);
        obj3.pos.setXY(300,350);
        obj3.size.setWH(200,200);
        this.appendChild(obj3);
        obj3.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj3.angle3d.x+=0.01;
            obj3.angle3d.y-=0.01;
        },20);
        obj3.scale.setXYZ(225);

        const obj2:Model3d = new Model3d(this.game);
        obj2.fillColor.setRGB(22,122,122);
        obj2.modelPrimitive = new ObjParser().parse(this.data2Link);
        obj2.texture = this.dataTextureLink;
        obj2.pos.setXY(570,260);
        obj2.size.setWH(200,200);
        obj2.scale.setXYZ(60);
        this.appendChild(obj2);
        obj2.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj2.angle3d.x+=0.01;
            obj2.angle3d.y-=0.01;
        },20);

    }

}

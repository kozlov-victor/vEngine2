import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";


export class MainScene extends Scene {


    @Resource.Text('./model3dFromObj/cow-nonormals.obj')
    public readonly data1:string;

    @Resource.Text('./model3dFromObj/cube_texture2.obj')
    public readonly data2:string;

    @Resource.Text('./model3dFromObj/diamond.obj')
    public readonly data3:string;

    @Resource.Texture('./assets/repeat.jpg')
    public readonly dataTextureLink:ITexture;


    public override onReady():void {

        const obj = new ObjParser().parse(this.game,{
            meshData: this.data1
        });
        obj.pos.setXY(200,250);
        obj.size.setWH(200,200);
        obj.scale.setXYZ(60);
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj.angle3d.y-=0.01;
        },20);


        const obj3 = new ObjParser().parse(this.game,{
            meshData: this.data3
        });
        obj3.pos.setXY(300,350);
        obj3.size.setWH(200,200);
        this.appendChild(obj3);
        obj3.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj3.angle3d.x+=0.01;
            obj3.angle3d.y-=0.01;
        },20);
        obj3.scale.setXYZ(225);


        const obj2 = new ObjParser().parse(this.game,{
            meshData: this.data2,
            texture: this.dataTextureLink
        });
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

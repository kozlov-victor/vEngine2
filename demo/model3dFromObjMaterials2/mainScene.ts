import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {ITexture} from "@engine/renderer/common/texture";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {TrackBall} from "../model3dFromFbx/trackBall";
import {Model3d} from "@engine/renderable/impl/3d/model3d";


export class MainScene extends Scene {

    @Resource.Text('./model3dFromObjMaterials2/windmill/windmill.obj')
    public readonly meshData:string;

    @Resource.Text('./model3dFromObjMaterials2/windmill/windmill.mtl')
    public readonly materialData:string;

    @Resource.Texture('./model3dFromObjMaterials2/windmill/windmill.jpg')
    public readonly texture:ITexture;

    @Resource.Texture('./model3dFromObjMaterials2/windmill/windmill_normals.jpg')
    public readonly normalsTexture:ITexture;

    @Resource.Texture('./model3dFromObjMaterials2/windmill/windmill_wings.jpg')
    public readonly wingsTexture:ITexture;

    @Resource.Texture('./model3dFromObjMaterials2/windmill/windmill_wings_normals.jpg')
    public readonly wingsNormalTexture:ITexture;

    public override onReady():void {

        const obj:SimpleGameObjectContainer = new ObjParser().parse(this.game,
            {
                meshData:this.meshData,
                materialsData:this.materialData,
                texture:this.texture,
                normalsTexture: this.normalsTexture,
            }
        );
        obj.pos.setXY(300,450);
        obj.size.setWH(200,200);
        obj.scale.setXYZ(40);

        const wheel = obj.getChildAt(0) as Model3d;
        wheel.texture = this.wingsTexture;
        wheel.normalsTexture = this.wingsNormalTexture;

        this.appendChild(obj);
        const timer = this.setInterval(()=>{
            obj.angle3d.y-=0.01;
        },20);
        this.mouseEventHandler.once(MOUSE_EVENTS.click, _=>{
            timer.kill();
            new TrackBall(this,obj);
        });

    }

}

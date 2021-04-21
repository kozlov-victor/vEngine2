import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {ITexture} from "@engine/renderer/common/texture";
import {ObjParser} from "../model3dFromObj/objParser";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Color} from "@engine/renderer/common/color";
import {Resource} from "@engine/resources/resourceDecorators";

// // https://free3d.com/ru/3d-models/obj
export class MainScene extends Scene {

    @Resource.Text('./model3dFromObj3/planet.obj')
    private data1Link:string;

    @Resource.Texture('./model3dFromObj3/earth.jpg')
    private dataTextureLink:ITexture;

    @Resource.Texture('./model3dFromObj3/earth_normal.jpg')
    private dataTextureNormalLink:ITexture;

    @Resource.Texture('./model3dFromObj3/earth_height.jpg')
    private dataTextureHeightLink:ITexture;

    public onReady():void {

        this.backgroundColor = Color.BLACK;
        document.body.style.backgroundColor = Color.RGB(200).asCssRgba();

        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(255,255,255);
        obj.modelPrimitive = new ObjParser().parse(this.data1Link);
        obj.pos.setXY(200,250);
        obj.size.setWH(200,200);
        obj.scale.setXYZ(1);
        obj.texture = this.dataTextureLink;
        obj.normalsTexture = this.dataTextureNormalLink;
        obj.heightMapTexture = this.dataTextureHeightLink;
        obj.heightMapFactor = 40;
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj.angle3d.y-=0.005;
        },20);

        let isNormalApplied:boolean = true;
        this.mouseEventHandler.on(MOUSE_EVENTS.click, ()=>{
            isNormalApplied = !isNormalApplied;
            console.log({isNormalApplied});
            if (isNormalApplied) obj.normalsTexture = this.dataTextureNormalLink;
            else obj.normalsTexture = undefined;
        });


    }

}

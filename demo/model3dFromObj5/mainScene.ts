import {Scene} from "@engine/scene/scene";
import {ITexture} from "@engine/renderer/common/texture";
import {Color} from "@engine/renderer/common/color";
import {Resource} from "@engine/resources/resourceDecorators";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {TrackBall} from "../model3dFromFbx/trackBall";

// https://free3d.com/ru/3d-models/obj
export class MainScene extends Scene {

    @Resource.Text('./model3dFromObj3/planet.obj')
    private data1:string;

    @Resource.Texture('./model3dFromObj5/moon.jpg')
    private texture:ITexture;

    @Resource.Texture('./model3dFromObj5/moon_normal.jpg')
    private textureNormal:ITexture;


    public override onReady():void {

        this.backgroundColor = Color.BLACK;
        document.body.style.backgroundColor = Color.RGB(200).asCssHex();

        const obj = new ObjParser().parse(this.game,{
            meshData: this.data1,
            texture: this.texture,
            normalsTexture: this.textureNormal
        });
        obj.pos.setXY(300,250);
        obj.size.setWH(200,200);
        obj.scale.setXYZ(1);
        this.appendChild(obj);
        new TrackBall(this,obj);

    }

}

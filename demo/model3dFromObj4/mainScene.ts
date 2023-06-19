import {Scene} from "@engine/scene/scene";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {Color} from "@engine/renderer/common/color";
import {Resource} from "@engine/resources/resourceDecorators";
import {ObjParser} from "@engine/renderable/impl/3d/objParser/objParser";
import {TrackBall} from "../model3dFromFbx/trackBall";
import {SkyBox} from "@engine/renderable/impl/skyBox";

// https://free3d.com/ru/3d-models/obj
export class MainScene extends Scene {

    @Resource.Text('./model3dFromObj3/planet.obj')
    public readonly data1:string;

    @Resource.Texture('./model3dFromObj4/mars.jpg')
    public readonly dataTexture:ITexture;

    @Resource.Texture('./model3dFromObj4/mars_normal.jpg')
    public readonly dataTextureNormal:ITexture;

    @Resource.CubeTexture(
        './model3dFromObj3/cube/right.png',
        './model3dFromObj3/cube/left.png',
        './model3dFromObj3/cube/top.png',
        './model3dFromObj3/cube/bottom.png',
        './model3dFromObj3/cube/back.png',
        './model3dFromObj3/cube/front.png',
    )
    public readonly cubeTexture:ICubeMapTexture;

    public override onReady():void {

        this.backgroundColor = Color.BLACK;
        document.body.style.backgroundColor = Color.RGB(200).asCssRgba();

        const obj = new ObjParser().parse(this.game,{
            meshData: this.data1,
            texture: this.dataTexture,
            normalsTexture: this.dataTextureNormal,
        });
        obj.pos.setXY(300,250);
        obj.size.setWH(200,200);
        obj.scale.setXYZ(1);
        this.appendChild(obj);
        new TrackBall(this,obj);

        const skyBox = new SkyBox(this.game,this.cubeTexture);
        skyBox.prependTo(this);
        obj.angle3d.observe(()=>{
            skyBox.angle3d.setXYZ(
                -obj.angle3d.x,
                -obj.angle3d.y,
                -obj.angle3d.z
            )
        });

    }

}

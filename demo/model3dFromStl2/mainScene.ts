import {Scene} from "@engine/scene/scene";
import {ICubeMapTexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {TrackBall} from "../model3dFromFbx/trackBall";
import {StlParser} from "@engine/renderable/impl/3d/stlParser/stlParser";


export class MainScene extends Scene {

    @Resource.Text('./model3dFromStl2/polymer.stl')
    public readonly data1:string;

    @Resource.CubeTexture(
        './model3dFromStl/textures/miramar_left.png',
        './model3dFromStl/textures/miramar_right.png',
        './model3dFromStl/textures/miramar_top.png',
        './model3dFromStl/textures/miramar_bottom.png',
        './model3dFromStl/textures/miramar_front.png',
        './model3dFromStl/textures/miramar_back.png',
    )
    public readonly cubeTexture:ICubeMapTexture;


    public override onReady():void {

        const obj = new StlParser().parse(this.game,{
            meshData: this.data1,
            cubeMapTexture: this.cubeTexture
        });
        obj.pos.setXY(200,250);
        this.appendChild(obj);
        const timer = this.setInterval(()=>{
            obj.angle3d.y+=0.01;
        },20);
        this.mouseEventHandler.once(MOUSE_EVENTS.click, _=>{
            timer.kill();
            new TrackBall(this,obj);
        });

    }

}

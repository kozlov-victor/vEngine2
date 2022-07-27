import {Scene} from "@engine/scene/scene";
import {ICubeMapTexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {TrackBall} from "../model3dFromFbx/trackBall";
import {StlParser} from "@engine/renderable/impl/3d/stlParser/stlParser";
import {SkyBox} from "@engine/renderable/impl/skyBox";
import {CubeMapTexture} from "@engine/renderer/webGl/base/cubeMapTexture";


export class MainScene extends Scene {

    @Resource.Binary('./model3dFromStl/keystone.stl')
    private data1:ArrayBuffer;

    @Resource.CubeTexture(
        './model3dFromStl/textures/miramar_right.png',
        './model3dFromStl/textures/miramar_left.png',
        './model3dFromStl/textures/miramar_top.png',
        './model3dFromStl/textures/miramar_bottom.png',
        './model3dFromStl/textures/miramar_front.png',
        './model3dFromStl/textures/miramar_back.png',
    )
    // @Resource.CubeTexture(
    //     './cubeMapTexture/textures/cm_left.jpg',
    //     './cubeMapTexture/textures/cm_right.jpg',
    //     './cubeMapTexture/textures/cm_top.jpg',
    //     './cubeMapTexture/textures/cm_bottom.jpg',
    //     './cubeMapTexture/textures/cm_front.jpg',
    //     './cubeMapTexture/textures/cm_back.jpg'
    // )
    // @Resource.CubeTexture(
    //     './model3dFromStl/textures2/pos-x.jpg',
    //     './model3dFromStl/textures2/neg-x.jpg',
    //     './model3dFromStl/textures2/pos-y.jpg',
    //     './model3dFromStl/textures2/neg-y.jpg',
    //     './model3dFromStl/textures2/neg-z.jpg',
    //     './model3dFromStl/textures2/pos-z.jpg'
    // )
    private cubeTexture:CubeMapTexture;


    public override onReady():void {

        const skyBox = new SkyBox(this.game,this.cubeTexture);
        skyBox.appendTo(this);

        const obj = new StlParser().parse(this.game,{
            meshData: this.data1,
            cubeMapTexture: this.cubeTexture
        });
        obj.pos.setXY(200,250);
        obj.material.reflectivity = 0.8;
        obj.angle3d.observe(()=>{
            skyBox.angle3d.setXYZ(
                -obj.angle3d.x,
                -obj.angle3d.y,
                -obj.angle3d.z
            )
        });

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

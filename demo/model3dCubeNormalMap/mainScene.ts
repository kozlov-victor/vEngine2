import {Scene} from "@engine/scene/scene";
import {Cube} from "@engine/renderer/webGl/primitives/cube";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {ITexture} from "@engine/renderer/common/texture";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {


    @Resource.Texture('./model3dCubeNormalMap/wood.png')
    private logoLink:ITexture;

    @Resource.Texture('./model3dCubeNormalMap/wood_normal.png')
    private normalsLink:ITexture;

    public onReady():void {

        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(255,255,255);
        obj.modelPrimitive = new Cube(150);
        obj.texture = this.logoLink;
        obj.normalsTexture = this.normalsLink;
        obj.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        this.appendChild(obj);
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },20);

        let isNormalApplied:boolean = true;
        this.on(MOUSE_EVENTS.click, ()=>{
            isNormalApplied = !isNormalApplied;
            console.log({isNormalApplied});
            if (isNormalApplied) obj.normalsTexture = this.normalsLink;
            else obj.normalsTexture = undefined;
        });




    }

}

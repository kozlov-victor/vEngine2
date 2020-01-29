import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Cube} from "@engine/renderer/webGl/primitives/cube";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {ITexture} from "@engine/renderer/common/texture";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;
    private normalsLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadTexture('./model3dCubeNormalMap/wood.png');
        this.normalsLink = this.resourceLoader.loadTexture('./model3dCubeNormalMap/wood_normal.png');
    }


    public onReady() {

        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(255,255,255);
        obj.modelPrimitive = new Cube(150);
        obj.texture = this.logoLink.getTarget();
        obj.normalsTexture = this.normalsLink.getTarget();
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
            if (isNormalApplied) obj.normalsTexture = this.normalsLink.getTarget();
            else obj.normalsTexture = undefined;
        });




    }

}

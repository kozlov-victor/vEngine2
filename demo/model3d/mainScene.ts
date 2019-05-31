import {Scene} from "@engine/model/impl/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Texture} from "@engine/renderer/webGl/base/texture";
import {GameObject3d} from "@engine/model/impl/gameObject3d";
import {Cube} from "@engine/renderer/webGl/primitives/cube";
import {Sphere} from "@engine/renderer/webGl/primitives/sphere";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Cylinder} from "@engine/renderer/webGl/primitives/cylinder";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";

export class MainScene extends Scene {

    private logoObj:GameObject3d;
    private logoLink:ResourceLink<Texture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadImage('../assets/repeat.jpg');

    }



    public onReady() {
        const obj:GameObject3d = new GameObject3d(this.game);
        this.logoObj = obj;
        obj.color.setRGB(12,222,12);
        // obj.model = new Cube(100);
        // obj.model = new Sphere(100,3);
        obj.model = new Cylinder();
        obj.texture = this.logoLink.getTarget();
        obj.pos.setXY(100,100);
        obj.size.setWH(100,100);
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },20);


        const obj2:GameObject3d = new GameObject3d(this.game);
        obj2.color.setRGB(12,22,122);
        obj2.model = new Cube(10);
        // obj.model = new Sphere(100,3);
        // obj.model = new Cylinder();
        obj2.texture = this.logoLink.getTarget();
        obj2.pos.setXY(120,120);
        obj2.size.setWH(100,100);
        this.appendChild(obj2);
        obj2.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj2.angle3d.x+=0.01;
            obj2.angle3d.y+=0.01;
        },20);



    }

}

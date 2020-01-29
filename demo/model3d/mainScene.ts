import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Mesh} from "@engine/renderable/abstract/mesh";
import {Cube} from "@engine/renderer/webGl/primitives/cube";
import {Sphere} from "@engine/renderer/webGl/primitives/sphere";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Cylinder} from "@engine/renderer/webGl/primitives/cylinder";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {Cone} from "@engine/renderer/webGl/primitives/cone";
import {ITexture} from "@engine/renderer/common/texture";

export class MainScene extends Scene {

    private logoObj:Mesh;
    private logoLink:ResourceLink<ITexture>;
    private logo2Link:ResourceLink<ITexture>;
    private logoNormalsLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.logoLink = this.resourceLoader.loadTexture('./assets/repeat.jpg');
        this.logo2Link = this.resourceLoader.loadTexture('./model3d/Texture-67.jpg');
        this.logoNormalsLink = this.resourceLoader.loadTexture('./model3d/normals.png');
    }



    public onReady() {
        const obj:Model3d = new Model3d(this.game);
        this.logoObj = obj;
        obj.fillColor.setRGB(12,222,12);
        obj.colorMix = 0.6;
        obj.modelPrimitive = new Cylinder(50,100);
        obj.texture = this.logoLink.getTarget();
        obj.pos.setXY(200,100);
        obj.size.setWH(100,100);
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },20);


        const obj2:Model3d = new Model3d(this.game);
        obj2.fillColor.setRGB(12,22,122);
        obj2.modelPrimitive = new Cube(50);
        // obj.modelPrimitive = new Sphere(100,3);
        // obj.modelPrimitive = new Cylinder();
        obj2.texture = this.logo2Link.getTarget();
        obj2.pos.setXY(120,120);
        obj2.size.setWH(100,100);
        this.appendChild(obj2);
        obj2.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj2.angle3d.x+=0.01;
            obj2.angle3d.y+=0.01;
        },20);


        const obj3:Model3d = new Model3d(this.game);
        obj3.fillColor.setRGB(222,22,12);
        obj.colorMix = 0.5;
        obj3.modelPrimitive = new Cone(
            60,
            20,
            50
        );
        obj3.texture = this.logo2Link.getTarget();
        obj3.pos.setXY(150,150);
        obj3.size.setWH(100,100);
        this.appendChild(obj3);
        obj3.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj3.angle3d.x+=0.01;
        },20);



        const obj4:Model3d = new Model3d(this.game);
        obj4.fillColor.setRGB(3,22,233);
        obj4.colorMix = 0.8;
        obj4.modelPrimitive = new Sphere(
            60
        );
        obj4.texture = this.logoLink.getTarget();
        obj4.normalsTexture = this.logoNormalsLink.getTarget();
        obj4.pos.setXY(150,150);
        obj4.size.setWH(100,100);
        this.appendChild(obj4);
        obj4.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj4.angle3d.x+=0.01;
        },20);
    }

}

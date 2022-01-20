import {Scene} from "@engine/scene/scene";
import {Mesh2d} from "@engine/renderable/abstract/mesh2d";
import {Cube} from "@engine/renderer/webGl/primitives/cube";
import {Sphere} from "@engine/renderer/webGl/primitives/sphere";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Cylinder} from "@engine/renderer/webGl/primitives/cylinder";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {Cone} from "@engine/renderer/webGl/primitives/cone";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    private logoObj:Mesh2d;

    @Resource.Texture('./assets/repeat.jpg')
    private logoLink:ITexture;

    @Resource.Texture('./model3d/Texture-67.jpg')
    private logo2Link:ITexture;

    @Resource.Texture('./model3d/normals.png')
    private logoNormalsLink:ITexture;

    public override onReady():void {
        const obj:Model3d = new Model3d(this.game,new Cylinder(50,100));
        this.logoObj = obj;
        obj.material.diffuseColor.setRGB(12,222,12);
        obj.material.diffuseColorMix = 0.6;
        obj.texture = this.logoLink;
        obj.pos.setXY(200,100);
        obj.size.setWH(100,100);
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
            obj.angle3d.y+=0.01;
        },20);


        const obj2:Model3d = new Model3d(this.game,new Cube(50));
        obj2.material.diffuseColor.setRGB(12,22,122);
        // obj.modelPrimitive = new Sphere(100,3);
        // obj.modelPrimitive = new Cylinder();
        obj2.texture = this.logo2Link;
        obj2.pos.setXY(120,120);
        obj2.size.setWH(100,100);
        this.appendChild(obj2);
        obj2.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj2.angle3d.x+=0.01;
            obj2.angle3d.y+=0.01;
        },20);

        const obj3:Model3d = new Model3d(this.game,new Cone(60, 20, 50));
        obj3.material.diffuseColor.setRGB(222,22,12);
        obj.material.diffuseColorMix = 0.5;
        obj3.texture = this.logo2Link;
        obj3.pos.setXY(150,150);
        obj3.size.setWH(100,100);
        this.appendChild(obj3);
        obj3.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj3.angle3d.x+=0.01;
        },20);



        const obj4:Model3d = new Model3d(this.game,new Sphere(60));
        obj4.material.diffuseColor.setRGB(3,22,233);
        obj4.material.diffuseColorMix = 0.8;
        obj4.texture = this.logoLink;
        obj4.normalsTexture = this.logoNormalsLink;
        obj4.pos.setXY(150,150);
        obj4.size.setWH(100,100);
        this.appendChild(obj4);
        obj4.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj4.angle3d.x+=0.01;
        },20);
    }

}

import {Scene} from "@engine/scene/scene";
import {Mesh2d} from "@engine/renderable/abstract/mesh2d";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Model3d} from "@engine/renderable/impl/3d/model3d";
import {Resource} from "@engine/resources/resourceDecorators";
import {TaskQueue} from "@engine/resources/taskQueue";

interface IMeshData {
    vertices:number[];
    normals:number[];
    faces:number[];
}

class ScullMesh extends AbstractPrimitive {

    constructor(skullData:IMeshData){
        super();
        this.vertexArr = skullData.vertices;
        this.normalArr = skullData.normals;
        this.indexArr =  skullData.faces;
        this.texCoordArr = undefined;
    }

}


// http://www.threejsworld.com/tutorials/skeletal-animation-and-morph-targets-with-tweenjs-threejs
export class MainScene extends Scene {

    private logoObj:Mesh2d;

    @Resource.JSON('./model3dFromMesh/skull.json')
    private dataLink:IMeshData;

    public override onPreloading(taskQueue:TaskQueue):void {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }


    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
        console.log(val);
    }

    public override onReady():void {
        const obj:Model3d = new Model3d(this.game,new ScullMesh(this.dataLink));
        this.logoObj = obj;
        obj.material.diffuseColor.setRGB(244,255,244);
        obj.pos.setXY(300,450);
        obj.size.setWH(500,500);
        obj.scale.setXYZ(60);
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            // obj.angle3d.x+=0.01;
            obj.angle3d.y-=0.01;
        },20);

    }

}

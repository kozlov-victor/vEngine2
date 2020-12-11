import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Mesh} from "@engine/renderable/abstract/mesh";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {Model3d} from "@engine/renderable/impl/general/model3d";

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

    private logoObj:Mesh;
    private dataLink:ResourceLink<IMeshData>;

    public onPreloading():void {
        this.dataLink = this.resourceLoader.loadJSON('./model3dFromMesh/skull.json');
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }


    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
        console.log(val);
    }

    public onReady():void {
        const obj:Model3d = new Model3d(this.game);
        this.logoObj = obj;
        obj.fillColor.setRGB(244,255,244);
        obj.modelPrimitive = new ScullMesh(this.dataLink.getTarget());
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

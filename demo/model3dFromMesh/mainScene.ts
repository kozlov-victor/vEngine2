import {Scene} from "@engine/model/impl/general/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Mesh} from "@engine/model/abstract/mesh";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {Rectangle} from "@engine/model/impl/geometry/rectangle";
import {Color} from "@engine/renderer/color";
import {Model3d} from "@engine/model/impl/general/model3d";

class ScullMesh extends AbstractPrimitive {

    constructor(skullData:{vertices:number[],normals:number[],faces:number[]}){
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
    private dataLink:ResourceLink<any>;

    public onPreloading() {
        this.dataLink = this.resourceLoader.loadJSON('./skull.json');
        const rect = new Rectangle(this.game);
        (rect.fillColor as Color).setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }


    public onProgress(val: number) {
        this.preloadingGameObject.size.width = val*this.game.width;
        console.log(val);
    }

    public onReady() {
        const obj:Model3d = new Model3d(this.game);
        this.logoObj = obj;
        obj.fillColor.setRGB(244,255,244);
        obj.modelPrimitive = new ScullMesh(this.dataLink.getTarget());
        obj.pos.setXY(200,250);
        obj.size.setWH(200,200);
        obj.scale.setXY(60);
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            // obj.angle3d.x+=0.01;
            obj.angle3d.y-=0.01;
        },20);

    }

}
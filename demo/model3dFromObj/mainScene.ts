import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {AbstractPrimitive} from "@engine/renderer/webGl/primitives/abstractPrimitive";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {ObjParser} from "./objParser";
import {ITexture} from "@engine/renderer/texture";

class ScullMesh extends AbstractPrimitive {

    constructor(skullData:{vertices:number[],normals:number[],faces:number[]}){
        super();
        this.vertexArr = skullData.vertices;
        this.normalArr = skullData.normals;
        this.indexArr =  skullData.faces;
        this.texCoordArr = undefined;
    }

}


export class MainScene extends Scene {

    private data1Link:ResourceLink<string>;
    private data2Link:ResourceLink<string>;
    private data3Link:ResourceLink<string>;

    private dataTextureLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.data1Link = this.resourceLoader.loadText('./model3dFromObj/cow-nonormals.obj');
        this.data2Link = this.resourceLoader.loadText('./model3dFromObj/cube_texture2.obj');
        this.data3Link = this.resourceLoader.loadText('./model3dFromObj/diamond.obj');

        this.dataTextureLink = this.resourceLoader.loadImage('./assets/repeat.jpg');
    }


    public onReady() {

        const obj:Model3d = new Model3d(this.game);
        obj.fillColor.setRGB(255,255,255);
        obj.modelPrimitive = new ObjParser().parse(this.data1Link.getTarget() as string);
        obj.pos.setXY(200,250);
        obj.size.setWH(200,200);
        obj.scale.setXY(60);
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            // obj.angle3d.x+=0.01;
            obj.angle3d.y-=0.01;
        },20);


        const obj3:Model3d = new Model3d(this.game);
        obj3.fillColor.setRGB(122,12,12);
        obj3.modelPrimitive = new ObjParser().parse(this.data3Link.getTarget() as string);
        obj3.pos.setXY(200,250);
        obj3.size.setWH(200,200);
        obj3.scale.setXY(60);
        this.appendChild(obj3);
        obj3.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            // obj.angle3d.x+=0.01;
            obj3.angle3d.y-=0.01;
        },20);
        obj3.scale.setXY(0.5);

        const obj2:Model3d = new Model3d(this.game);
        obj2.fillColor.setRGB(22,122,122);
        obj2.modelPrimitive = new ObjParser().parse(this.data2Link.getTarget() as string);
        obj2.texture = this.dataTextureLink.getTarget();
        obj2.pos.setXY(570,260);
        obj2.size.setWH(200,200);
        obj2.scale.setXY(60);
        this.appendChild(obj2);
        obj2.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj2.angle3d.x+=0.01;
            obj2.angle3d.y-=0.01;
        },20);

    }

}

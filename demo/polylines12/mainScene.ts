import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {FaceTypeToSvg} from "./FaceTypeToSvg";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Mesh2d} from "@engine/renderable/abstract/mesh2d";
import {Resource} from "@engine/resources/resourceDecorators";

export class MainScene extends Scene {

    @Resource.JSON('./polylines12/Mortal Kombat 4_Regular.json')
    private fontJsonLink:any;

    // https://gero3.github.io/facetype.js/

    public onProgress(val: number):void {

    }

    public onReady():void {

        const container:SimpleGameObjectContainer = new SimpleGameObjectContainer(this.game);
        container.size.setWH(300,300);
        container.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(container);
        container.setInterval(()=>{
            container.angle3d.x+=0.01;
        },1);

        const word:string = 'vEngine Hello!';
        let offsetX:number = 0;
        const scale:number = 0.1;
        const faceTypeToSvg:FaceTypeToSvg = new FaceTypeToSvg();
        word.split('').forEach(letter=>{
            const path = this.fontJsonLink.glyphs[letter].o;
            if (!path) {
                offsetX+=50;
                return;
            }
            const svgPath:string = faceTypeToSvg.convert(path,scale,offsetX,0);
            const polygons:Polygon[] = Polygon.fromMultiCurveSvgPath(this.game,svgPath);
            polygons.forEach(p=>{
                p.fillColor.setRGB(12,233,54);
                const mesh:Mesh2d = p.extrudeToMesh(70);
                container.appendChild(mesh);
            });
            offsetX+=this.fontJsonLink.glyphs[letter].x_max * scale;
        });

    }

}

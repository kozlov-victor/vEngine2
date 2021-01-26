import {Scene} from "@engine/scene/scene";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {ResourceLink} from "@engine/resources/resourceLink";
import {FaceTypeToSvg} from "./FaceTypeToSvg";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Mesh} from "@engine/renderable/abstract/mesh";

export class MainScene extends Scene {

    private fontJsonLink:ResourceLink<any>;

    // https://gero3.github.io/facetype.js/
    public onPreloading():void {
        this.fontJsonLink = this.resourceLoader.loadJSON('./polylines12/Mortal Kombat 4_Regular.json');
        //this.fontJsonLink = this.resourceLoader.loadJSON('./polylines12/Press Start 2P_Regular.json');
    }

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
            const path = this.fontJsonLink.getTarget().glyphs[letter].o;
            if (!path) {
                offsetX+=50;
                return;
            }
            const svgPath:string = faceTypeToSvg.convert(path,scale,offsetX,0);
            const polygons:Polygon[] = Polygon.fromMultiCurveSvgPath(this.game,svgPath);
            polygons.forEach(p=>{
                p.fillColor.setRGB(12,233,54);
                const mesh:Mesh = p.extrudeToMesh(70);
                container.appendChild(mesh);
            });
            offsetX+=this.fontJsonLink.getTarget().glyphs[letter].x_max * scale;
        });

    }

}

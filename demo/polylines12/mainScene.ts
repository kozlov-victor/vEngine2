
import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {ResourceLink} from "@engine/resources/resourceLink";
import {FaceTypeToSvg} from "./FaceTypeToSvg";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Mesh} from "@engine/renderable/abstract/mesh";

export class MainScene extends Scene {

    private fontJsonLink:ResourceLink<any>;

    // https://gero3.github.io/facetype.js/
    public onPreloading() {
        this.fontJsonLink = this.resourceLoader.loadJSON('./polylines12/Mortal Kombat 4_Regular.json');
        //this.fontJsonLink = this.resourceLoader.loadJSON('./polylines12/Press Start 2P_Regular.json');
    }

    public onProgress(val: number) {

    }

    public onReady() {

        const container:NullGameObject = new NullGameObject(this.game);
        container.setWH(300,300);
        container.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(container);
        container.setInterval(()=>{
            container.angle3d.x+=0.01;
        },1);

        const word:string = 'vEngine';
        let offsetX:number = 0;
        const scale:number = 0.1;
        word.split('').forEach(letter=>{
            const path = this.fontJsonLink.getTarget().glyphs[letter].o;
            if (!path) {
                offsetX+=100;
                return;
            }
            const svgPath:string = new FaceTypeToSvg().convert(path,scale,offsetX,0);
            console.log(letter,svgPath);
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

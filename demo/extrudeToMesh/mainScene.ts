
import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";
import {Polygon} from "@engine/renderable/impl/geometry/polygon";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ICubeMapTexture} from "@engine/renderer/common/texture";


export class MainScene extends Scene {


    private cubeTextureLink:ResourceLink<ICubeMapTexture>;


    public onPreloading() {


        // https://onlinefontconverter.com/
        // https://gero3.github.io/facetype.js/

        this.cubeTextureLink = this.resourceLoader.loadCubeTexture(
            './cubeMapTexture/textures/cm_left.jpg',
            './cubeMapTexture/textures/cm_right.jpg',
            './cubeMapTexture/textures/cm_top.jpg',
            './cubeMapTexture/textures/cm_bottom.jpg',
            './cubeMapTexture/textures/cm_front.jpg',
            './cubeMapTexture/textures/cm_back.jpg',
        );




    }

    public onProgress(val: number) {

    }

    public onReady() {

        const path = `

            M66.039,133.545c0,0-21-57,18-67s49-4,65,8
            s30,41,53,27s66,4,58,32s-5,44,18,57s22,46,0,45s-54-40-68-16s-40,88-83,48s11-61-11-80s-79-7-70-41
            C46.039,146.545,53.039,128.545,66.039,133.545z

            `;

        // const path = `
        //
        //     M 0 0 h 200 v 200 h -200 v -200 z
        //
        //     `;

        const p:Polygon = Polygon.fromSvgPath(this.game,path);
        const m = p.extrudeToMesh(50);
        m.setWH(200);
        m.transformPoint.setToCenter();
        m.cubeMapTexture = this.cubeTextureLink.getTarget();
        m.reflectivity = 0.1;
        m.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(m);
        m.setInterval(()=>{
            m.angle3d.y+=0.01;
            m.angle3d.z+=0.01;
        },1);
    }

}

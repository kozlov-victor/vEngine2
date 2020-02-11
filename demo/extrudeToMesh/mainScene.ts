
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

            M1.1752732294430075,-39.366672544669086 C37.663396365128506,-141.54919587847198 180.62505914269707,-39.366672544669086 1.1752732294430075,92.01085745592928 C-178.27451268382262,-39.366672544669086 -35.31284990626381,-141.54919587847198 1.1752732294430075,-39.366672544669086 z
            `;

        // const path = `
        //
        //     M 0 0 h 200 v 200 h -200 v -200 z
        //
        //     `;

        // const path = `
        //
        //     M 0 0 v 200 h 200 v -200 h -200 z
        //
        //     `;

        const p:Polygon = Polygon.fromSvgPath(this.game,path);
        const m = p.extrudeToMesh(180);
        m.setWH(150);
        m.transformPoint.setToCenter();
        m.cubeMapTexture = this.cubeTextureLink.getTarget();
        m.reflectivity = 0.1;
        m.pos.setXY(200,200);
        m.addBehaviour(new DraggableBehaviour(this.game));
        this.appendChild(m);
        m.setInterval(()=>{
            m.angle3d.y+=0.01;
            //m.angle3d.z+=0.01;
        },1);
    }

}

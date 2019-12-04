import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Mesh} from "@engine/renderable/abstract/mesh";
import {Sphere} from "@engine/renderer/webGl/primitives/sphere";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {Model3d} from "@engine/renderable/impl/general/model3d";
import {ITexture} from "@engine/renderer/common/texture";
import {Image} from "@engine/renderable/impl/general/image";
import {PalletOffsetFilter} from "@engine/renderer/webGl/filters/texture/palletOffsetFilter";
import {WaveFilter} from "@engine/renderer/webGl/filters/texture/waveFilter";
import {IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {Size} from "@engine/geometry/size";

export class MainScene extends Scene {

    private plasmaLink:ResourceLink<ITexture>;
    private palletLink:ResourceLink<ITexture>;

    public onPreloading() {
        this.plasmaLink = this.resourceLoader.loadImage('./plasma/Plasma_effect.jpg');
        this.palletLink = this.resourceLoader.loadImage('./plasma/gradient.png');
    }



    public onReady() {

        const renderTarget:IRenderTarget = this.game.getRenderer().getHelper().createRenderTarget(this.game,new Size(320,240));

        const obj:Model3d = new Model3d(this.game);
        obj.modelPrimitive = new Sphere(
            120
        );
        obj.pos.setXY(140,140);
        obj.size.setWH(100,100);
        obj.texture = renderTarget.getResourceLink().getTarget();
        obj.heightMapTexture = obj.texture;
        obj.heightMapFactor = 15;
        this.appendChild(obj);
        obj.addBehaviour(new DraggableBehaviour(this.game));
        this.setInterval(()=>{
            obj.angle3d.x+=0.01;
        },20);

        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.plasmaLink);

        const palletFilter:PalletOffsetFilter = new PalletOffsetFilter(this.game,this.palletLink.getTarget());
        const waveFilter = new WaveFilter(this.game);
        waveFilter.setAmplitude(0.005);
        spr.filters = [palletFilter, waveFilter];
        let offset:number = 0;
        this.setInterval(()=>{
            offset++;
            offset = offset % 320;
            palletFilter.setPalletOffset(offset);
            spr.renderToTexture(renderTarget);
        },1);

    }

}

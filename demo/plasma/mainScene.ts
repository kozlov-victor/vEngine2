import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {PalletOffsetFilter} from "@engine/renderer/webGl/filters/texture/palletOffsetFilter";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {WaveFilter} from "@engine/renderer/webGl/filters/texture/waveFilter";

export class MainScene extends Scene {

    private plasmaLink:ResourceLink<ITexture>;
    private palletLink:ResourceLink<ITexture>;

    public onPreloading():void {
        this.plasmaLink = this.resourceLoader.loadTexture('./plasma/Plasma_effect.jpg');
        this.palletLink = this.resourceLoader.loadTexture('./plasma/gradient.png');
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady():void {
        const spr:Image = new Image(this.game);
        spr.setResourceLink(this.plasmaLink);
        this.appendChild(spr);
        spr.pos.setXY(20);
        spr.addBehaviour(new DraggableBehaviour(this.game));

        const palletFilter:PalletOffsetFilter = new PalletOffsetFilter(this.game,this.palletLink.getTarget());
        const waveFilter = new WaveFilter(this.game);
        waveFilter.setAmplitude(0.01);
        spr.filters = [palletFilter, waveFilter];
        let offset:number = 0;
        this.setInterval(()=>{
            offset++;
            offset = offset % 320;
            palletFilter.setPalletOffset(offset);
        },1);

    }

}

import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Image} from "@engine/renderable/impl/general/image/image";
import {ITexture} from "@engine/renderer/common/texture";
import {PalletOffsetFilter} from "@engine/renderer/webGl/filters/texture/palletOffsetFilter";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {WaveFilter} from "@engine/renderer/webGl/filters/texture/waveFilter";
import {Resource} from "@engine/resources/resourceDecorators";
import {TaskQueue} from "@engine/resources/taskQueue";

export class MainScene extends Scene {

    @Resource.Texture('./plasma/Plasma_effect.jpg')
    private plasmaLink:ITexture;

    @Resource.Texture('./plasma/gradient.png')
    private palletLink:ITexture;

    public override onPreloading(taskQueue:TaskQueue):void {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public override onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public override onReady():void {
        const spr:Image = new Image(this.game,this.plasmaLink);
        this.appendChild(spr);
        spr.pos.setXY(20);
        spr.addBehaviour(new DraggableBehaviour(this.game));

        const palletFilter:PalletOffsetFilter = new PalletOffsetFilter(this.game,this.palletLink);
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

import {Scene} from "@engine/scene/scene";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {ITexture} from "@engine/renderer/common/texture";
import {Font} from "@engine/renderable/impl/general/font/font";
import {NoiseFilter} from "@engine/renderer/webGl/filters/texture/noiseFilter";
import {NoiseHorizontalFilter} from "@engine/renderer/webGl/filters/texture/noiseHorizontalFilter";
import {WaveFilter} from "@engine/renderer/webGl/filters/texture/waveFilter";
import {Barrel2DistortionFilter} from "@engine/renderer/webGl/filters/texture/barrel2DistortionFilter";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {TaskQueue} from "@engine/resources/taskQueue";

export class MainScene extends Scene {

    private logoLink:ITexture;
    private fnt:Font;

    public onPreloading(taskQueue:TaskQueue):void {
        super.onPreloading(taskQueue);
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10, 100, 100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;

        taskQueue.addNextTask(async progress => {
            this.logoLink = await taskQueue.getLoader().loadTexture('./assets/logo.png', progress);
        });
        taskQueue.addNextTask(async progress=>{
            this.fnt = await taskQueue.getLoader().loadFontFromCssDescription({fontSize: 50},progress);
        });
    }



    public onProgress(val: number):void {
        this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady():void {

        this.backgroundColor.setRGB(100,100,100);

        const border:number = 10;
        const rect1:Rectangle = new Rectangle(this.game);
        rect1.size.setWH(this.game.size.width-border*2,this.game.size.height-border*2);
        rect1.fillColor = new Color(0,122,2);
        rect1.pos.setXY(border);
        rect1.filters = [new NoiseHorizontalFilter(this.game)];
        this.appendChild(rect1);

        const border2:number = 10;
        const rect2:Rectangle = new Rectangle(this.game);
        rect2.size.setWH(rect1.size.width-border2*2,rect1.size.height-border2*2);
        rect2.fillColor = new Color(122,2,2);
        rect2.pos.setXY(border2);
        rect2.filters = [new NoiseFilter(this.game),new Barrel2DistortionFilter(this.game)];
        rect1.appendChild(rect2);

        const tf:TextField = new TextField(this.game,this.fnt);
        tf.pos.setX(15);
        tf.pos.setY(this.game.size.height/2-40);
        tf.setText("No signal");
        tf.filters = [new WaveFilter(this.game)];
        tf.textColor.setRGB(255,0,0);
        rect2.appendChild(tf);

    }

}

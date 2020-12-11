import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderable/impl/fill/linearGradient";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {SimpleAccumulativeFilter} from "@engine/renderer/webGl/filters/accumulative/simpleAccumulativeFilter";
import {FadeAccumulativeFilter} from "@engine/renderer/webGl/filters/accumulative/fadeAccumulativeFilter";
import {KernelBlurAccumulativeFilter} from "@engine/renderer/webGl/filters/accumulative/kernelBlurAccumulativeFilter";
import {KernelBurnAccumulativeFilter} from "@engine/renderer/webGl/filters/accumulative/kernelBurnAccumulativeFilter";


export class MainScene extends Scene {

    private logoLink:ResourceLink<ITexture>;

    public onPreloading():void {
        this.logoLink = this.resourceLoader.loadTexture('./assets/logo.png');
    }


    public onReady():void {
        const rect:Rectangle = new Rectangle(this.game);
        const gradient:LinearGradient  = new LinearGradient();
        gradient.setColorAtPosition(0, Color.RGB(200,0,20));
        gradient.setColorAtPosition(1, Color.RGB(20,131,1));
        rect.fillGradient = gradient;
        rect.borderRadius = 3;
        rect.color = Color.RGB(120,0,40);
        rect.lineWidth = 4;
        rect.size.setWH(60);
        rect.addBehaviour(new DraggableBehaviour(this.game));
        rect.pos.setXY(120,120);
        this.appendChild(rect);
        rect.filters = [new SimpleAccumulativeFilter(this.game)];

        const rect2:Rectangle = new Rectangle(this.game);
        const gradient2:LinearGradient  = new LinearGradient();
        gradient2.setColorAtPosition(0, Color.RGB(100,0,20));
        gradient2.setColorAtPosition(1, Color.RGB(200,11,1));
        rect2.fillGradient = gradient;
        rect2.borderRadius = 3;
        rect2.color = Color.RGB(20,120,40);
        rect2.lineWidth = 5;
        rect2.size.setWH(70);
        rect2.addBehaviour(new DraggableBehaviour(this.game));
        rect2.pos.setXY(320,120);
        this.appendChild(rect2);
        rect2.filters = [new FadeAccumulativeFilter(this.game)];

        const rect3:Rectangle = new Rectangle(this.game);
        const gradient3:LinearGradient  = new LinearGradient();
        gradient3.setColorAtPosition(0, Color.RGB(100,20,20));
        gradient3.setColorAtPosition(1, Color.RGB(122,121,1));
        rect3.fillGradient = gradient;
        rect3.borderRadius = 3;
        rect3.color = Color.RGB(20,120,40);
        rect3.lineWidth = 5;
        rect3.size.setWH(70);
        rect3.addBehaviour(new DraggableBehaviour(this.game));
        rect3.pos.setXY(420,120);
        this.appendChild(rect3);
        const kernelBlurAccumulative = new KernelBlurAccumulativeFilter(this.game);
        kernelBlurAccumulative.setNoiseIntensity(0.8);
        rect3.filters = [kernelBlurAccumulative];


        const rect4:Rectangle = new Rectangle(this.game);
        const gradient4:LinearGradient  = new LinearGradient();
        gradient4.setColorAtPosition(0, Color.RGBA(20,65,60,100));
        gradient4.setColorAtPosition(1, Color.RGB(12,11,122));
        rect4.fillGradient = gradient;
        rect4.borderRadius = 2;
        rect4.color = Color.RGB(54,120,75);
        rect4.lineWidth = 1;
        rect4.size.setWH(75);
        rect4.addBehaviour(new DraggableBehaviour(this.game));
        rect4.pos.setXY(420,220);
        this.appendChild(rect4);
        const kernelBurnAccumulative = new KernelBurnAccumulativeFilter(this.game);
        kernelBurnAccumulative.setNoiseIntensity(0.8);
        rect4.filters = [kernelBurnAccumulative];

    }

}

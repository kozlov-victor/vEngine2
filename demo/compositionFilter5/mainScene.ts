import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {AlphaMaskFilter} from "@engine/renderer/webGl/filters/texture/alphaMaskFilter";
import {SimpleBlurFilter} from "@engine/renderer/webGl/filters/texture/simpleBlurFilter";
import {FadeAccumulativeFilter} from "@engine/renderer/webGl/filters/accumulative/fadeAccumulativeFilter";
import {CrtScreenFilter} from "@engine/renderer/webGl/filters/texture/crtScreenFilter";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Font} from "@engine/renderable/impl/general/font/font";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontSize: 20})
    private font:Font;

    public override onReady():void {

        this.mouseEventHandler.once(MOUSE_EVENTS.click, e=>{
            this.game.getRenderer().requestFullScreen();
        });

        this.backgroundColor = ColorFactory.fromCSS('black');

        const drawingSurface = new DrawingSurface(this.game,this.game.size);
        const rect = new Rectangle(this.game);
        rect.lineWidth = 0;
        rect.size.setWH(this.game.size.width,30);
        rect.fillColor = ColorFactory.fromCSS(`#ffffff`);
        const fadeFilter = new FadeAccumulativeFilter(this.game);
        fadeFilter.setFadeValue(0.01);
        rect.filters = [new SimpleBlurFilter(this.game),fadeFilter];
        drawingSurface.drawModel(rect);
        let y = 0;
        this.setInterval(()=>{
            drawingSurface.clear();
            y+=5;
            if (y>this.game.height+rect.size.height) y = -100;
            rect.pos.y = y;
            drawingSurface.drawModel(rect);
        },1);

        const tf = new TextField(this.game,this.font);
        tf.size.setFrom(this.game.size);
        tf.setAlignText(AlignText.JUSTIFY);
        tf.setWordBrake(WordBrake.FIT);
        tf.setPadding(10);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tf.textColor.setFrom(ColorFactory.fromCSS('#3da500'));
        tf.setText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean turpis arcu, suscipit ornare sem non, convallis malesuada arcu. Aenean vel sapien laoreet ante convallis imperdiet. Donec tempor mauris nec enim viverra mattis. Nullam vulputate dictum est, at consectetur urna molestie eget. Vestibulum facilisis mauris odio, quis feugiat ex hendrerit a. Sed vitae dapibus nisl. Integer tincidunt pretium tincidunt. In hac habitasse platea dictumst');
        const maskFilter = new AlphaMaskFilter(this.game,drawingSurface.getTexture(),'a');
        tf.filters = [maskFilter];
        this.appendChild(tf);


        this.filters = [new CrtScreenFilter(this.game)];

    }

}

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

export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontSize: 20})
    public font:Font;

    public override onReady():void {

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
        tf.setText('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,');
        const maskFilter = new AlphaMaskFilter(this.game,drawingSurface.getTexture());
        tf.filters = [maskFilter];
        this.appendChild(tf);


        this.filters = [new CrtScreenFilter(this.game)];

    }

}

import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Resource} from "@engine/resources/resourceDecorators";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {XmlParser} from "@engine/misc/parsers/xml/xmlParser";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderable/impl/fill/linearGradient";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {AlphaMaskFilter} from "@engine/renderer/webGl/filters/texture/alphaMaskFilter";
import {BitmapCacheHelper} from "@engine/renderable/bitmapCacheHelper";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable/draggable";
import {InsetBorder} from "@engine/renderable/impl/geometry/insetBorder";


export class MainScene extends Scene {

    @Resource.FontFromAtlasUrl('./fnt6/','atari-smooth.xml',XmlParser)
    private font:Font;

    public override onReady():void {

        this.backgroundColor.setRGB(12,45,12);

        const tf = new TextField(this.game,this.font);
        tf.setAutoSize(true);
        tf.setPadding(5);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.setText("bitmap font \nfrom Phaser\ngame example");
        const bg = new InsetBorder(this.game);
        tf.setBackground(bg);
        const cached = BitmapCacheHelper.cacheAsBitmap(this.game,tf);


        const rect:Rectangle = new Rectangle(this.game);
        rect.size.setFrom(tf.size);
        const gradient:LinearGradient  = new LinearGradient();
        gradient.angle = 0;
        gradient.setColorAtPosition(0,ColorFactory.fromCSS(`rgba(255, 161, 0, 0.81)`));
        gradient.setColorAtPosition(0.5,ColorFactory.fromCSS(`rgba(104, 226, 70, 0.48)`));
        gradient.setColorAtPosition(0.6,ColorFactory.fromCSS(`rgba(83, 62, 202, 0.8)`));
        gradient.setColorAtPosition(1,ColorFactory.fromCSS(`rgba(255, 161, 0, 0.81)`));
        rect.fillGradient = gradient;
        rect.filters = [new AlphaMaskFilter(this.game,cached.getTexture(),'a')];

        const drawingSurface = new DrawingSurface(this.game,tf.size);
        drawingSurface.appendTo(this);
        drawingSurface.drawModel(rect);
        drawingSurface.addBehaviour(new DraggableBehaviour(this.game));

    }

}

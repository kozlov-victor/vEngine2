import {Scene} from "@engine/scene/scene";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font/font";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Color} from "@engine/renderer/common/color";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {AlphaMaskFilter} from "@engine/renderer/webGl/filters/texture/alphaMaskFilter";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";

const text:string=
    `Lorem ipsum dolor sit amet,\t\n\r
    consectetur
    adipiscing elit,
    sed do eiusmod
    tempor incididunt ut labore et
    dolore magna aliqua.
    Ut enim ad minim veniam,
    quis nostrud exercitation
    ullamco laboris nisi ut
    aliquip ex ea
    commodo consequat.`;

export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontSize:15,fontFamily:'monospace'})
    private fnt:Font;

    public override onReady():void {
        const tf = new TextField(this.game,this.fnt);
        tf.pos.setXY(50,50);
        tf.size.setWH(700,420);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.textColor.setFrom(ColorFactory.fromCSS('#0cc306'));
        const background = new Rectangle(this.game);
        background.fillColor = ColorFactory.fromCSS('#03164c');
        background.borderRadius = 5;
        tf.setText(text);
        tf.setBackground(background);
        tf.setPadding(10);
        tf.setMargin(20);
        this.appendChild(tf);
        this.backgroundColor = ColorFactory.fromCSS('#e0e6fc');


        const alphaMask = new DrawingSurface(this.game,this.game.size);

        const cursorContainer = new SimpleGameObjectContainer(this.game);
        cursorContainer.appendTo(this);

        const cursor = new Circle(this.game);
        cursor.lineWidth = 0;
        cursor.radius = 100;
        cursor.fillColor = Color.RGB(100,100,90);

        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove, e=>{
            cursor.center.setXY(e.screenX,e.screenY);
            alphaMask.clear();
            alphaMask.drawModel(cursor);
        });

        tf.filters = [
            new AlphaMaskFilter(this.game,alphaMask.getTexture(),'r')
        ];

    }
}

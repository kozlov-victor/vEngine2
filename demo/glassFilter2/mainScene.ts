import {Scene} from "@engine/scene/scene";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Resource} from "@engine/resources/resourceDecorators";
import {Font} from "@engine/renderable/impl/general/font/font";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {DrawingSurface} from "@engine/renderable/impl/surface/drawingSurface";
import {AlphaMaskFilter} from "@engine/renderer/webGl/filters/texture/alphaMaskFilter";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {CopyDestCompositionFilter} from "@engine/renderer/webGl/filters/composition/copyDestCompositionFilter";
import {ITexture} from "@engine/renderer/common/texture";
import {Image} from "@engine/renderable/impl/general/image/image";
import {SepiaColorMatrixFilter} from "@engine/renderer/webGl/filters/colorMatrix/sepiaColorMatrixFilter";
import {LensDistortionFilter} from "@engine/renderer/webGl/filters/texture/lensDistortionFilter";

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

    @Resource.Texture('./glassFilter2/cursor/cursor-mask.png')
    public readonly cursorMaskTexture:ITexture;

    @Resource.Texture('./glassFilter2/cursor/cursor.png')
    public readonly cursorTexture:ITexture;

    @Resource.FontFromCssDescription({fontSize:15,fontFamily:'monospace'})
    public readonly fnt:Font;

    @Resource.Texture('./alphaMask/mask.png')
    public readonly mask:ITexture;

    public override onReady():void {

        document.body.style.cursor = 'none';
        this.mouseEventHandler.on(MOUSE_EVENTS.click, ()=>this.game.getRenderer().requestFullScreen());


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
        tf.appendTo(this);
        this.backgroundColor = ColorFactory.fromCSS('#e0e6fc');


        const cursorContainer = new SimpleGameObjectContainer(this.game);
        cursorContainer.appendTo(this);

        const cursorMask = new Image(this.game,this.cursorMaskTexture);

        const cursor = new Image(this.game,this.cursorTexture);
        cursor.appendTo(this);

        const alphaMask = new DrawingSurface(this.game,this.game.size);
        const lensFilter = new LensDistortionFilter(this.game).setLengthSize(150);
        this.mouseEventHandler.on(MOUSE_EVENTS.mouseMove, e=>{
            cursorMask.pos.setXY(e.screenX,e.screenY);
            cursor.pos.setFrom(cursorMask.pos);
            lensFilter.setMouseScreenCoordinates(e.screenX+cursor.size.width/2,e.screenY+cursor.size.height/2);
            alphaMask.clear();
            alphaMask.drawModel(cursorMask);
        });

        cursorContainer.filters = [
            new CopyDestCompositionFilter(this.game),
            new SepiaColorMatrixFilter(this.game),
            lensFilter,
            new AlphaMaskFilter(this.game,alphaMask.getTexture(),'a')
        ];

    }
}

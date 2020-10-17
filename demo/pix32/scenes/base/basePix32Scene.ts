import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import * as fntXML from "xml/angelcode-loader!../../resources/font/font32.fnt";
import {ResourceLink} from "@engine/resources/resourceLink";
import {Font} from "@engine/renderable/impl/general/font";
import {ITexture} from "@engine/renderer/common/texture";
import {Game} from "@engine/core/game";
import {TextField, TextFieldWithoutCache} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Tween} from "@engine/animation/tween";
import {Color} from "@engine/renderer/common/color";
import {ImageCacheContainer} from "@engine/renderable/impl/general/imageCacheContainer";
import {Size} from "@engine/geometry/size";
import {PalletOffsetFilter} from "@engine/renderer/webGl/filters/texture/palletOffsetFilter";
import {AlignText, AlignTextContentHorizontal, WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {Layer, LayerTransformType} from "@engine/scene/layer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Image} from "@engine/renderable/impl/general/image";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";

export const waitFor = (game:Game,time:number):Promise<void>=>{
    return new Promise<void>((resolve)=>{
        game.getCurrScene().setTimeout(()=>{
            resolve();
        },time);
    });
}

export abstract class BasePix32Scene extends Scene {

    @Resource.FontFromAtlas('./pix32/resources/font/font32.png',fntXML)
    private fontLink:ResourceLink<Font>;

    @Resource.Texture('./pix32/resources/images/pallet.png')
    private palletLink:ResourceLink<ITexture>;

    @Resource.Texture('./pix32/resources/images/container.png')
    protected containerLink:ResourceLink<ITexture>;

    private btmLayer:Layer;
    private topLayer:Layer;
    protected screen:RenderableModel;

    private textField:TextField;

    protected async print(text:string,time:number,instant:boolean = false):Promise<void> {
        const tf:TextField = this.textField;
        tf.moveToFront();
        tf.setText(text);
        tf.revalidate();
        tf.pos.setXY(0,5);
        this.addTween(new Tween<{x:number}>({
            from:{x:0},
            to:{x:-tf.size.width-32},
            target:tf.pos,
            time,
            loop: instant,
        }));
        await waitFor(this.game,time);
    }

    constructor(protected game:Game){
        super(game);
    }

    public onReady() {

        this.backgroundColor = Color.fromCssLiteral(`#e2e2e2`);

        this.btmLayer = new Layer(this.game);
        this.appendChild(this.btmLayer);

        this.topLayer = new Layer(this.game);
        this.topLayer.transformType  = LayerTransformType.STICK_TO_CAMERA;
        this.appendChild(this.topLayer);

        const screen:ImageCacheContainer = new ImageCacheContainer(this.game,new Size(32,32));
        screen.size.setWH(377,341);
        screen.pos.setXY(113,58);
        screen.setPixelPerfect(true);
        this.btmLayer.appendChild(screen);
        this.screen = screen;

        const palletFilter:PalletOffsetFilter = new PalletOffsetFilter(this.game,this.palletLink.getTarget());
        screen.filters = [palletFilter];

        const tf:TextField = new TextField(this.game,this.fontLink.getTarget());
        tf.size.setWH(this.game.size.width*3,this.game.size.height);
        tf.setPixelPerfect(true);
        tf.setAutoSize(true);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.setAlignText(AlignText.CENTER);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.textColor.setRGBA(12,100,20, 255);
        screen.appendChild(tf);
        this.textField = tf;

        this.topLayer = new Layer(this.game);
        this.topLayer.transformType  = LayerTransformType.STICK_TO_CAMERA;
        this.appendChild(this.topLayer);

        const indicator:Rectangle = new Rectangle(this.game);
        indicator.lineWidth = 0;
        const fillColorOn = Color.fromCssLiteral(`#ff0000`);
        const fillColorOff = Color.fromCssLiteral(`#9f0404`);
        indicator.pos.setXY(40,162);
        indicator.size.setWH(60,100);
        this.topLayer.appendChild(indicator);
        let on:boolean = false;
        indicator.setInterval(()=>{
            on=!on;
            indicator.fillColor = on?fillColorOn:fillColorOff;
        },2000);

        const container:Image = new Image(this.game);
        container.setResourceLink(this.containerLink);
        this.topLayer.appendChild(container);

    }

}

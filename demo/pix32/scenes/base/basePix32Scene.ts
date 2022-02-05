import {Scene} from "@engine/scene/scene";
import {Resource} from "@engine/resources/resourceDecorators";
import * as fntXML from "xml/angelcode-loader!../../resources/font/font32.fnt";
import {Font} from "@engine/renderable/impl/general/font/font";
import {ITexture} from "@engine/renderer/common/texture";
import {Game} from "@engine/core/game";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Tween} from "@engine/animation/tween";
import {Color} from "@engine/renderer/common/color";
import {ImageCacheSurface} from "@engine/renderable/impl/surface/imageCacheSurface";
import {Size} from "@engine/geometry/size";
import {PalletOffsetFilter} from "@engine/renderer/webGl/filters/texture/palletOffsetFilter";
import {AlignText, AlignTextContentHorizontal, WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {Layer, LayerTransformType} from "@engine/scene/layer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Image} from "@engine/renderable/impl/general/image";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {ChipOscilloscope} from "../../misc/chipOscilloscope";
import {AbstractChipTrack} from "../../ym-player/abstract/abstractChipTrack";
import {Sound} from "@engine/media/sound";
import {UploadedSoundLink} from "@engine/media/interface/iAudioPlayer";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

export const waitFor = (game:Game,time:number):Promise<void>=>{
    return new Promise<void>((resolve)=>{
        game.getCurrentScene().setTimeout(()=>{
            resolve();
        },time);
    });
};

let cnt = 0;

export const loadSound = async (game:Game,track:AbstractChipTrack):Promise<Sound>=>{
    const arrayBuffer:ArrayBuffer = await track.renderToArrayBuffer();
    const url = Math.random().toString() + (++cnt);
    const link:UploadedSoundLink = await game.getAudioPlayer().uploadBufferToContext(url,arrayBuffer);
    return new Sound(game, link);
};

export abstract class BasePix32Scene extends Scene {

    @Resource.FontFromAtlas('./pix32/resources/font/',fntXML)
    private fontLink:Font;

    @Resource.Texture('./pix32/resources/images/pallet.png')
    private palletLink:ITexture;

    @Resource.Texture('./pix32/resources/images/container.png')
    protected containerLink:ITexture;

    private btmLayer:Layer;
    public topLayer:Layer;
    public screen:RenderableModel;

    private textField:TextField;
    protected oscilloscope:ChipOscilloscope;

    protected async print(text:string,time:number,instant:boolean = false):Promise<void> {
        const tf:TextField = this.textField;
        tf.moveToFront();
        tf.setText(text);
        tf.revalidate();
        tf.pos.setXY(0,5);
        this.addTween(new Tween<{x:number}>(this.game,{
            from:{x:0},
            to:{x:-tf.size.width-32},
            target:tf.pos,
            time,
            loop: instant,
        }));
        await waitFor(this.game,time);
        if (!instant) tf.setText("");
    }

    constructor(game:Game){
        super(game);
    }


    public override onReady():void {

        this.backgroundColor = ColorFactory.fromCSS(`#e2e2e2`);

        this.btmLayer = new Layer(this.game);
        this.appendChild(this.btmLayer);

        this.topLayer = new Layer(this.game);
        this.topLayer.transformType  = LayerTransformType.STICK_TO_CAMERA;
        this.appendChild(this.topLayer);

        const screen:ImageCacheSurface = new ImageCacheSurface(this.game,new Size(32,32));
        screen.size.setWH(377,341);
        screen.pos.setXY(113,58);
        screen.setPixelPerfect(true);
        this.btmLayer.appendChild(screen);
        this.screen = screen;

        const palletFilter:PalletOffsetFilter = new PalletOffsetFilter(this.game,this.palletLink);
        screen.filters = [palletFilter];

        const tf:TextField = new TextField(this.game,this.fontLink);
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
        const fillColorOn = ColorFactory.fromCSS(`#ff0000`);
        const fillColorOff = ColorFactory.fromCSS(`#9f0404`);
        indicator.pos.setXY(40,162);
        indicator.size.setWH(60,100);
        this.topLayer.appendChild(indicator);
        let on:boolean = false;
        indicator.setInterval(()=>{
            on=!on;
            indicator.fillColor = on?fillColorOn:fillColorOff;
        },2000);

        this.oscilloscope = new ChipOscilloscope(this.game,this);

        const container:Image = new Image(this.game,this.containerLink);
        this.topLayer.appendChild(container);

    }

}

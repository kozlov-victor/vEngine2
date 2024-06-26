import {Scene} from "@engine/scene/scene";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {Font} from "@engine/renderable/impl/general/font/font";
import {Button} from "@engine/renderable/impl/ui/button/button";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {Ym} from "../pix32/ym-player/formats/ym";
import {Sound} from "@engine/media/sound";
import {Vtx} from "../pix32/ym-player/formats/vtx";
import {NoiseFilter} from "@engine/renderer/webGl/filters/texture/noiseFilter";
import {fontLoader} from "../fontTtf/FontLoader";
import {ChipOscilloscope} from "./chipOscilloscope";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {Image} from "@engine/renderable/impl/general/image/image";
import {LinearGradient} from "@engine/renderable/impl/fill/linearGradient";
import {TaskQueue} from "@engine/resources/taskQueue";
import loadFont = fontLoader.loadFont;
import {UploadedSoundLink} from "@engine/media/interface/iAudioPlayer";
import {Psg} from "../pix32/ym-player/formats/psg";
import {ColorFactory} from "@engine/renderer/common/colorFactory";

const songUrls = [
    'chipTunePlayer/bin/nq - Old Tower outro (2018).psg',
    'chipTunePlayer/bin/TmK - Some Small CompoFiller (2017) (Chaos Constructions 2017, 7).psg',
    'chipTunePlayer/bin/JeRrS - Zxfiles (2005).vtx',
    'chipTunePlayer/bin/Noro - Twilight - credits (1995).vtx',
    'chipTunePlayer/bin/ZiutekLyraII.vtx',
    'chipTunePlayer/bin/ritm-4.vtx',
    'chipTunePlayer/bin/theme.ym',
    'chipTunePlayer/bin/intro.ym',
    'chipTunePlayer/bin/Eifmes.vtx',
    'chipTunePlayer/bin/Androids.ym',
];

let cnt:number = 0;

export class MainScene extends Scene {

    public fnt:Font;

    @Resource.Texture('./chipTunePlayer/skin.png')
    public readonly skinTexture:ITexture;

    public override onPreloading(taskQueue:TaskQueue):void {
        super.onPreloading(taskQueue);
        loadFont(this.game,taskQueue,'./chipTunePlayer/pixel.ttf','customFont');
        taskQueue.addNextTask(async progress=>{
            this.fnt = await taskQueue.getLoader().loadFontFromCssDescription({fontSize:25,fontFamily:'customFont'},progress);
        });
    }

    public override onReady():void {
        const tf:TextField = new TextField(this.game,this.fnt);
        const bgTf = new Rectangle(this.game);
        bgTf.fillColor = ColorFactory.fromCSS(`#edffe8`);
        tf.setBackground(bgTf);
        tf.size.setWH(800,300);
        tf.textColor.setFrom(ColorFactory.fromCSS('#78cb54'));
        tf.setPadding(50);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tf.setAlignText(AlignText.JUSTIFY);
        tf.setText("YM Chiptune player");
        tf.filters = [new NoiseFilter(this.game)];
        this.appendChild(tf);

        const tfIndicator:TextField = new TextField(this.game,this.fnt);
        const bgTfIndicator = new Rectangle(this.game);
        bgTfIndicator.fillColor = ColorFactory.fromCSS(`#edffe8`);
        tfIndicator.setBackground(bgTfIndicator);
        tfIndicator.setWordBrake(WordBrake.PREDEFINED);
        tfIndicator.size.setWH(800,80);
        tfIndicator.textColor.setFrom(ColorFactory.fromCSS('#78cb54'));
        tfIndicator.setPadding(3);
        tfIndicator.pos.setXY(0, 310);
        tfIndicator.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tfIndicator.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tfIndicator.setAlignText(AlignText.JUSTIFY);
        tfIndicator.setText("---- ---- ----\n---- ---- ----");
        tfIndicator.filters = [new NoiseFilter(this.game)];
        this.appendChild(tfIndicator);

        const btn:Button = new Button(this.game,this.fnt);
        const bgBtn = new Rectangle(this.game);
        const grad = new LinearGradient();
        grad.setColorAtPosition(1,ColorFactory.fromCSS('#82d45e'));
        grad.setColorAtPosition(0,ColorFactory.fromCSS('#568c3e'));
        grad.angle = Math.PI/2;
        bgBtn.fillGradient = grad;
        bgBtn.lineWidth = 1;
        bgBtn.borderRadius = 10;
        btn.setBackground(bgBtn);

        const bgBtnActive = new Rectangle(this.game);
        const gradActive = new LinearGradient();
        gradActive.setColorAtPosition(0,ColorFactory.fromCSS('#82d45e'));
        gradActive.setColorAtPosition(1,ColorFactory.fromCSS('#568c3e'));
        gradActive.angle = Math.PI/2;
        bgBtnActive.lineWidth = 1;
        bgBtnActive.borderRadius = 10;
        bgBtnActive.fillGradient = gradActive;
        btn.setBackgroundActive(bgBtnActive);

        btn.setPadding(8, 2 ,2);
        btn.pos.setXY(15,402);
        btn.setAutoSize(true);
        btn.setText("play>>");
        btn.textColor.setFrom(ColorFactory.fromCSS('#fff'));
        this.appendChild(btn);
        let currSound:Sound;
        let pending:boolean = false;

        const img = new Image(this.game,this.skinTexture);
        this.appendChild(img);

        btn.mouseEventHandler.on(MOUSE_EVENTS.click, async _=>{
            if (pending) return;
            pending = true;
            const songUrl:string = songUrls[cnt];
            cnt=(++cnt)%songUrls.length;
            tf.setText(`loading track ${songUrl}`);

            if (currSound!==undefined) currSound.stop();
            const resourceLoader = new ResourceLoader(this.game);
            const buff:ArrayBuffer = await resourceLoader.loadBinary(songUrl);
            await resourceLoader.start();
            let track;
            const extension:string = songUrl.split('.')[1];
            switch (extension) {
                case 'ym':
                    track = new Ym(buff);
                    break;
                case 'vtx':
                    track = new Vtx(buff);
                    break;
                case 'psg':
                    track = new Psg(buff);
                    break;
                default:
                    throw new Error(`unsupported extension: ${extension}`);
            }
            const trackArrayBuffer = await track.renderToArrayBuffer();
            const link:UploadedSoundLink = await this.game.getAudioPlayer().uploadBufferToContext(songUrl,trackArrayBuffer);
            const sound = new Sound(this.game,link);
            sound.play();
            currSound = sound;
            tf.setText(track.getTrackInfo());
            const oscilloscope = new ChipOscilloscope(this.game);
            oscilloscope.listen(sound,track,tfIndicator);
            pending = false;

        });

    }

}

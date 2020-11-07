import {Scene} from "@engine/scene/scene";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {Font} from "@engine/renderable/impl/general/font";
import {Button} from "@engine/renderable/impl/ui/button/button";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Color} from "@engine/renderer/common/color";
import {ResourceLink} from "@engine/resources/resourceLink";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {Ym} from "../pix32/ym-player/ym";
import {Sound} from "@engine/media/sound";
import {Vtx} from "../pix32/ym-player/vtx";
import {NoiseFilter} from "@engine/renderer/webGl/filters/texture/noiseFilter";
import {fontLoader} from "../fontTtf/FontLoader";
import {ChipOscilloscope} from "./chipOscilloscope";
import loadFont = fontLoader.loadFont;

const songUrls = [
    'chipTunePlayer/bin/theme.ym',
    'chipTunePlayer/bin/intro.ym',
    'chipTunePlayer/bin/Eifmes.vtx',
    'chipTunePlayer/bin/Androids.ym',
];

let cnt:number = 0;

export class MainScene extends Scene {



    // @Resource.Font({fontFamily:'monospace',fontSize:25})
    public fnt:Font;

    onPreloading() {
        super.onPreloading();
        loadFont(this.game,'./chipTunePlayer/pixel.ttf','customFont');
        this.resourceLoader.addNextTask(()=>{
            this.fnt = new Font(this.game,{fontSize:25,fontFamily:'customFont'});
        });
    }

    public onReady() {
        const tf:TextField = new TextField(this.game,this.fnt);
        const bgTf = new Rectangle(this.game);
        bgTf.fillColor = Color.fromCssLiteral(`#edffe8`);
        tf.setBackground(bgTf);
        tf.size.setWH(800,300);
        tf.textColor.fromCSS('#78cb54')
        tf.setPadding(50);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tf.setAlignText(AlignText.JUSTIFY);
        tf.setText("YM Chiptune player");
        tf.filters = [new NoiseFilter(this.game)]
        this.appendChild(tf);

        const tfIndicator:TextField = new TextField(this.game,this.fnt);
        const bgTfIndicator = new Rectangle(this.game);
        bgTfIndicator.fillColor = Color.fromCssLiteral(`#edffe8`);
        tfIndicator.setBackground(bgTfIndicator);
        tfIndicator.setWordBrake(WordBrake.PREDEFINED);
        tfIndicator.size.setWH(800,80);
        tfIndicator.textColor.fromCSS('#78cb54')
        tfIndicator.setPadding(3);
        tfIndicator.pos.setXY(0, 310);
        tfIndicator.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tfIndicator.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tfIndicator.setAlignText(AlignText.JUSTIFY);
        tfIndicator.setText("---- ---- ----");
        tfIndicator.filters = [new NoiseFilter(this.game)]
        this.appendChild(tfIndicator);

        const btn:Button = new Button(this.game,this.fnt);
        const bgBtn = new Rectangle(this.game);
        bgBtn.fillColor = Color.fromCssLiteral(`#6e9f58`);
        bgBtn.lineWidth = 1;
        bgBtn.borderRadius = 10;
        btn.setBackground(bgBtn);

        const bgBtnActive = new Rectangle(this.game);
        bgBtnActive.fillColor = Color.fromCssLiteral(`#82d45e`);
        bgBtnActive.lineWidth = 1;
        bgBtnActive.borderRadius = 10;
        btn.setBackgroundActive(bgBtnActive);

        btn.setPadding(8, 2 ,2);
        btn.pos.setXY(0,400);
        btn.setAutoSize(true);
        btn.setText("play>>");
        btn.textColor.fromCSS('#fff');
        this.appendChild(btn);
        let currSound:Sound;
        btn.on(MOUSE_EVENTS.click, async _=>{
            const songUrl:string = songUrls[cnt];
            cnt=(++cnt)%songUrls.length;
            tf.setText(`loading track ${songUrl}`);
            console.log('loading...');
            if (currSound!==undefined) currSound.stop();
            const resourceLoader = new ResourceLoader(this.game);
            const buff:ArrayBuffer = await resourceLoader.loadBinary(songUrl).asPromise();
            let track;
            const extension:string = songUrl.split('.')[1];
            switch (extension) {
                case 'ym':
                    track = new Ym(buff);
                    break;
                case 'vtx':
                    track = new Vtx(buff);
                    break;
                default:
                    throw new Error(`unsupported extension: ${extension}`);
            }
            const link: ResourceLink<void> = ResourceLink.create<void>(undefined);
            const trackArrayBuffer = await track.renderToArrayBuffer();
            await this.game.getAudioPlayer().loadSound(trackArrayBuffer, link);
            const sound = new Sound(this.game);
            sound.setResourceLink(link);
            sound.play();
            currSound = sound;
            tf.setText(track.getTrackInfo());
            const oscilloscope = new ChipOscilloscope(this.game);
            oscilloscope.listen(sound,track,tfIndicator);
        });

    }

}

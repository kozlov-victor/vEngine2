import {Scene} from "@engine/scene/scene";
import {Font} from "@engine/renderable/impl/general/font";
import * as fntXML from "xml/angelcode-loader!../fnt3/font.fnt"
import {Resource} from "@engine/resources/resourceDecorators";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {ResourceLink} from "@engine/resources/resourceLink";
import {AnimatedTextField} from "@engine/renderable/impl/ui/textField/animated/animatedTextField";
import {EasingSine} from "@engine/misc/easing/functions/sine";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {AppearFromOffsetTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/appearFromOffsetTextAnimation";
import {KernelBlurAccumulativeFilter} from "@engine/renderer/webGl/filters/accumulative/kernelBlurAccumulativeFilter";

export class MainScene extends Scene {

    @Resource.FontFromAtlas('./fnt3/font.png',fntXML)
    private fontLink:ResourceLink<Font>;

    public onReady() {
        this.backgroundColor.setRGB(12,12,12);
        const tf = new AnimatedTextField(this.game,this.fontLink.getTarget());
        tf.size.setWH(this.game.width-30,200);
        tf.pos.setXY(this.game.width/2,this.game.height/2);
        tf.anchorPoint.setToCenter();
        tf.setPadding(10);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.setAlignText(AlignText.CENTER);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tf.textColor.setRGBA(0,0,0,0);

        const animations = [
            new AppearFromOffsetTextAnimation({x:0,y:100},40, 300,EasingSine.Out),
            new AppearFromOffsetTextAnimation({x:100,y:0},20, 300,EasingSine.Out),
        ];
        let i:number = 0;

        const setNextAnimation = ()=>{
            tf.setTextWithAnimation(`This is animated text\nwith accumulative filter\nEnjoy it!`, animations[i]);
            i = (++i)%animations.length;
        };
        setNextAnimation();
        tf.on(MOUSE_EVENTS.click, _=>{
            setNextAnimation();
        });

        this.appendChild(tf);
        const f = new KernelBlurAccumulativeFilter(this.game);
        f.setNoiseIntensity(1.6);
        tf.filters = [f];
    }

}

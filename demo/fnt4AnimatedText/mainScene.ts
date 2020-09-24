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
import {AppearFromPointTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/appearFromPointTextAnimation";
import {EasingSine} from "@engine/misc/easing/functions/sine";
import {RotateLetterTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/rotateLetterTextAnimation";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {SimpleAppearLetterTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/simpletAppearLetterTextAnimation";
import {ScaleAppearLetterTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/scaleAppearLetterTextAnimation";
import {EasingBounce} from "@engine/misc/easing/functions/bounce";
import {AlphaAppearLetterTextAnimation} from "@engine/renderable/impl/ui/textField/animated/alphaAppearLetterTextAnimation";
import {AppearFromOffsetTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/appearFromOffsetTextAnimation";

export class MainScene extends Scene {

    @Resource.FontFromAtlas('./fnt3/font.png',fntXML)
    private fontLink:ResourceLink<Font>;

    public onReady() {
        this.colorBG.setRGB(12,12,12);
        const tf = new AnimatedTextField(this.game,this.fontLink.getTarget());
        tf.size.set(this.game.size);
        tf.setPadding(10);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.setAlignText(AlignText.CENTER);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.setAlignTextContentVertical(AlignTextContentVertical.CENTER);
        tf.textColor.setRGBA(0,0,0,0);

        const animations = [
            new AppearFromPointTextAnimation({x:100,y:100},20, 100,EasingSine.Out),
            new AppearFromPointTextAnimation({x:800,y:100},200, 2000,EasingBounce.Out),
            new AppearFromOffsetTextAnimation({x:0,y:-100},20, 300,EasingSine.Out),
            new AppearFromOffsetTextAnimation({x:0,y:100},20, 300,EasingSine.Out),
            new RotateLetterTextAnimation(100, -3),
            new SimpleAppearLetterTextAnimation(100),
            new ScaleAppearLetterTextAnimation(100, 400,0.01,EasingBounce.Out),
            new ScaleAppearLetterTextAnimation(200, 1200,5,EasingBounce.Out),
            new AlphaAppearLetterTextAnimation(10, 1200,0,EasingBounce.Out),
            new AlphaAppearLetterTextAnimation(20, 1500,0,EasingSine.Out),
        ];
        let i:number = 0;

        const setNextAnimation = ()=>{
            tf.setTextWithAnimation(`This is animated text\nEnjoy it!\n(click to change animation)\n(animation index: ${i})`, animations[i]);
            i = (++i)%animations.length;
        };
        setNextAnimation();
        tf.on(MOUSE_EVENTS.click, _=>{
            setNextAnimation();
        });

        this.appendChild(tf);
    }

}

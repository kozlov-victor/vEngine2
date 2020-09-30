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
import {AppearFromRandomPointTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/appearFromRandomPointTextAnimation";
import {AppearRandomLetterTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/appearRandomLetterTextAnimation";
import {RotateLetterYTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/rotateLetterYTextAnimation";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {LinearGradient} from "@engine/renderable/impl/fill/linearGradient";
import {Color} from "@engine/renderer/common/color";

export class MainScene extends Scene {

    @Resource.FontFromAtlas('./fnt3/font.png',fntXML)
    private fontLink:ResourceLink<Font>;

    public onReady() {
        this.colorBG.setRGB(12,12,12);
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

        const bgHover = new Rectangle(this.game);
        bgHover.borderRadius = 30;
        bgHover.fillColor.setRGBA(12,12,12,30);
        tf.setBackgroundHover(bgHover);

        const bgActive = new Rectangle(this.game);
        bgActive.borderRadius = 30;
        const grad = new LinearGradient();
        grad.setColorAtPosition(0,Color.fromCssLiteral("rgba(109,248,98,0.2)"));
        grad.setColorAtPosition(0.5,Color.fromCssLiteral("rgba(214,146,18,0.2)"));
        grad.setColorAtPosition(1,Color.fromCssLiteral("rgba(109,248,98,0.2)"));
        grad.angle = Math.PI/2;
        bgActive.fillGradient = grad;
        tf.setBackgroundActive(bgActive);

        const animations = [
            new RotateLetterYTextAnimation(400, -Math.PI/3),
            new AppearRandomLetterTextAnimation(2000),
            new AppearFromPointTextAnimation({x:100,y:100},20, 100,EasingSine.Out),
            new AppearFromPointTextAnimation({x:800,y:100},200, 2000,EasingBounce.Out),
            new AppearFromOffsetTextAnimation({x:0,y:-100},20, 300,EasingSine.Out),
            new AppearFromOffsetTextAnimation({x:0,y:100},20, 300,EasingSine.Out),
            new AppearFromRandomPointTextAnimation(400,20, 300,EasingSine.Out),
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

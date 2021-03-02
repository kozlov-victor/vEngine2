import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {Image} from "@engine/renderable/impl/general/image";
import {ITexture} from "@engine/renderer/common/texture";
import {createGlowTweenFilter, createScaleTweenMovie} from "../utils/miscFunctions";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {MotionBlurFilter} from "@engine/renderer/webGl/filters/texture/motionBlurFilter";
import {MathEx} from "@engine/misc/mathEx";
import {GAME_PAD_EVENTS} from "@engine/control/gamepad/gamePadEvents";
import {MkSelectHeroScene} from "./mkSelectHeroScene";
import {Sound} from "@engine/media/sound";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {MkAbstractScene} from "./mkAbstractScene";
import {CurtainsOpeningTransition} from "@engine/scene/transition/appear/curtains/curtainsOpeningTransition";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {IGamePadEvent} from "@engine/control/gamepad/iGamePadEvent";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {AlignText, AlignTextContentHorizontal, WordBrake} from "@engine/renderable/impl/ui/textField/textAlign";
import {Resource} from "@engine/resources/resourceDecorators";

export class MkIntroScene extends MkAbstractScene {

    @Resource.FontFromCssDescription({fontSize: 80, fontFamily: 'MK4'})
    private fnt:Font;

    @Resource.Texture('./mk-alfa/assets/images/mkLogo.png')
    private logoLink:ITexture;

    @Resource.Sound('./mk-alfa/assets/sounds/btn.wav')
    private sound:Sound;

    public onReady(): void {

        super.onReady();

        this.on(MOUSE_EVENTS.click, ()=>{
            this.game.getRenderer().requestFullScreen();
        });


        const img:Image = new Image(this.game,this.logoLink);
        this.appendChild(img);
        img.transformPoint.setToCenter();
        img.pos.setXY(70,10);
        createScaleTweenMovie(this.game,0.4,1.11,3000,img);

        const mb:MotionBlurFilter = new MotionBlurFilter(this.game);
        mb.setStrength(0.01);

        img.filters = [
            new MotionBlurFilter(this.game),
            createGlowTweenFilter(this.game,Color.RGB(12,100,12),0,5,2000)
        ];

        const nullContainer:SimpleGameObjectContainer = new SimpleGameObjectContainer(this.game);
        nullContainer.filters = [createGlowTweenFilter(this.game,Color.RGB(122,122,12),5,8,1000)];
        this.appendChild(nullContainer);


        const tf:TextField = new TextField(this.game,this.fnt);
        tf.setAlignText(AlignText.CENTER);
        tf.setAlignTextContentHorizontal(AlignTextContentHorizontal.CENTER);
        tf.size.set(this.game.size);
        tf.setWordBrake(WordBrake.PREDEFINED);
        tf.pos.setY(200);
        tf.textColor.setRGB(110,111,10);
        tf.setText("Secret Santa\nAlfa 2019\n\n\nPress any key");
        nullContainer.appendChild(tf);

        this.setInterval(()=>{
            if (MathEx.randomInt(0,50)<25) this.camera.shake(5,200);
        },1000);

        this.on(GAME_PAD_EVENTS.buttonPressed, (e:IGamePadEvent)=>{
            this.sound.play();
            this.game.runScene(new MkSelectHeroScene(this.game),new CurtainsOpeningTransition(this.game));
        });
        this.on(KEYBOARD_EVENTS.keyPressed, ()=>{
            this.sound.play();
            this.game.runScene(new MkSelectHeroScene(this.game),new CurtainsOpeningTransition(this.game));
        });


    }


}

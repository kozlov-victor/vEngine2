import {Font} from "@engine/renderable/impl/general/font";
import {Color} from "@engine/renderer/common/color";
import {TEXT_ALIGN, TextField, WORD_BRAKE} from "@engine/renderable/impl/ui/components/textField";
import {Image} from "@engine/renderable/impl/general/image";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {createGlowTweenFilter, createScaleTweenMovie} from "../utils/miscFunctions";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
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

export class MkIntroScene extends MkAbstractScene {

    private fnt:Font;
    private logoLink:ResourceLink<ITexture>;
    private soundLink:ResourceLink<void>;

    public onPreloading(): void {
        super.onPreloading();

        this.fnt = new Font(this.game,{fontSize: 80, fontFamily: 'MK4'});
        this.fnt.fontColor = Color.RGB(110,111,10);

        this.logoLink = this.resourceLoader.loadTexture('./mk-alfa/assets/images/mkLogo.png');
        this.soundLink = this.resourceLoader.loadSound('./mk-alfa/assets/sounds/btn.wav');

    }

    public onReady(): void {

        super.onReady();

        this.on(MOUSE_EVENTS.click, ()=>{
            this.game.getRenderer().requestFullScreen();
        });


        const img:Image = new Image(this.game);
        img.setResourceLink(this.logoLink);
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

        const nullContainer:NullGameObject = new NullGameObject(this.game);
        nullContainer.filters = [createGlowTweenFilter(this.game,Color.RGB(122,122,12),5,8,1000)];
        this.appendChild(nullContainer);


        const tf:TextField = new TextField(this.game);
        tf.setFont(this.fnt);
        tf.setTextAlign(TEXT_ALIGN.CENTER);
        tf.setWordBreak(WORD_BRAKE.PREDEFINED);
        tf.pos.setXY(200,200);
        tf.setText("Secret Santa \nAlfa 2019\n\n\nPress any key");
        nullContainer.appendChild(tf);

        this.setInterval(()=>{
            if (MathEx.randomInt(0,50)<25) this.game.camera.shake(5,200);
        },1000);

        const snd:Sound = new Sound(this.game);
        snd.setResourceLink(this.soundLink);
        this.on(GAME_PAD_EVENTS.buttonPressed, (e:IGamePadEvent)=>{
            snd.play();
            this.game.runScene(new MkSelectHeroScene(this.game),new CurtainsOpeningTransition(this.game));
        });
        this.on(KEYBOARD_EVENTS.keyPressed, ()=>{
            snd.play();
            this.game.runScene(new MkSelectHeroScene(this.game),new CurtainsOpeningTransition(this.game));
        });


    }


}

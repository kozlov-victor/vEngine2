import {Scene} from "@engine/scene/scene";
import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {Game} from "@engine/core/game";
import {VEngineTsxDOMRenderer} from "@engine/renderable/tsx/vEngine/vEngineTsxDOMRenderer";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Assets} from "../asset/assets";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {Color} from "@engine/renderer/common/color";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {AnimatedTextField} from "@engine/renderable/impl/ui/textField/animated/animatedTextField";
import {AppearRandomLetterTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/appearRandomLetterTextAnimation";
import {singleton, waitFor} from "../helper";
import {FallLettersTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/fallLettersTextAnimation";
import {AppearFromRandomPointTextAnimation} from "@engine/renderable/impl/ui/textField/animated/textAnimation/appearFromRandomPointTextAnimation";
import {BgMatrix} from "../component/bgMatrix";
import {QuizScene} from "./quizScene";
import {Flip3dHorizontalInTransition} from "@engine/scene/transition/flip/flip3dTransition";

class IntroSceneUI extends VEngineTsxComponent {

    private textField:AnimatedTextField;
    private started:boolean = false;

    constructor(private game:Game,private assets:Assets) {
        super(new VEngineTsxDOMRenderer(game));
    }

    public render():VirtualNode {
        return (
            <>
                <BgMatrix/>
                <v_animatedTextField
                    click={()=>this.start()}
                    ref={(it:any)=>this.textField = it as AnimatedTextField}
                    size={{width:this.game.width,height:this.game.height}}
                    alignTextContentVertical={AlignTextContentVertical.CENTER}
                    alignTextContentHorizontal={AlignTextContentHorizontal.CENTER}
                    alignText={AlignText.CENTER}
                    textColor={{r:0,g:0,b:0,a:0}}
                    wordBrake={WordBrake.PREDEFINED}
                    font={this.assets.font} text={'Математична вікторина\nДля учнів всіх класів'}
                />
            </>
        );
    }

    public override onMounted() {
        this.textField.setTextWithAnimation(this.textField.getText(),new AppearRandomLetterTextAnimation(2000));
    }

    private async start() {
        if (this.started) return;
        this.started = true;
        const message = 'Готовність номер';
        this.textField.setTextWithAnimation(`${message} 3`,new AppearFromRandomPointTextAnimation(50,100,100));
        await waitFor(5000);
        this.textField.setTextWithAnimation(`${message} 2`,new AppearFromRandomPointTextAnimation(50,100,100));
        await waitFor(5000);
        this.textField.setTextWithAnimation(`${message} 1`,new AppearFromRandomPointTextAnimation(50,100,100));
        await waitFor(5000);
        this.textField.setTextWithAnimation(`${message} 1`,new FallLettersTextAnimation(1,1000,1000));
        await waitFor(5000);
        const transition = new Flip3dHorizontalInTransition(this.game,false);
        transition.setBackgroundColor(Color.GREY.clone());
        this.game.runScene(new QuizScene(this.game),transition);
    }

}


export class IntroScene extends Scene {

    private assets:Assets = singleton(Assets.name,()=>new Assets(this));

    constructor(game:Game) {
        super(game);
        this.backgroundColor = Color.BLACK.clone();
        this.mouseEventHandler.once(MOUSE_EVENTS.click, _=>{
            this.game.getRenderer().requestFullScreen();
        })
    }

    public override onReady() {
        const root = new SimpleGameObjectContainer(this.game);
        this.appendChild(root);
        const mainSceneUI = new IntroSceneUI(this.game,this.assets);
        mainSceneUI.mountTo(root);
    }
}

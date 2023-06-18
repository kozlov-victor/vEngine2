import {Scene} from "@engine/scene/scene";
import {Game} from "@engine/core/game";
import {Assets} from "../asset/assets";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {BgMatrix} from "../component/bgMatrix";
import {AnswerButton} from "../component/answerButton";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {waitFor} from "../helper";
import {Color} from "@engine/renderer/common/color";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IntroScene} from "./introScene";
import {Flip3dVerticalInTransition} from "@engine/scene/transition/flip/flip3dTransition";
import {Resource} from "@engine/resources/resourceDecorators";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {VEngineRootComponent} from "@engine/renderable/tsx/vEngine/vEngineRootComponent";
import {Reactive} from "@engine/renderable/tsx/genetic/reactive";

class SelectLevelSceneUI extends VEngineRootComponent {

    private currentButton:number|undefined = undefined;
    private answerSelected:boolean = false;


    constructor(game: Game) {
        super(game);
    }

    public render(): JSX.Element {
        return (
            <>
                <BgMatrix/>
                <AnswerButton
                    click={()=>this.onAnswerClick(0)}
                    pos={{x:280,y:110}}
                    lightUpState={this.resolveLightUpButtonState(0)}
                    text={'6 клас'}/>
                <AnswerButton
                    click={()=>this.onAnswerClick(1)}
                    pos={{x:280,y:310}}
                    lightUpState={this.resolveLightUpButtonState(1)}
                    text={'9 клас'}/>
            </>
        );
    }

    @Reactive.Method()
    private onAnswerClick(answer:number):void {
        if (this.answerSelected) return;
        this.currentButton = answer;
    }

    @Reactive.Method()
    public onUpBtnClicked():void {
        if (this.answerSelected) return;
        if (this.currentButton===undefined) this.currentButton = 0;
        else if (this.currentButton===1) this.currentButton = 0;
        Assets.getInstance().btn1Sound.play();
    }

    @Reactive.Method()
    public onDownBtnClicked():void {
        if (this.answerSelected) return;
        if (this.currentButton===undefined) this.currentButton = 0;
        else if (this.currentButton===0) this.currentButton = 1;
        Assets.getInstance().btn1Sound.play();
    }

    public async onAnswerSelected() {
        if (this.currentButton===undefined) return;
        if (this.answerSelected) return;
        this.answerSelected = true;
        Assets.getInstance().selectedSound.play();
        await waitFor(100);
        const transition = new Flip3dVerticalInTransition(this.game,false);
        transition.setBackgroundColor(Color.GREY.clone());
        this.game.runScene(new IntroScene(this.game,this.currentButton as number),transition);
    }

    private resolveLightUpButtonState(answer:number):'active'|undefined {
        if (answer===this.currentButton) return 'active';
        else return undefined;
    }


}

export class SelectLevelScene extends Scene {

    @Resource.ResourceHolder() public readonly assets:Assets;

    constructor(game:Game) {
        super(game);
        this.backgroundColor = Color.BLACK.clone();
        this.mouseEventHandler.once(MOUSE_EVENTS.click, _=>{
            this.game.getRenderer().requestFullScreen();
        });
    }

    override onReady() {
        super.onReady();
        const root = new SimpleGameObjectContainer(this.game);
        this.appendChild(root);
        const selectLevelSceneUI = new SelectLevelSceneUI(this.game);
        selectLevelSceneUI.mountTo(root);
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, k=>{
            switch (k.button) {
                case KEYBOARD_KEY.UP: {
                    selectLevelSceneUI.onUpBtnClicked();
                    break;
                }
                case KEYBOARD_KEY.DOWN: {
                    selectLevelSceneUI.onDownBtnClicked();
                    break;
                }
                case KEYBOARD_KEY.ENTER: {
                    selectLevelSceneUI.onAnswerSelected();
                    break;
                }
            }
        })
    }

}

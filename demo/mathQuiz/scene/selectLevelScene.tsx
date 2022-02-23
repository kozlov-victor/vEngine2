import {Scene} from "@engine/scene/scene";
import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {Game} from "@engine/core/game";
import {Assets} from "../asset/assets";
import {VEngineTsxDOMRenderer} from "@engine/renderable/tsx/vEngine/vEngineTsxDOMRenderer";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {BgMatrix} from "../component/bgMatrix";
import {AnswerButton} from "../component/answerButton";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {waitFor} from "../helper";
import {Color} from "@engine/renderer/common/color";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IntroScene} from "./introScene";
import {Flip3dVerticalInTransition} from "@engine/scene/transition/flip/flip3dTransition";
import {Resource} from "@engine/resources/resourceDecorators";

class SelectLevelSceneUI extends VEngineTsxComponent {

    private currentButton:number|undefined = undefined;
    private answerSelected:boolean = false;

    constructor(private game:Game, private assets:Assets) {
        super(new VEngineTsxDOMRenderer(game));
    }

    public render(): VirtualNode {
        return (
            <>
                <BgMatrix/>
                <AnswerButton
                    click={()=>this.onAnswerClick(0)}
                    assets={this.assets}
                    pos={{x:280,y:110}}
                    lightUpState={this.resolveLightUpButtonState(0)}
                    text={'6 клас'}/>
                <AnswerButton
                    click={()=>this.onAnswerClick(1)}
                    assets={this.assets}
                    pos={{x:280,y:310}}
                    lightUpState={this.resolveLightUpButtonState(1)}
                    text={'9 клас'}/>
            </>
        );
    }

    @ReactiveMethod()
    private onAnswerClick(answer:number):void {
        if (this.answerSelected) return;
        this.currentButton = answer;
    }

    @ReactiveMethod()
    public onUpBtnClicked():void {
        if (this.answerSelected) return;
        if (this.currentButton===undefined) this.currentButton = 0;
        else if (this.currentButton===1) this.currentButton = 0;
        this.assets.btn1Sound.play();
    }

    @ReactiveMethod()
    public onDownBtnClicked():void {
        if (this.answerSelected) return;
        if (this.currentButton===undefined) this.currentButton = 0;
        else if (this.currentButton===0) this.currentButton = 1;
        this.assets.btn1Sound.play();
    }

    public async onAnswerSelected() {
        if (this.currentButton===undefined) return;
        if (this.answerSelected) return;
        this.answerSelected = true;
        this.assets.selectedSound.play();
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

    @Resource.ResourceHolder() private assets:Assets;

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
        const selectLevelSceneUI = new SelectLevelSceneUI(this.game,this.assets);
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

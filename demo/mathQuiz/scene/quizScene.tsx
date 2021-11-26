import {Scene} from "@engine/scene/scene";
import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {Assets} from "../asset/assets";
import {singleton} from "../helper";
import {Game} from "@engine/core/game";
import {VEngineTsxDOMRenderer} from "@engine/renderable/tsx/vEngine/vEngineTsxDOMRenderer";
import {BgMatrix} from "../component/bgMatrix";
import {Color} from "@engine/renderer/common/color";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {
    AlignText,
    AlignTextContentHorizontal,
    AlignTextContentVertical,
    WordBrake
} from "@engine/renderable/impl/ui/textField/textAlign";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {AnswerButton} from "../component/answerButton";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";
import {KEYBOARD_EVENTS} from "@engine/control/keyboard/keyboardEvents";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";


class QuizSceneUI extends VEngineTsxComponent {

    private currentButton:0|1|2|3|undefined = 0;

    private textFieldBg:Rectangle = (()=>{
        const rect = new Rectangle(this.game);
        rect.fillColor = Color.fromCssLiteral(`rgba(40, 40, 40, 0.53)`);
        rect.borderRadius = 15;
        return rect;
    })();

    constructor(private game:Game, private assets:Assets) {
        super(new VEngineTsxDOMRenderer(game));
    }

    override render(): VirtualNode {
        return (
            <>
                <BgMatrix/>
                <v_textField
                    background={()=>this.textFieldBg}
                    size={{width:this.game.width,height:this.game.height-300}}
                    alignTextContentVertical={AlignTextContentVertical.CENTER}
                    alignTextContentHorizontal={AlignTextContentHorizontal.CENTER}
                    alignText={AlignText.CENTER}
                    margin={[20]}
                    textColor={{r:0,g:0,b:0,a:0}}
                    wordBrake={WordBrake.PREDEFINED}
                    font={this.assets.font} text={'Задача номер 1 123123 вамвамвам'}
                />
                <AnswerButton click={()=>this.onAnswerClick(0)} assets={this.assets} pos={{x:100,y:300}} active={this.currentButton===0} text={'answer 1'}/>
                <AnswerButton click={()=>this.onAnswerClick(1)} assets={this.assets} pos={{x:520,y:300}} active={this.currentButton===1} text={'answer 2'}/>
                <AnswerButton click={()=>this.onAnswerClick(2)} assets={this.assets} pos={{x:100,y:450}} active={this.currentButton===2} text={'answer 3'}/>
                <AnswerButton click={()=>this.onAnswerClick(3)} assets={this.assets} pos={{x:520,y:450}} active={this.currentButton===3} text={'answer 4'}/>
            </>
        );
    }

    @ReactiveMethod()
    private onAnswerClick(btnIndex:0|1|2|3):void {
        this.currentButton = btnIndex;
    }

    @ReactiveMethod()
    public onLeftBtnClicked():void {
        if (this.currentButton===1) this.currentButton = 0;
        else if (this.currentButton===3) this.currentButton = 2;
        else if (this.currentButton===undefined) this.currentButton = 0;
    }

    @ReactiveMethod()
    public onRightBtnClicked():void {
        if (this.currentButton===0) this.currentButton = 1;
        else if (this.currentButton===2) this.currentButton = 3;
        else if (this.currentButton===undefined) this.currentButton = 0;
    }

    @ReactiveMethod()
    public onDownBtnClicked():void {
        if (this.currentButton===0) this.currentButton = 2;
        else if (this.currentButton===1) this.currentButton = 3;
        else if (this.currentButton===undefined) this.currentButton = 0;
    }

    @ReactiveMethod()
    public onUpBtnClicked():void {
        if (this.currentButton===2) this.currentButton = 0;
        else if (this.currentButton===3) this.currentButton = 1;
        else if (this.currentButton===undefined) this.currentButton = 0;
    }


}

export class QuizScene extends Scene {

    private assets:Assets = singleton(Assets.name,()=>new Assets(this));

    constructor(game:Game) {
        super(game);
        this.backgroundColor = Color.BLACK.clone();
    }

    public override onReady() {
        const root = new SimpleGameObjectContainer(this.game);
        this.appendChild(root);
        const mainSceneUI = new QuizSceneUI(this.game,this.assets);
        mainSceneUI.mountTo(root);
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, k=>{
            switch (k.key) {
                case KEYBOARD_KEY.UP: {
                    mainSceneUI.onUpBtnClicked();
                    break;
                }
                case KEYBOARD_KEY.DOWN: {
                    mainSceneUI.onDownBtnClicked();
                    break;
                }
                case KEYBOARD_KEY.LEFT: {
                    mainSceneUI.onLeftBtnClicked();
                    break;
                }
                case KEYBOARD_KEY.RIGHT: {
                    mainSceneUI.onRightBtnClicked();
                    break;
                }
            }
        })
    }

}

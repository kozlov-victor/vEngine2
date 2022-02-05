import {Scene} from "@engine/scene/scene";
import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {Assets} from "../asset/assets";
import {singleton, waitFor, waitForKey} from "../helper";
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
import {IQuizQuestion, QuizRunner} from "../quizRunner";
import {DATA} from "../asset/resource/questions";
import {ResultScene} from "./resultScene";
import {Flip3dHorizontalInTransition} from "@engine/scene/transition/flip/flip3dTransition";
import {ColorFactory} from "@engine/renderer/common/colorFactory";


class QuizSceneUI extends VEngineTsxComponent {

    private currentButton:0|1|2|3|undefined = undefined;
    private answerSelected:boolean = false;
    private answerBlink:boolean = false;
    private questionBlink:boolean = false;
    private correctAnswer:0|1|2|3|undefined = undefined;

    private quizRunner:QuizRunner;
    private currentQuestion:IQuizQuestion;

    private textFieldBg:Rectangle = (()=>{
        const rect = new Rectangle(this.game);
        rect.fillColor = ColorFactory.fromCSS(`rgba(40, 40, 40, 0.53)`);
        rect.borderRadius = 15;
        return rect;
    })();

    private textFieldBgBlinked:Rectangle = (()=>{
        const rect = new Rectangle(this.game);
        rect.fillColor = ColorFactory.fromCSS(`rgba(146, 255, 48, 0.75)`);
        rect.borderRadius = 15;
        return rect;
    })();

    constructor(private game:Game, private assets:Assets,level:number) {
        super(new VEngineTsxDOMRenderer(game));
        this.quizRunner = new QuizRunner(DATA(),level);
        this.nextQuestion().catch(e=>console.log(e));
    }

    private async nextQuestion():Promise<void> {
        if (this.quizRunner.hasNextQuestion()) {
            this.assets.startSound.play();
            this.currentQuestion = this.quizRunner.nextQuestion();
            this.currentButton = undefined;
            this.answerSelected = false;
            this.answerBlink = false;
            this.correctAnswer = undefined;
            for (let i=0;i<7;i++) {
                this.triggerRendering();
                await waitFor(100);
                this.questionBlink = !this.questionBlink;
            }
            this.questionBlink = false;
        } else {
            await waitFor(3000);
            this.game.runScene(
                new ResultScene(this.game,this.quizRunner.getCorrectAnswersNum(),this.quizRunner.questions.length),
                new Flip3dHorizontalInTransition(this.game,false)
            )
        }
    }

    private resolveLightUpButtonState(index:number):'blink'|'correct'|'incorrect'|'active'|undefined{
        let state:'blink'|'correct'|'incorrect'|'active'|undefined = undefined;
        if (index===this.currentButton) state = 'active';
        if (index===this.currentButton && this.answerBlink) state = 'blink';
        if (index===this.currentButton && this.correctAnswer!==undefined && this.currentButton!==this.correctAnswer) state = 'incorrect';
        if (index===this.correctAnswer) state = 'correct';
        return state;
    }

    public override render(): VirtualNode {
        return (
            <>
                <BgMatrix/>
                <v_textField
                    font={this.assets.font}
                    pos={{x:0,y:0}}
                    scale={{x:0.5,y:0.5}}
                    autoSize={true}
                    text={'>> Питання '+this.quizRunner.getCurrentQuestionIndex()+` із ${this.quizRunner.questions.length} <<`}
                />
                <v_textField
                    background={()=>this.questionBlink?this.textFieldBgBlinked:this.textFieldBg}
                    size={{width:this.game.width,height:this.game.height-300}}
                    alignTextContentVertical={AlignTextContentVertical.CENTER}
                    alignTextContentHorizontal={AlignTextContentHorizontal.CENTER}
                    alignText={AlignText.CENTER}
                    margin={[20]}
                    textColor={{r:0,g:0,b:0,a:0}}
                    wordBrake={WordBrake.FIT}
                    font={this.assets.font}
                    text={this.currentQuestion.text}
                />
                <AnswerButton
                    click={()=>this.onAnswerClick(0)}
                    assets={this.assets}
                    pos={{x:100,y:300}}
                    lightUpState={this.resolveLightUpButtonState(0)}
                    text={this.currentQuestion.answers[0].text}/>
                <AnswerButton
                    click={()=>this.onAnswerClick(1)}
                    assets={this.assets} pos={{x:520,y:300}}
                    lightUpState={this.resolveLightUpButtonState(1)}
                    text={this.currentQuestion.answers[1].text}/>
                <AnswerButton
                    click={()=>this.onAnswerClick(2)}
                    assets={this.assets} pos={{x:100,y:450}}
                    lightUpState={this.resolveLightUpButtonState(2)}
                    text={this.currentQuestion.answers[2].text}/>
                <AnswerButton
                    click={()=>this.onAnswerClick(3)}
                    assets={this.assets}
                    pos={{x:520,y:450}}
                    lightUpState={this.resolveLightUpButtonState(3)}
                    text={this.currentQuestion.answers[3].text}/>
            </>
        );
    }

    @ReactiveMethod()
    private onAnswerClick(btnIndex:0|1|2|3):void {
        if (this.answerSelected) return;
        this.currentButton = btnIndex;
    }

    @ReactiveMethod()
    public onLeftBtnClicked():void {
        if (this.answerSelected) return;
        if (this.currentButton===1) this.currentButton = 0;
        else if (this.currentButton===3) this.currentButton = 2;
        else if (this.currentButton===undefined) this.currentButton = 0;
        this.assets.btn1Sound.play();
    }

    @ReactiveMethod()
    public onRightBtnClicked():void {
        if (this.answerSelected) return;
        if (this.currentButton===0) this.currentButton = 1;
        else if (this.currentButton===2) this.currentButton = 3;
        else if (this.currentButton===undefined) this.currentButton = 0;
        this.assets.btn1Sound.play();
    }

    @ReactiveMethod()
    public onDownBtnClicked():void {
        if (this.answerSelected) return;
        if (this.currentButton===0) this.currentButton = 2;
        else if (this.currentButton===1) this.currentButton = 3;
        else if (this.currentButton===undefined) this.currentButton = 0;
        this.assets.btn1Sound.play();
    }

    @ReactiveMethod()
    public onUpBtnClicked():void {
        if (this.answerSelected) return;
        if (this.currentButton===2) this.currentButton = 0;
        else if (this.currentButton===3) this.currentButton = 1;
        else if (this.currentButton===undefined) this.currentButton = 0;
        this.assets.btn1Sound.play();
    }

    @ReactiveMethod()
    public async onAnswerSelected() {
        if (this.currentButton===undefined) {
            this.assets.btn1Sound.play();
            return;
        }
        if (this.answerSelected) return;
        this.assets.selectedSound.play();
        this.answerSelected = true;
        for (let i=0;i<13;i++) {
            this.triggerRendering();
            await waitFor(200);
            this.answerBlink = !this.answerBlink;
        }
        this.answerBlink = true;
        this.triggerRendering();
        await waitFor(3000);
        this.correctAnswer = this.currentQuestion.answers.findIndex(it=>it.correct) as 0|1|2|3;
        if (this.correctAnswer===this.currentButton) {
            this.quizRunner.setAsCorrect();
            this.assets.successSound.play();
        } else {
            this.assets.failSound.play();
        }
        this.triggerRendering();
        await waitForKey(this.game,KEYBOARD_KEY.SPACE);
        this.nextQuestion();
    }


}

export class QuizScene extends Scene {

    private assets:Assets = singleton(Assets.name,()=>new Assets(this));

    constructor(game:Game, private level:number) {
        super(game);
        this.backgroundColor = Color.BLACK.clone();
    }

    public override onReady() {
        const root = new SimpleGameObjectContainer(this.game);
        this.appendChild(root);
        const mainSceneUI = new QuizSceneUI(this.game,this.assets,this.level);
        mainSceneUI.mountTo(root);
        this.keyboardEventHandler.on(KEYBOARD_EVENTS.keyPressed, k=>{
            switch (k.button) {
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
                case KEYBOARD_KEY.ENTER: {
                    mainSceneUI.onAnswerSelected();
                    break;
                }
            }
        })
    }

}

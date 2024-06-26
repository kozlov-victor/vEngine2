import {Scene} from "@engine/scene/scene";
import {VEngineTsxFactory} from "@engine/renderable/tsx/_genetic/vEngineTsxFactory.h";
import {Assets} from "../asset/assets";
import {waitFor, waitForKey} from "../helper";
import {Game} from "@engine/core/game";
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
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {IQuizQuestion, QuizRunner} from "../quizRunner";
import {DATA} from "../asset/resource/questions";
import {ResultScene} from "./resultScene";
import {Flip3dHorizontalInTransition} from "@engine/scene/transition/flip/flip3dTransition";
import {ColorFactory} from "@engine/renderer/common/colorFactory";
import {Resource} from "@engine/resources/resourceDecorators";
import {KEYBOARD_EVENTS} from "@engine/control/abstract/keyboardEvents";
import {VEngineRootComponent} from "@engine/renderable/tsx/vEngine/vEngineRootComponent";
import {Reactive} from "@engine/renderable/tsx/decorator/reactive";
import {DI} from "@engine/core/ioc";

@DI.Injectable()
class QuizSceneUI extends VEngineRootComponent {

    private currentButton:0|1|2|3|undefined = undefined;
    @Reactive.Property() private answerSelected:boolean = false;
    @Reactive.Property() private answerBlink:boolean = false;
    @Reactive.Property() private questionBlink:boolean = false;
    @Reactive.Property() private correctAnswer:0|1|2|3|undefined = undefined;

    private quizRunner:QuizRunner;
    private currentQuestion:IQuizQuestion;

    @DI.Inject(Assets) private assets:Assets;

    private textFieldBg = (()=>{
        const rect = new Rectangle(this.game);
        rect.fillColor = ColorFactory.fromCSS(`rgba(40, 40, 40, 0.53)`);
        rect.borderRadius = 15;
        return rect;
    })();

    private textFieldBgBlinked = (()=>{
        const rect = new Rectangle(this.game);
        rect.fillColor = ColorFactory.fromCSS(`rgba(146, 255, 48, 0.75)`);
        rect.borderRadius = 15;
        return rect;
    })();

    constructor(game:Game, level:number) {
        super(game);
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
                //this.triggerRendering();
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

    public override render() {
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
                    pos={{x:100,y:300}}
                    lightUpState={this.resolveLightUpButtonState(0)}
                    text={this.currentQuestion.answers[0].text}/>
                <AnswerButton
                    click={()=>this.onAnswerClick(1)}
                    pos={{x:520,y:300}}
                    lightUpState={this.resolveLightUpButtonState(1)}
                    text={this.currentQuestion.answers[1].text}/>
                <AnswerButton
                    click={()=>this.onAnswerClick(2)}
                    pos={{x:100,y:450}}
                    lightUpState={this.resolveLightUpButtonState(2)}
                    text={this.currentQuestion.answers[2].text}/>
                <AnswerButton
                    click={()=>this.onAnswerClick(3)}
                    pos={{x:520,y:450}}
                    lightUpState={this.resolveLightUpButtonState(3)}
                    text={this.currentQuestion.answers[3].text}/>
            </>
        );
    }

    @Reactive.Method()
    private onAnswerClick(btnIndex:0|1|2|3):void {
        if (this.answerSelected) return;
        this.currentButton = btnIndex;
    }

    @Reactive.Method()
    public onLeftBtnClicked():void {
        if (this.answerSelected) return;
        if (this.currentButton===1) this.currentButton = 0;
        else if (this.currentButton===3) this.currentButton = 2;
        else if (this.currentButton===undefined) this.currentButton = 0;
        this.assets.btn1Sound.play();
    }

    @Reactive.Method()
    public onRightBtnClicked():void {
        if (this.answerSelected) return;
        if (this.currentButton===0) this.currentButton = 1;
        else if (this.currentButton===2) this.currentButton = 3;
        else if (this.currentButton===undefined) this.currentButton = 0;
        this.assets.btn1Sound.play();
    }

    @Reactive.Method()
    public onDownBtnClicked():void {
        if (this.answerSelected) return;
        if (this.currentButton===0) this.currentButton = 2;
        else if (this.currentButton===1) this.currentButton = 3;
        else if (this.currentButton===undefined) this.currentButton = 0;
        this.assets.btn1Sound.play();
    }

    @Reactive.Method()
    public onUpBtnClicked():void {
        if (this.answerSelected) return;
        if (this.currentButton===2) this.currentButton = 0;
        else if (this.currentButton===3) this.currentButton = 1;
        else if (this.currentButton===undefined) this.currentButton = 0;
        this.assets.btn1Sound.play();
    }

    @Reactive.Method()
    public async onAnswerSelected() {
        if (this.currentButton===undefined) {
            this.assets.btn1Sound.play();
            return;
        }
        if (this.answerSelected) return;
        this.assets.selectedSound.play();
        this.answerSelected = true;
        for (let i=0;i<13;i++) {
            //this.triggerRendering();
            await waitFor(200);
            this.answerBlink = !this.answerBlink;
        }
        this.answerBlink = true;
        //this.triggerRendering();
        await waitFor(3000);
        this.correctAnswer = this.currentQuestion.answers.findIndex(it=>it.correct) as 0|1|2|3;
        if (this.correctAnswer===this.currentButton) {
            this.quizRunner.setAsCorrect();
            this.assets.successSound.play();
        } else {
            this.assets.failSound.play();
        }
        //this.triggerRendering();
        await waitForKey(this.game,KEYBOARD_KEY.SPACE);
        this.nextQuestion();
    }


}

export class QuizScene extends Scene {

    @Resource.ResourceHolder() public readonly assets:Assets;

    constructor(game:Game, private level:number) {
        super(game);
        this.backgroundColor = Color.BLACK.clone();
    }

    public override onReady() {
        const root = new SimpleGameObjectContainer(this.game);
        this.appendChild(root);
        const mainSceneUI = new QuizSceneUI(this.game,this.level);
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

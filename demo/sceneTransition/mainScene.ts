import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {PushTransition} from "@engine/scene/transition/move/pushTransition";
import {SIDE} from "@engine/scene/transition/move/side";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font";
import {SecondScene} from "./secondScene";
import {PopTransition} from "@engine/scene/transition/move/popTransition";
import {EasingBounce} from "@engine/misc/easing/functions/bounce";
import {SlideTransition} from "@engine/scene/transition/move/slideTransition";
import {CurtainsOpeningTransition} from "@engine/scene/transition/appear/curtains/curtainsOpeningTransition";
import {CurtainsClosingTransition} from "@engine/scene/transition/appear/curtains/curtainsClosingTransition";
import {
    CellsAppearingTransition,
    CellsDisappearingTransition
} from "@engine/scene/transition/appear/cells/cellsAppearingTransition";
import {TextField} from "@engine/renderable/impl/ui2/textField/simple/textField";


export class MainScene extends Scene {

    private fnt:Font;
    public colorBG: Color = Color.RGB(233);
    private btnPos:number=0;

    public onPreloading(){
        const fnt:Font = new Font(this.game,{fontSize: 25,});
        this.fnt = fnt;
    }


    public onReady() {

        this.createPushTransitionButton('push to Top',SIDE.TOP);
        this.createPushTransitionButton('push to Bottom',SIDE.BOTTOM);
        this.createPushTransitionButton('push to Left',SIDE.LEFT);
        this.createPushTransitionButton('push to Right',SIDE.RIGHT);

        this.createPopTransitionButton('pop to Top',SIDE.TOP);
        this.createPopTransitionButton('pop to Bottom',SIDE.BOTTOM);
        this.createPopTransitionButton('pop to Left',SIDE.LEFT);
        this.createPopTransitionButton('pop to Right',SIDE.RIGHT);

        this.createSlideTransitionButton('slide to top',SIDE.TOP);
        this.createSlideTransitionButton('slide to bottom',SIDE.BOTTOM);
        this.createSlideTransitionButton('slide to left',SIDE.LEFT);
        this.createSlideTransitionButton('slide to right',SIDE.RIGHT);

        this.createCurtainTransitionButton('open curtains (long test string)',true);
        this.createCurtainTransitionButton('close curtains (long test string)',false);

        this.createCellTransitionButton('cell appearing',true);
        this.createCellTransitionButton('cell disappearing',false);

    }

    private createTransitionButton(text:string,transition:ISceneTransition){
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.textColor.setRGB(10);
        tf.pos.setXY(10,this.btnPos+=45);
        tf.size.setWH(this.game.width,30);
        tf.setText(text);
        tf.setFont(this.fnt);
        tf.on(MOUSE_EVENTS.click, e=>{
            this.game.pushScene(new SecondScene(this.game),transition);
        });
        this.appendChild(tf);
    }

    private createPushTransitionButton(text:string,side:SIDE){
        const transition:ISceneTransition = new PushTransition(this.game,side,1000,EasingBounce.Out);
        this.createTransitionButton(text,transition);
    }

    private createPopTransitionButton(text:string,side:SIDE){
        const transition:ISceneTransition = new PopTransition(this.game,side,1000,EasingBounce.Out);
        this.createTransitionButton(text,transition);
    }

    private createSlideTransitionButton(text:string,side:SIDE){
        const transition:ISceneTransition = new SlideTransition(this.game,side,1000,EasingBounce.Out);
        this.createTransitionButton(text,transition);
    }

    private createCurtainTransitionButton(text:string,isOpening:boolean){
        const transition:ISceneTransition =
            isOpening?
            new CurtainsOpeningTransition(this.game,1000,EasingBounce.Out):
            new CurtainsClosingTransition(this.game,1000,EasingBounce.Out);
        this.createTransitionButton(text,transition);
    }

    private createCellTransitionButton(text:string,isAppearing:boolean){
        const transition:ISceneTransition =
            isAppearing?
                new CellsAppearingTransition(this.game,1000):
                new CellsDisappearingTransition(this.game,1000);
        this.createTransitionButton(text,transition);
    }

}

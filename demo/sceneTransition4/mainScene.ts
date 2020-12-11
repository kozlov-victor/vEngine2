import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font";
import {SecondScene} from "./secondScene";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {EasingSine} from "@engine/misc/easing/functions/sine";
import {
    SizeWidthInAppearanceTransition,
    SizeWidthOutAppearanceTransition
} from "@engine/scene/transition/appear/size/abstractSizeWidthAppearanceTransition";
import {
    SizeHeightInAppearanceTransition,
    SizeHeightOutAppearanceTransition
} from "@engine/scene/transition/appear/size/abstractSizeHeightAppearanceTransition";
import {
    TurnThePageBackwardTransition,
    TurnThePageForwardTransition
} from "@engine/scene/transition/appear/page/turnThePageAppearanceTransition";
import {
    TurnThePageVerticalBackwardTransition,
    TurnThePageVerticalForwardTransition
} from "@engine/scene/transition/appear/page/turnThePageVerticalAppearanceTransition";


export class MainScene extends Scene {

    private fnt:Font;
    public backgroundColor: Color = Color.RGB(233);
    private btnPos:number=100;

    public onPreloading():void{

        this.fnt = new Font(this.game, {fontSize: 25});
    }


    public onReady():void {


        this.createSizeWidthTransitionButton('size width in',true);
        this.createSizeWidthTransitionButton('size width out',false);

        this.createSizeHeightTransitionButton('size height in',true);
        this.createSizeHeightTransitionButton('size height out',false);

        this.createTurnPageTransitionButton('turn the next page -----   ---- --- >>>',true);
        this.createTurnPageTransitionButton('turn the prev page -----   ---- --- >>>',false);

        this.createTurnPageVerticalTransitionButton('turn the next page (vertical)',true);
        this.createTurnPageVerticalTransitionButton('turn the prev page (vertical)',false);

    }

    private createTurnPageTransitionButton(text:string,isAppearing:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new TurnThePageForwardTransition(this.game,1000, EasingSine.Out):
                new TurnThePageBackwardTransition(this.game,1000, EasingSine.Out);
        this.createTransitionButton(text,transition);
    }

    private createTurnPageVerticalTransitionButton(text:string,isAppearing:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new TurnThePageVerticalForwardTransition(this.game,1000, EasingSine.Out):
                new TurnThePageVerticalBackwardTransition(this.game,1000, EasingSine.Out);
        this.createTransitionButton(text,transition);
    }


    private createSizeWidthTransitionButton(text:string,isAppearing:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new SizeWidthInAppearanceTransition(this.game,1000, EasingSine.InOut):
                new SizeWidthOutAppearanceTransition(this.game,1000, EasingSine.InOut);
        this.createTransitionButton(text,transition);
    }

    private createSizeHeightTransitionButton(text:string,isAppearing:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new SizeHeightInAppearanceTransition(this.game,1000, EasingSine.InOut):
                new SizeHeightOutAppearanceTransition(this.game,1000, EasingSine.InOut);
        this.createTransitionButton(text,transition);
    }

    private createTransitionButton(text:string,transition:ISceneTransition):void{
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.textColor.setRGB(10);
        tf.pos.setXY(10,this.btnPos+=45);
        tf.size.setWH(this.game.width,30);
        tf.setText(text);
        tf.on(MOUSE_EVENTS.click, e=>{
            this.game.pushScene(new SecondScene(this.game),transition);
        });
        this.appendChild(tf);
    }


}

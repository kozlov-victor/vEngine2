import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font";
import {TextField} from "@engine/renderable/impl/ui/components/textField";
import {SecondScene} from "./secondScene";
import {EasingBounce} from "@engine/misc/easing/functions/bounce";
import {
    ScaleInAppearanceTransition,
    ScaleOutAppearanceTransition
} from "@engine/scene/transition/appear/scale/scaleAppearanceTransition";
import {
    FadeInAppearanceTransition,
    FadeOutAppearanceTransition
} from "@engine/scene/transition/appear/fade/fadeAppearanceTransition";
import {EasingLinear} from "@engine/misc/easing/functions/linear";


export class MainScene extends Scene {

    public fnt!:Font;
    public colorBG: Color = Color.RGB(233);
    private btnPos:number=0;

    public onPreloading(){

        const fnt:Font = new Font(this.game);
        fnt.fontSize = 25;
        fnt.fontFamily = 'monospace';
        fnt.fontColor = Color.RGB(10);
        fnt.generate();
        this.fnt = fnt;
    }


    public onReady() {

        this.createFadeTransitionButton('fade in',true);
        this.createFadeTransitionButton('fade out',false);
        this.createScaleTransitionButton('scale in',true);
        this.createScaleTransitionButton('scale out',false);
    }

    private createFadeTransitionButton(text:string,isAppearing:boolean){
        const transition:ISceneTransition =
            isAppearing?
                new FadeInAppearanceTransition(this.game,1000,EasingLinear):
                new FadeOutAppearanceTransition(this.game,1000,EasingLinear);
        this.createTransitionButton(text,transition);
    }

    private createScaleTransitionButton(text:string,isAppearing:boolean){
        const transition:ISceneTransition =
            isAppearing?
                new ScaleInAppearanceTransition(this.game,1000,EasingBounce.Out):
                new ScaleOutAppearanceTransition(this.game,1000,EasingBounce.Out);
        this.createTransitionButton(text,transition);
    }

    private createTransitionButton(text:string,transition:ISceneTransition){
        const tf:TextField = new TextField(this.game);
        tf.pos.setXY(10,this.btnPos+=45);
        tf.setText(text);
        tf.setFont(this.fnt);
        tf.on(MOUSE_EVENTS.click, e=>{
            this.game.pushScene(new SecondScene(this.game),transition);
        });
        this.appendChild(tf);
    }

}

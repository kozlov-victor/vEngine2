import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {PushTransition} from "@engine/scene/transition/pushTransition";
import {SIDE} from "@engine/scene/transition/side";
import {Color} from "@engine/renderer/color";
import {Font} from "@engine/renderable/impl/general/font";
import {TextField} from "@engine/renderable/impl/ui/components/textField";
import {SecondScene} from "./secondScene";
import {PopTransition} from "@engine/scene/transition/popTransition";
import {EasingQuad} from "@engine/misc/easing/functions/quad";


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

        this.createPushTransitionButton('push to Top',SIDE.TOP);
        this.createPushTransitionButton('push to Bottom',SIDE.BOTTOM);
        this.createPushTransitionButton('push to Left',SIDE.LEFT);
        this.createPushTransitionButton('push to Right',SIDE.RIGHT);

        this.createPopTransitionButton('pop to Top',SIDE.TOP);
        this.createPopTransitionButton('pop to Bottom',SIDE.BOTTOM);
        this.createPopTransitionButton('pop to Left',SIDE.LEFT);
        this.createPopTransitionButton('pop to Right',SIDE.RIGHT);

    }

    private createTransitionButton(text:string,transition:ISceneTransition){
        const tf:TextField = new TextField(this.game);
        tf.pos.setXY(10,this.btnPos+=50);
        tf.setText(text);
        tf.setFont(this.fnt);
        tf.on(MOUSE_EVENTS.click, e=>{
            this.game.runScene(new SecondScene(this.game),transition);
        });
        this.appendChild(tf);
    }

    private createPushTransitionButton(text:string,side:SIDE){
        const transition:ISceneTransition = new PushTransition(this.game,side,3000,EasingQuad.InOut);
        this.createTransitionButton(text,transition);
    }

    private createPopTransitionButton(text:string,side:SIDE){
        const transition:ISceneTransition = new PopTransition(this.game,side,3000,EasingQuad.InOut);
        this.createTransitionButton(text,transition);
    }

}

import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font";
import {SecondScene} from "./secondScene";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {
    Flip3dHorizontalInTransition,
    Flip3dHorizontalOutTransition,
    Flip3dVerticalInTransition,
    Flip3dVerticalOutTransition
} from "@engine/scene/transition/flip/flip3dTransition";
import {EasingSine} from "@engine/misc/easing/functions/sine";
import {
    ScaleRotateInAppearanceTransition,
    ScaleRotateOutAppearanceTransition
} from "@engine/scene/transition/appear/scale/scaleRotateAppearanceTransition";
import {EasingBounce} from "@engine/misc/easing/functions/bounce";
import {
    ScaleInAppearanceTransition,
    ScaleOutAppearanceTransition
} from "@engine/scene/transition/appear/scale/scaleAppearanceTransition";


// inspired by https://www.youtube.com/watch?v=mrR9eqUNTic
export class MainScene extends Scene {

    private fnt:Font;
    public colorBG: Color = Color.RGB(233);
    private btnPos:number=0;

    public onPreloading(){

        this.fnt = new Font(this.game, {fontSize: 25});
    }


    public onReady() {

        this.createFlip3dHorizontalTransitionButton('flip 3d horizontal in',true,false);
        this.createFlip3dHorizontalTransitionButton('flip 3d horizontal out',false, false);

        this.createFlip3dVerticalTransitionButton('flip 3d vertical in',true, false);
        this.createFlip3dVerticalTransitionButton('flip 3d vertical out',false, false);

        this.createFlip3dHorizontalTransitionButton('flip 3d billboard horizontal in',true,true);
        this.createFlip3dHorizontalTransitionButton('flip 3d billboard horizontal out',false, true);

        this.createFlip3dVerticalTransitionButton('flip 3d billboard vertical in',true, true);
        this.createFlip3dVerticalTransitionButton('flip 3d billboard vertical out',false, true);

        this.createScaleTransitionButton('scale x in',true, true, false);
        this.createScaleTransitionButton('scale x out',false, true, false);

        this.createScaleTransitionButton('scale y in',true, false, true);
        this.createScaleTransitionButton('scale y out',false, false, true);

        this.createScaleRotateTransitionButton('scale-rotate in',true,2);
        this.createScaleRotateTransitionButton('scale-rotate out',false,0.25);



    }

    private createFlip3dHorizontalTransitionButton(text:string,isAppearing:boolean,billboard:boolean){
        const transition:ISceneTransition =
            isAppearing?
                new Flip3dHorizontalInTransition(this.game,billboard,1000):
                new Flip3dHorizontalOutTransition(this.game,billboard, 1000);
        this.createTransitionButton(text,transition);
    }

    private createFlip3dVerticalTransitionButton(text:string,isAppearing:boolean,billboard:boolean){
        const transition:ISceneTransition =
            isAppearing?
                new Flip3dVerticalInTransition(this.game,billboard,1000, EasingSine.InOut):
                new Flip3dVerticalOutTransition(this.game,billboard,1000);
        this.createTransitionButton(text,transition);
    }

    private createScaleRotateTransitionButton(text:string,isAppearing:boolean,numOfRotations:number){
        const transition:ISceneTransition =
            isAppearing?
                new ScaleRotateInAppearanceTransition(this.game,1000, EasingBounce.Out,numOfRotations):
                new ScaleRotateOutAppearanceTransition(this.game,1000, EasingSine.InOut,numOfRotations);
        this.createTransitionButton(text,transition);
    }

    private createScaleTransitionButton(text:string,isAppearing:boolean,scaleX:boolean,scaleY:boolean){
        const transition:ISceneTransition =
            isAppearing?
                new ScaleInAppearanceTransition(this.game,1000, EasingBounce.Out,{x:scaleX,y:scaleY}):
                new ScaleOutAppearanceTransition(this.game,1000, EasingSine.InOut,{x:scaleX,y:scaleY});
        this.createTransitionButton(text,transition);
    }


    private createTransitionButton(text:string,transition:ISceneTransition){
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

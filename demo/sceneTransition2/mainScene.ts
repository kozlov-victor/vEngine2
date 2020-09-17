import {Scene} from "@engine/scene/scene";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font";
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
import {
    RandomCellsAppearingTransition,
    RandomCellsDisappearingTransition
} from "@engine/scene/transition/appear/cells/randomCellsAppearingTransition";
import {
    FlipHorizontalInTransition,
    FlipHorizontalOutTransition,
    FlipVerticalInTransition,
    FlipVerticalOutTransition
} from "@engine/scene/transition/flip/flipTransition";
import {
    MainDiagonalCellsAppearingTransition,
    MainDiagonalCellsDisappearingTransition
} from "@engine/scene/transition/appear/cells/mainDiagonalCellsAppearingTransition";
import {
    SideDiagonalCellsAppearingTransition,
    SideDiagonalCellsDisappearingTransition
} from "@engine/scene/transition/appear/cells/sideDiagonalCellsAppearingTransition";
import {
    SpiralCellsAppearingTransition,
    SpiralCellsDisappearingTransition
} from "@engine/scene/transition/appear/cells/spiralCellApperaingTransition";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";


export class MainScene extends Scene {

    private fnt:Font;
    public colorBG: Color = Color.RGB(233);
    private btnPos:number=0;

    public onPreloading(){

        this.fnt = new Font(this.game, {fontSize: 25});
    }


    public onReady() {

        this.createFadeTransitionButton('fade in',true);
        this.createFadeTransitionButton('fade out',false);
        this.createScaleTransitionButton('scale in',true);
        this.createScaleTransitionButton('scale out',false);
        this.createRandomCellTransitionButton('random cell appear',true);
        this.createRandomCellTransitionButton('random cell disappear',false);
        this.createFlipVerticalTransitionButton('flip vertical in',true);
        this.createFlipVerticalTransitionButton('flip vertical out',false);
        this.createFlipHorizontalTransitionButton('flip horizontal in',true);
        this.createFlipHorizontalTransitionButton('flip horizontal out',false);
        this.createMainDiagonalCellTransitionButton('main diagonal cell appear',true);
        this.createMainDiagonalCellTransitionButton('main diagonal cell disappear',false);
        this.createSideDiagonalCellTransitionButton('side diagonal cell appear',true);
        this.createSideDiagonalCellTransitionButton('side diagonal cell disappear',false);
        this.createSpiralCellTransitionButton('spiral cell appear',true);
        this.createSpiralCellTransitionButton('spiral cell disappear',false);
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

    private createRandomCellTransitionButton(text:string,isAppearing:boolean){
        const transition:ISceneTransition =
            isAppearing?
                new RandomCellsAppearingTransition(this.game,1000,20,20):
                new RandomCellsDisappearingTransition(this.game,1000,20,20);
        this.createTransitionButton(text,transition);
    }

    private createMainDiagonalCellTransitionButton(text:string,isAppearing:boolean){
        const transition:ISceneTransition =
            isAppearing?
                new MainDiagonalCellsAppearingTransition(this.game,1000,15,15):
                new MainDiagonalCellsDisappearingTransition(this.game,1000,15,15);
        this.createTransitionButton(text,transition);
    }

    private createSideDiagonalCellTransitionButton(text:string,isAppearing:boolean){
        const transition:ISceneTransition =
            isAppearing?
                new SideDiagonalCellsAppearingTransition(this.game,1000,15,15):
                new SideDiagonalCellsDisappearingTransition(this.game,1000,15,15);
        this.createTransitionButton(text,transition);
    }

    private createSpiralCellTransitionButton(text:string,isAppearing:boolean){
        const transition:ISceneTransition =
            isAppearing?
                new SpiralCellsAppearingTransition(this.game,3000,15,15):
                new SpiralCellsDisappearingTransition(this.game,3000,15,15);
        this.createTransitionButton(text,transition);
    }

    private createFlipVerticalTransitionButton(text:string,isAppearing:boolean){
        const transition:ISceneTransition =
            isAppearing?
                new FlipVerticalInTransition(this.game,1000):
                new FlipVerticalOutTransition(this.game,1000);
        this.createTransitionButton(text,transition);
    }

    private createFlipHorizontalTransitionButton(text:string,isAppearing:boolean){
        const transition:ISceneTransition =
            isAppearing?
                new FlipHorizontalInTransition(this.game,1000):
                new FlipHorizontalOutTransition(this.game,1000);
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

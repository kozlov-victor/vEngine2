import {Scene} from "@engine/scene/scene";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {PushTransition} from "@engine/scene/transition/move/pushTransition";
import {SIDE} from "@engine/scene/transition/move/side";
import {Color} from "@engine/renderer/common/color";
import {Font} from "@engine/renderable/impl/general/font/font";
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
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Resource} from "@engine/resources/resourceDecorators";
import {
    VerticalList
} from "@engine/renderable/impl/ui/scrollViews/directional/verticalList";
import {
    FadeInAppearanceTransition,
    FadeOutAppearanceTransition
} from "@engine/scene/transition/appear/fade/fadeAppearanceTransition";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {
    ScaleInAppearanceTransition,
    ScaleOutAppearanceTransition
} from "@engine/scene/transition/appear/scale/scaleAppearanceTransition";
import {
    RandomCellsAppearingTransition,
    RandomCellsDisappearingTransition
} from "@engine/scene/transition/appear/cells/randomCellsAppearingTransition";
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
import {
    FlipHorizontalInTransition,
    FlipHorizontalOutTransition,
    FlipVerticalInTransition,
    FlipVerticalOutTransition
} from "@engine/scene/transition/flip/flipTransition";
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
import {
    TurnThePageBackwardTransition,
    TurnThePageForwardTransition
} from "@engine/scene/transition/appear/page/turnThePageAppearanceTransition";
import {
    TurnThePageVerticalBackwardTransition,
    TurnThePageVerticalForwardTransition
} from "@engine/scene/transition/appear/page/turnThePageVerticalAppearanceTransition";
import {
    SizeWidthInAppearanceTransition,
    SizeWidthOutAppearanceTransition
} from "@engine/scene/transition/appear/size/abstractSizeWidthAppearanceTransition";
import {
    SizeHeightInAppearanceTransition,
    SizeHeightOutAppearanceTransition
} from "@engine/scene/transition/appear/size/abstractSizeHeightAppearanceTransition";
import {LIST_VIEW_EVENTS} from "@engine/renderable/impl/ui/scrollViews/directional/directionalListEvents";


export class MainScene extends Scene {

    @Resource.FontFromCssDescription({fontSize: 25,fontFamily:'monospace'})
    private fnt:Font;
    public override backgroundColor: Color = Color.RGB(233);

    private listView:VerticalList;
    private transitions:ISceneTransition[] = [];


    public override onReady():void {

        this.listView = new VerticalList(this.game);
        this.listView.size.setFrom(this.game.size);
        this.listView.setPadding(10);
        this.listView.setMargin(10);
        this.listView.alpha = 0.8;
        this.appendChild(this.listView);

        this.backgroundColor = Color.RGB(233);

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

        this.createFlip3dHorizontalTransitionButton('flip 3d horizontal in',true,false);
        this.createFlip3dHorizontalTransitionButton('flip 3d horizontal out',false, false);

        this.createFlip3dVerticalTransitionButton('flip 3d vertical in',true, false);
        this.createFlip3dVerticalTransitionButton('flip 3d vertical out',false, false);

        this.createFlip3dHorizontalTransitionButton('flip 3d billboard horizontal in',true,true);
        this.createFlip3dHorizontalTransitionButton('flip 3d billboard horizontal out',false, true);

        this.createFlip3dVerticalTransitionButton('flip 3d billboard vertical in',true, true);
        this.createFlip3dVerticalTransitionButton('flip 3d billboard vertical out',false, true);

        this.createScale2TransitionButton('scale x in',true, true, false);
        this.createScale2TransitionButton('scale x out',false, true, false);

        this.createScale2TransitionButton('scale y in',true, false, true);
        this.createScale2TransitionButton('scale y out',false, false, true);

        this.createScaleRotateTransitionButton('scale-rotate in',true,2);
        this.createScaleRotateTransitionButton('scale-rotate out',false,0.25);

        this.createSizeWidthTransitionButton('size width in',true);
        this.createSizeWidthTransitionButton('size width out',false);

        this.createSizeHeightTransitionButton('size height in',true);
        this.createSizeHeightTransitionButton('size height out',false);

        this.createTurnPageTransitionButton('turn the next page -----   ---- --- >>>',true);
        this.createTurnPageTransitionButton('turn the prev page -----   ---- --- >>>',false);

        this.createTurnPageVerticalTransitionButton('turn the next page (vertical)',true);
        this.createTurnPageVerticalTransitionButton('turn the prev page (vertical)',false);

        this.listView.listViewEventHandler.on(LIST_VIEW_EVENTS.itemClick, e=>{
            this.game.pushScene(new SecondScene(this.game),this.transitions[e.dataIndex]);
        });

    }

    private createTransitionButton(text:string,transition:ISceneTransition):void{
        const tf:TextField = new TextField(this.game,this.fnt);
        tf.textColor.setRGB(10);
        tf.size.setWH(this.game.width,40);
        tf.setText(text);
        tf.setFont(this.fnt);
        this.listView.addView(tf);
        this.transitions.push(transition);
    }

    private createPushTransitionButton(text:string,side:SIDE):void{
        const transition:ISceneTransition = new PushTransition(this.game,side,1000,EasingBounce.Out);
        this.createTransitionButton(text,transition);
    }

    private createPopTransitionButton(text:string,side:SIDE):void{
        const transition:ISceneTransition = new PopTransition(this.game,side,1000,EasingBounce.Out);
        this.createTransitionButton(text,transition);
    }

    private createSlideTransitionButton(text:string,side:SIDE):void{
        const transition:ISceneTransition = new SlideTransition(this.game,side,1000,EasingBounce.Out);
        this.createTransitionButton(text,transition);
    }

    private createCurtainTransitionButton(text:string,isOpening:boolean):void{
        const transition:ISceneTransition =
            isOpening?
            new CurtainsOpeningTransition(this.game,1000,EasingBounce.Out):
            new CurtainsClosingTransition(this.game,1000,EasingBounce.Out);
        this.createTransitionButton(text,transition);
    }

    private createCellTransitionButton(text:string,isAppearing:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new CellsAppearingTransition(this.game,1000):
                new CellsDisappearingTransition(this.game,1000);
        this.createTransitionButton(text,transition);
    }

    private createFadeTransitionButton(text:string,isAppearing:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new FadeInAppearanceTransition(this.game,1000,EasingLinear):
                new FadeOutAppearanceTransition(this.game,1000,EasingLinear);
        this.createTransitionButton(text,transition);
    }

    private createScaleTransitionButton(text:string,isAppearing:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new ScaleInAppearanceTransition(this.game,1000,EasingBounce.Out):
                new ScaleOutAppearanceTransition(this.game,1000,EasingBounce.Out);
        this.createTransitionButton(text,transition);
    }

    private createRandomCellTransitionButton(text:string,isAppearing:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new RandomCellsAppearingTransition(this.game,1000,20,20):
                new RandomCellsDisappearingTransition(this.game,1000,20,20);
        this.createTransitionButton(text,transition);
    }

    private createMainDiagonalCellTransitionButton(text:string,isAppearing:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new MainDiagonalCellsAppearingTransition(this.game,1000,15,15):
                new MainDiagonalCellsDisappearingTransition(this.game,1000,15,15);
        this.createTransitionButton(text,transition);
    }

    private createSideDiagonalCellTransitionButton(text:string,isAppearing:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new SideDiagonalCellsAppearingTransition(this.game,1000,15,15):
                new SideDiagonalCellsDisappearingTransition(this.game,1000,15,15);
        this.createTransitionButton(text,transition);
    }

    private createSpiralCellTransitionButton(text:string,isAppearing:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new SpiralCellsAppearingTransition(this.game,3000,15,15):
                new SpiralCellsDisappearingTransition(this.game,3000,15,15);
        this.createTransitionButton(text,transition);
    }

    private createFlipVerticalTransitionButton(text:string,isAppearing:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new FlipVerticalInTransition(this.game,1000):
                new FlipVerticalOutTransition(this.game,1000);
        this.createTransitionButton(text,transition);
    }

    private createFlipHorizontalTransitionButton(text:string,isAppearing:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new FlipHorizontalInTransition(this.game,1000):
                new FlipHorizontalOutTransition(this.game,1000);
        this.createTransitionButton(text,transition);
    }

    private createFlip3dHorizontalTransitionButton(text:string,isAppearing:boolean,billboard:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new Flip3dHorizontalInTransition(this.game,billboard,1000):
                new Flip3dHorizontalOutTransition(this.game,billboard, 1000);
        this.createTransitionButton(text,transition);
    }

    private createFlip3dVerticalTransitionButton(text:string,isAppearing:boolean,billboard:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new Flip3dVerticalInTransition(this.game,billboard,1000, EasingSine.InOut):
                new Flip3dVerticalOutTransition(this.game,billboard,1000);
        this.createTransitionButton(text,transition);
    }

    private createScaleRotateTransitionButton(text:string,isAppearing:boolean,numOfRotations:number):void{
        const transition:ISceneTransition =
            isAppearing?
                new ScaleRotateInAppearanceTransition(this.game,1000, EasingBounce.Out,numOfRotations):
                new ScaleRotateOutAppearanceTransition(this.game,1000, EasingSine.InOut,numOfRotations);
        this.createTransitionButton(text,transition);
    }

    private createScale2TransitionButton(text:string,isAppearing:boolean,scaleX:boolean,scaleY:boolean):void{
        const transition:ISceneTransition =
            isAppearing?
                new ScaleInAppearanceTransition(this.game,1000, EasingBounce.Out,{x:scaleX,y:scaleY}):
                new ScaleOutAppearanceTransition(this.game,1000, EasingSine.InOut,{x:scaleX,y:scaleY});
        this.createTransitionButton(text,transition);
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

}

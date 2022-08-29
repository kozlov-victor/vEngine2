import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITexture} from "@engine/renderer/common/texture";
import {Image} from "@engine/renderable/impl/general/image/image";
import {IntroScene} from "./introScene";
import {CellsAppearingTransition} from "@engine/scene/transition/appear/cells/cellsAppearingTransition";
import {Tween} from '@engine/animation/tween';
import {EasingElastic} from "@engine/misc/easing/functions/elastic";
import {PosterizeFilter} from "@engine/renderer/webGl/filters/texture/posterizeFilter";
import {PixelFilter} from "@engine/renderer/webGl/filters/texture/pixelFilter";
import {TaskQueue} from "@engine/resources/taskQueue";

export class PreIntroScene extends Scene {

    @Resource.Texture('./catGame/res/sprite/contest.png')
    public readonly spriteSheetLogo: ITexture;


    public override onPreloading(taskQueue:TaskQueue): void {
        super.onPreloading(taskQueue);
        this.backgroundColor = Color.BLACK;
    }

    public override onReady(): void {

        const intro:Image = new Image(this.game,this.spriteSheetLogo);
        intro.anchorPoint.setToCenter();
        intro.transformPoint.setToCenter();
        intro.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        this.appendChild(intro);
        const scale:number = 20;
        intro.scale.setXY(scale);

        const tw:Tween<{val:number}> = new Tween(this.game,{
            target: {val:scale},
            progress:({val})=>{
                intro.scale.setXY(Math.abs(val));
            },
            complete:({val})=>{
                intro.setTimeout(()=>{
                    this.game.runScene(new IntroScene(this.game),new CellsAppearingTransition(this.game));
                },1000);
            },
            ease:EasingElastic.InOut,
            time:5000,
            delayBeforeStart: 200,
            from:{val:scale},
            to:{val:0.1}
        });
        this.addTween(tw);
        const pixelFilter = new PixelFilter(this.game);
        pixelFilter.setPixelSize(5);
        const posterizeFilter:PosterizeFilter = new PosterizeFilter(this.game);
        posterizeFilter.setNumOfColors(2);
        this.filters = [pixelFilter];
    }


}

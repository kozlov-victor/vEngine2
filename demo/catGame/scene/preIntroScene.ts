import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {Resource} from "@engine/resources/resourceDecorators";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Image} from "@engine/renderable/impl/general/image";
import {IntroScene} from "./introScene";
import {CellsAppearingTransition} from "@engine/scene/transition/appear/cells/cellsAppearingTransition";
import {Tween} from '@engine/animation/tween';
import {EasingElastic} from "@engine/misc/easing/functions/elastic";
import {PosterizeFilter} from "@engine/renderer/webGl/filters/texture/posterizeFilter";
import {PixelFilter} from "@engine/renderer/webGl/filters/texture/pixelFilter";
import {ResourceLoader} from "@engine/resources/resourceLoader";

export class PreIntroScene extends Scene {

    @Resource.Texture('./catGame/res/sprite/contest.png')
    private spriteSheetLogo: ITexture;


    public onPreloading(resourceLoader:ResourceLoader): void {
        super.onPreloading(resourceLoader);
        this.backgroundColor = Color.BLACK;
    }

    public onReady(): void {

        const intro:Image = new Image(this.game,this.spriteSheetLogo);
        intro.anchorPoint.setToCenter();
        intro.transformPoint.setToCenter();
        intro.pos.setXY(this.game.size.width/2,this.game.size.height/2);
        this.appendChild(intro);
        const scale:number = 20;
        intro.scale.setXY(scale);

        const tw:Tween<{val:number}> = new Tween({
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

import {IScaleStrategy} from "@engine/renderer/abstract/scaleStrategy/interface/IScaleStrategy";
import {Game} from "@engine/core/game";
import {ISize, Size} from "@engine/geometry/size";
import {Device} from "@engine/misc/device";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {IPoint2d} from "@engine/geometry/point2d";

export class ScaleHelper {

    public static calcMetrixToFitRectToWindow(rect:ISize, window:ISize):{scale:IPoint2d,pos:IPoint2d,size:ISize} {
        const rectRatio:number = rect.height / rect.width;
        const windowRatio:number = window.height / window.width;
        let width:number;
        let height:number;
        if (windowRatio < rectRatio) {
            height = window.height;
            width = height / rectRatio;
        } else {
            width = window.width;
            height = width * rectRatio;
        }

        return {
            scale: {
                x: width / rect.width,
                y: height / rect.height,
            },
            pos: {
                x: (window.width - width)/2,
                y: (window.height - height)/2,
            },
            size: {width,height},
        }
    }

}

export class ScaleStrategyFitCanvasToScreen implements IScaleStrategy {

    public onResize(container:HTMLCanvasElement, game: Game, renderer:AbstractRenderer): void {

        const [innerWidth,innerHeight] = Device.getScreenResolution();

        const metrics =
            ScaleHelper.calcMetrixToFitRectToWindow(game.size,{width:innerWidth,height:innerHeight});

        game.scale.setFrom(metrics.scale);
        game.pos.setFrom(metrics.pos);

        container.style.width = metrics.size.width + 'px';
        container.style.height = metrics.size.height + 'px';
        container.style.marginTop = `${game.pos.y}px`;

        (renderer.viewPortSize as Size).setFrom(metrics.size);
    }

}

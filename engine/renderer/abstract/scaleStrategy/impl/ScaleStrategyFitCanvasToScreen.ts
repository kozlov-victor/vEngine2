import {IScaleStrategy} from "@engine/renderer/abstract/scaleStrategy/interface/IScaleStrategy";
import {Game} from "@engine/core/game";
import {Size} from "@engine/geometry/size";
import {Device} from "@engine/misc/device";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";

export class ScaleStrategyFitCanvasToScreen implements IScaleStrategy {

    public onResize(container:HTMLCanvasElement, game: Game, renderer:AbstractRenderer): void {

        const [innerWidth,innerHeight] = Device.getScreenResolution();

        const canvasRatio:number = game.size.height / game.size.width;
        const windowRatio:number = innerHeight / innerWidth;
        let width:number;
        let height:number;

        if (windowRatio < canvasRatio) {
            height = innerHeight;
            width = height / canvasRatio;
        } else {
            width = innerWidth;
            height = width * canvasRatio;
        }

        game.scale.setXY(width / game.size.width, height / game.size.height);
        game.pos.setXY(
            (innerWidth - width) / 2,
            (innerHeight - height) / 2
        );

        container.style.width = width + 'px';
        container.style.height = height + 'px';
        container.style.marginTop = `${game.pos.y}px`;

        (renderer.viewPortSize as Size).setWH(width,height);
    }

}

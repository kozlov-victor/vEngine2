import {IScaleStrategy} from "@engine/renderer/abstract/scaleStrategy/interface/IScaleStrategy";
import {Size} from "@engine/geometry/size";
import {Game} from "@engine/core/game";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {Device} from "@engine/misc/device";

export class ScaleStrategyStretchCanvasToScreen implements IScaleStrategy {

    public onResize(container:HTMLCanvasElement, game: Game, renderer:AbstractRenderer): void {
        const [innerWidth,innerHeight] = Device.getScreenResolution();
        container.style.width = `${innerWidth}px`;
        container.style.height = `${innerHeight}px`;
        (renderer.viewPortSize as Size).setWH(innerWidth,innerHeight);
        game.scale.setXY(innerWidth/game.size.width,innerHeight/game.size.height);
        game.pos.setXY(0);
    }

}

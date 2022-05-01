import {IScaleStrategy} from "@engine/renderer/abstract/scaleStrategy/interface/IScaleStrategy";
import {Game} from "@engine/core/game";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";

export class ScaleStrategyNone implements IScaleStrategy {

    public onResize(container:HTMLCanvasElement, game: Game, renderer:AbstractRenderer): void {
    }

}

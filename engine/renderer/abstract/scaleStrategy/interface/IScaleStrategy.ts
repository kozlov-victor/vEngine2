import {Game} from "@engine/core/game";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";

export interface IScaleStrategy {
    onResize(container: HTMLCanvasElement, game: Game, renderer: AbstractRenderer):void;
}

import {SCALE_STRATEGY} from "@engine/core/game";
import {IScaleStrategy} from "@engine/renderer/abstract/scaleStrategy/interface/IScaleStrategy";
import {ScaleStrategyNone} from "@engine/renderer/abstract/scaleStrategy/impl/ScaleStrategyNone";
import {
    ScaleStrategyStretchCanvasToScreen
} from "@engine/renderer/abstract/scaleStrategy/impl/ScaleStrategyStretchCanvasToScreen";
import {
    ScaleStrategyFitCanvasToScreen
} from "@engine/renderer/abstract/scaleStrategy/impl/ScaleStrategyFitCanvasToScreen";

export class ScaleStrategyFactory {

    public static getScaleStrategy(scaleStrategy:SCALE_STRATEGY):IScaleStrategy {
        if (scaleStrategy===SCALE_STRATEGY.NO_SCALE) {
            return new ScaleStrategyNone();
        }
        if (scaleStrategy===SCALE_STRATEGY.STRETCH_CANVAS_TO_SCREEN) {
            return new ScaleStrategyStretchCanvasToScreen();
        }
        if (scaleStrategy===SCALE_STRATEGY.FIT_CANVAS_TO_SCREEN) {
            return new ScaleStrategyFitCanvasToScreen();
        }
        else return undefined!;
    }

}

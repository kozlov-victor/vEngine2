import {Scene} from "@engine/scene/scene";
import {Optional} from "@engine/core/declarations";

export interface ISceneTransition {
    onComplete(fn: () => void): void;
    complete():void;
    start(prevScene: Optional<Scene>, currScene: Scene): void;
    getOppositeTransition():ISceneTransition;
    render(): void;
    update(): void;
}
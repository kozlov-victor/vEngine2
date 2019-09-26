import {Scene} from "@engine/scene/scene";
import {Optional} from "@engine/core/declarations";

export interface ISceneTransition {
    onComplete(fn: () => void): void;
    start(prevScene: Scene, currScene: Scene): void;
    render(): void;
}
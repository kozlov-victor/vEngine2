import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IUpdatable, Optional} from "@engine/core/declarations";

export interface IAnimation extends IUpdatable{
    play():void;
    stop():void;
    update():void;
}

export interface ITargetAnimation extends IAnimation {
    _target:Optional<RenderableModel>;
}

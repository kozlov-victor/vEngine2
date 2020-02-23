import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IUpdatable, Optional} from "@engine/core/declarations";

export interface IAnimation extends IUpdatable{
    target:Optional<RenderableModel>;
    play():void;
    stop():void;
    update():void;
}

import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Optional} from "@engine/core/declarations";

export interface IAnimation {
    target:Optional<RenderableModel>;
    play():void;
    stop():void;
    update():void;
}

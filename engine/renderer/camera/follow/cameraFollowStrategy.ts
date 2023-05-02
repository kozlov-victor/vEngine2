import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Camera} from "@engine/renderer/camera/camera";

export interface ICameraFollowStrategy {
    init(targetObject:RenderableModel,camera:Camera):void;
    update():void;
}

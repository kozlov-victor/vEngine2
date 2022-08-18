import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export interface IDragPoint {
    mX: number;
    mY: number;
    x:number;
    y:number;
    target: RenderableModel;
    defaultPrevented:boolean;
    dragStartX:number;
    dragStartY:number;
    dragStart: boolean;
    preventDefault():void;
}

import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Point2d} from "@engine/geometry/point2d";
import {Scene} from "@engine/scene/scene";
import {ObjectPool} from "@engine/misc/objectPool";
import {ReleaseableEntity} from "@engine/misc/releaseableEntity";

export const enum MOUSE_BUTTON {
    LEFT,
    RIGHT,
    SCROLL
}

export interface ISceneMouseEvent {
    screenX:number;
    screenY:number;
    sceneX:number;
    sceneY:number;
    id:number;
    nativeEvent: MouseEvent;
    eventName:string;
    isMouseDown: boolean;
    button:MOUSE_BUTTON;
}

export interface IObjectMouseEvent extends ISceneMouseEvent {
    objectX:number;
    objectY:number;
    currentTarget:RenderableModel;
    initialTarget:RenderableModel;
}

export class MousePoint extends ReleaseableEntity{
    public readonly screenCoordinate:Point2d = new Point2d();
    public readonly sceneCoordinate:Point2d = new Point2d();
    public id:number;
    public target:RenderableModel|Scene;
    public isMouseDown:boolean;
}

export class MousePointsPullHolder {
    private static mousePointsPool:ObjectPool<MousePoint> = new ObjectPool(MousePoint);
    public static fromPool():MousePoint{
        return this.mousePointsPool.getFreeObject()!;
    }
}

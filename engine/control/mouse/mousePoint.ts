import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Point2d} from "@engine/geometry/point2d";
import {Scene} from "@engine/scene/scene";
import {ObjectPool} from "@engine/misc/objectPool";

export const enum MOUSE_BUTTON {
    LEFT,
    RIGHT,
    SCROLL
}

export interface ISceneMousePoint {
    screenX:number;
    screenY:number;
    sceneX:number;
    sceneY:number;
    id:number;
    nativeEvent: Event;
    eventName:string;
    isMouseDown: boolean;
    button:MOUSE_BUTTON;
}

export interface IObjectMousePoint extends ISceneMousePoint {
    objectX:number;
    objectY:number;
    target:RenderableModel;
}


export class MousePoint extends Point2d {

    public static fromPool():MousePoint{
        return MousePoint.mousePointsPool.getFreeObject()!;
    }

    private static mousePointsPool:ObjectPool<MousePoint> = new ObjectPool(MousePoint);

    public readonly screenPoint:Point2d = new Point2d();
    public id:number;
    public target:RenderableModel|Scene;
    public isMouseDown:boolean;

    constructor(){
        super();
    }

    public copyTo(pointCopyTo:MousePoint):void{
        pointCopyTo.set(this);
        pointCopyTo.screenPoint.set(this.screenPoint);
        pointCopyTo.id = this.id;
        pointCopyTo.target = this.target;
        pointCopyTo.isMouseDown = this.isMouseDown;
    }

}
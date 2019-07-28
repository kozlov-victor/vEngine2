import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Point2d} from "@engine/geometry/point2d";
import {Scene} from "@engine/core/scene";
import {IMouseEventEx} from "@engine/core/declarations";
import {ObjectPool} from "@engine/misc/objectPool";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export interface IMousePoint {
    screenX:number;
    screenY:number;
    objectX:number;
    objectY:number;
    id:number;
    target:RenderableModel;
    nativeEvent: Event;
    eventName:string;
    isMouseDown: boolean;
}


export class MousePoint extends Point2d {

    public static fromPool():MousePoint{
        return MousePoint.mousePointsPool.getFreeObject();
    }

    private static mousePointsPool:ObjectPool<MousePoint> = new ObjectPool<MousePoint>(MousePoint);

    public screenX:number;
    public screenY:number;
    public id:number;
    public target:RenderableModel|Scene;
    public nativeEvent:IMouseEventEx;
    public isMouseDown:boolean;

    constructor(){
        super();
    }

}


import {RenderableModel} from "@engine/model/renderableModel";
import {Point2d} from "@engine/core/geometry/point2d";
import {Scene} from "@engine/model/impl/scene";
import {MouseEventEx} from "@engine/declarations";
import {ObjectPool} from "@engine/core/misc/objectPool";
export interface IMousePoint {

    screenX:number,
    screenY:number,
    objectX:number,
    objectY:number,
    id:number,
    target:RenderableModel,
    nativeEvent: Event,
    eventName:string,
    isMouseDown: boolean
}


export class MousePoint extends Point2d{

    public screenX:number;
    public screenY:number;
    public id:number;
    public target:RenderableModel|Scene;
    public nativeEvent:MouseEventEx;
    public isMouseDown:boolean;

    private static mousePointsPool:ObjectPool<MousePoint> = new ObjectPool<MousePoint>(MousePoint);

    constructor(){
        super();
    }


    static fromPool():MousePoint{
        return MousePoint.mousePointsPool.getNextObject();
    }

    static unTransform(another:MousePoint):MousePoint{
        let p:MousePoint = MousePoint.fromPool();
        p.screenX = another.screenX;
        p.screenY = another.screenY;
        p.id = another.id;
        p.target = another.target;
        p.setXY(p.screenX,p.screenY);
        return p;
    }

}
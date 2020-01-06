import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Point2d} from "@engine/geometry/point2d";
import {Scene} from "@engine/scene/scene";
import {ObjectPool, ReleasableObject} from "@engine/misc/objectPool";
import {Optional} from "@engine/core/declarations";

export const enum MOUSE_BUTTON {
    LEFT,
    RIGHT,
    SCROLL
}

export class SceneMousePoint extends ReleasableObject {

    public static fromPool():SceneMousePoint {
        return SceneMousePoint.pool.getFreeObject()!;
    }
    private static pool = new ObjectPool(SceneMousePoint,4);

    public screenX:number;
    public screenY:number;
    public sceneX:number;
    public sceneY:number;
    public id:number;
    public nativeEvent: Event;
    public eventName:string;
    public isMouseDown: boolean;
    public button:MOUSE_BUTTON;
}

export class ObjectMousePoint extends SceneMousePoint {

    public objectX:number;
    public objectY:number;
    public target:RenderableModel;
}

export namespace MousePointPool {

    const poolSize = 24 as const;

    const objectMousePointsPool = new ObjectPool(ObjectMousePoint,poolSize);
    const sceneMousePointsPool = new ObjectPool(SceneMousePoint,poolSize);

    export const getObjectMousePoint = ():Optional<ObjectMousePoint>=> {
        return objectMousePointsPool.getFreeObject(true);
    };

    export const getSceneMousePoint = ():Optional<SceneMousePoint>=> {
        return sceneMousePointsPool.getFreeObject(true);
    };

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
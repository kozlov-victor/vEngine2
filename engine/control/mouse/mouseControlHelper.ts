import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IObjectMouseEvent, MousePoint, MousePointsPullHolder} from "@engine/control/mouse/mousePoint";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Rect} from "@engine/geometry/rect";
import {Mat4} from "@engine/geometry/mat4";
import {Vec4} from "@engine/geometry/vec4";
import {LayerTransformType} from "@engine/scene/layer";
import {IPoint2d, Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {Optional} from "@engine/core/declarations";
import Vec4Holder = Vec4.Vec4Holder;

const recycledArray:Readonly<Vec4.VEC4>[] = [undefined!,undefined!,undefined!,undefined!];

export class MouseControlHelper {

    constructor(private game:Game) {
    }

    // https://stackoverflow.com/questions/39853481/is-point-inside-polygon
    private isPointInPolygon4 = (polygon:Readonly<Vec4.VEC4>[],testPoint:IPoint2d):boolean=>{
        let result:boolean = false;
        let j:number = polygon.length - 1;
        for (let i:number = 0,max:number= polygon.length; i < max; i++) {
            if (
                polygon[i][1] < testPoint.y
                && polygon[j][1] >= testPoint.y || polygon[j][1] < testPoint.y
                && polygon[i][1] >= testPoint.y)
            {
                if (
                    polygon[i][0] + (testPoint.y - polygon[i][1])
                    /
                    (polygon[j][1] - polygon[i][1]) * (polygon[j][0] - polygon[i][0]) < testPoint.x
                ) {
                    result = !result;
                }
            }
            j = i;
        }
        return result;
    }

    private isPointInRect(mousePoint:MousePoint, obj:RenderableModel,constrainObjects?:RenderableModel[]):boolean {
        const goRect:Rect = Rect.fromPool();

        const pointBottomRight:Vec4Holder = Vec4Holder.fromPool();
        pointBottomRight.set(obj.size.width,obj.size.height,0,1);
        const pointBottomRightTransformation:Vec4Holder = Vec4Holder.fromPool();
        Mat4.multVecByMatrix(pointBottomRightTransformation,obj.worldTransformMatrix,pointBottomRight);

        const pointTopRight:Vec4Holder = Vec4Holder.fromPool();
        pointTopRight.set(obj.size.width,0,0,1);
        const pointTopRightTransformation:Vec4Holder = Vec4Holder.fromPool();
        Mat4.multVecByMatrix(pointTopRightTransformation,obj.worldTransformMatrix,pointTopRight);

        const pointTopLeft:Vec4Holder = Vec4Holder.fromPool();
        pointTopLeft.set(0,0,0,1);
        const pointTopLeftTransformation:Vec4Holder = Vec4Holder.fromPool();
        Mat4.multVecByMatrix(pointTopLeftTransformation,obj.worldTransformMatrix,pointTopLeft);

        const pointBottomLeft:Vec4Holder = Vec4Holder.fromPool();
        pointBottomLeft.set(0,obj.size.height,0,1);
        const pointBottomLeftTransformation:Vec4Holder = Vec4Holder.fromPool();
        Mat4.multVecByMatrix(pointBottomLeftTransformation,obj.worldTransformMatrix,pointBottomLeft);

        recycledArray[0] = pointTopLeftTransformation.vec4;
        recycledArray[1] = pointTopRightTransformation.vec4;
        recycledArray[2] = pointBottomRightTransformation.vec4;
        recycledArray[3] = pointBottomLeftTransformation.vec4;

        let result:boolean = this.isPointInPolygon4(recycledArray,mousePoint.screenCoordinate);
        if (result && constrainObjects!==undefined) {
            for (let i:number=0;i<constrainObjects.length;i++) {
                if (!this.isPointInRect(mousePoint,constrainObjects[i])) {
                    result = false;
                    break;
                }
            }
        }

        goRect.release();

        pointBottomRight.release();
        pointBottomRightTransformation.release();
        pointTopRight.release();
        pointTopRightTransformation.release();
        pointTopLeft.release();
        pointTopLeftTransformation.release();
        pointBottomLeft.release();
        pointBottomLeftTransformation.release();
        return result;
    }

    public captureObject(
        e:MouseEvent|TouchEvent|Touch,
        eventName:MOUSE_EVENTS,
        mousePoint:MousePoint,
        currentTarget:RenderableModel,
        initialTarget:RenderableModel,
        constrainObjects:RenderableModel[]
    ):Optional<IObjectMouseEvent>{

        if (this.isPointInRect(mousePoint,currentTarget,constrainObjects)) {
            return  this.triggerEventForObject(e,eventName,mousePoint,currentTarget,initialTarget);
        } else return undefined;
    }

    public triggerEventForObject(e:MouseEvent|TouchEvent|Touch,eventName:MOUSE_EVENTS,mousePoint:MousePoint, currentTarget:RenderableModel,initialTarget:RenderableModel):IObjectMouseEvent{
        mousePoint.target = currentTarget;
        const mouseEvent:IObjectMouseEvent = {
            screenX:mousePoint.screenCoordinate.x,
            screenY:mousePoint.screenCoordinate.y,
            sceneX:mousePoint.sceneCoordinate.x,
            sceneY:mousePoint.sceneCoordinate.y,
            objectX:mousePoint.sceneCoordinate.x - currentTarget.pos.x,
            objectY:mousePoint.sceneCoordinate.y - currentTarget.pos.y,
            id:mousePoint.id,
            currentTarget,
            initialTarget,
            nativeEvent: e as MouseEvent,
            eventName,
            isMouseDown: mousePoint.isMouseDown,
            button: (e as MouseEvent).buttons,
            isPropagated:true,
        };
        currentTarget.mouseEventHandler.trigger(eventName,mouseEvent);
        return mouseEvent;
    }

    public resolveSceneCoordinates(mousePoint:MousePoint,layerTransform:LayerTransformType):void{
        if (layerTransform===LayerTransformType.STICK_TO_CAMERA) {
            mousePoint.sceneCoordinate.set(mousePoint.screenCoordinate);
        } else {
            const worldPoint:Point2d = this.game.getCurrentScene().camera.screenToWorld(mousePoint.screenCoordinate);
            mousePoint.sceneCoordinate.set(worldPoint);
            worldPoint.release();
        }
    }

    public resolvePoint(e:MouseEvent|Touch|PointerEvent):MousePoint{
        const game:Game = this.game;
        const clientX:number = e.clientX;
        const clientY:number = e.clientY;

        const screenX:number = (clientX - game.pos.x ) / game.scale.x;
        const screenY:number = (clientY - game.pos.y ) / game.scale.y;

        const mousePoint:MousePoint = MousePointsPullHolder.fromPool();
        mousePoint.target = undefined!;
        mousePoint.screenCoordinate.setXY(screenX,screenY);
        mousePoint.id = (e as Touch).identifier  || (e as PointerEvent).pointerId || 0;

        return mousePoint;
    }

}

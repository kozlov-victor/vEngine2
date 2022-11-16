import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IObjectMouseEvent, MousePoint, MousePointsPullHolder} from "@engine/control/mouse/mousePoint";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Vec4} from "@engine/geometry/vec4";
import {LayerTransformType} from "@engine/scene/layer";
import {IPoint2d, Point2d} from "@engine/geometry/point2d";
import {Game} from "@engine/core/game";
import {Optional} from "@engine/core/declarations";
import {getScreenCoords} from "@engine/renderable/_helper/getScreenCoords";


export class MouseControlHelper {

    constructor(private game:Game) {
    }

    // https://stackoverflow.com/questions/39853481/is-point-inside-polygon
    private isPointInPolygon4 = (point:IPoint2d,polygon:Readonly<Vec4.VEC4>[]):boolean=>{
        let result:boolean = false;
        let j:number = polygon.length - 1;
        for (let i:number = 0,max:number= polygon.length; i < max; i++) {
            if (
                polygon[i][1] < point.y
                && polygon[j][1] >= point.y || polygon[j][1] < point.y
                && polygon[i][1] >= point.y)
            {
                if (
                    polygon[i][0] + (point.y - polygon[i][1])
                    /
                    (polygon[j][1] - polygon[i][1]) * (polygon[j][0] - polygon[i][0]) < point.x
                ) {
                    result = !result;
                }
            }
            j = i;
        }
        return result;
    }

    private isPointInRect(mousePoint:MousePoint, obj:RenderableModel,constrainObjects?:RenderableModel[]):boolean {

        let result:boolean = this.isPointInPolygon4(mousePoint.screenCoordinate,getScreenCoords(obj));
        if (result && constrainObjects!==undefined) {
            for (let i:number=0;i<constrainObjects.length;i++) {
                if (!this.isPointInRect(mousePoint,constrainObjects[i])) {
                    result = false;
                    break;
                }
            }
        }

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
            mousePoint.sceneCoordinate.setFrom(mousePoint.screenCoordinate);
        } else {
            const worldPoint:Point2d = this.game.getCurrentScene().camera.screenToWorld(mousePoint.screenCoordinate);
            mousePoint.sceneCoordinate.setFrom(worldPoint);
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

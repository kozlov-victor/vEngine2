import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {ObjectMouseEvent, MousePoint} from "@engine/control/mouse/mousePoint";
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
        for (let i = 0,max = polygon.length; i < max; i++) {
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
    ):Optional<ObjectMouseEvent>{ // return boolean if captured event is transcluded, undefined if not captured

        if (this.isPointInRect(mousePoint,currentTarget,constrainObjects)) {
            return this.triggerEventForObject(e,eventName,mousePoint,currentTarget,initialTarget);
        } else return undefined;
    }

    public triggerEventForObject(e:MouseEvent|TouchEvent|Touch,eventName:MOUSE_EVENTS,mousePoint:MousePoint, currentTarget:RenderableModel,initialTarget:RenderableModel):ObjectMouseEvent{
        mousePoint.target = currentTarget;
        const mouseEvent = ObjectMouseEvent.pool.get();
        mouseEvent.screenX = mousePoint.screenCoordinate.x;
        mouseEvent.screenY = mousePoint.screenCoordinate.y;
        mouseEvent.sceneX = mousePoint.sceneCoordinate.x;
        mouseEvent.sceneY = mousePoint.sceneCoordinate.y;
        mouseEvent.objectX = mousePoint.sceneCoordinate.x - currentTarget.pos.x + currentTarget.anchorPoint.x;
        mouseEvent.objectY = mousePoint.sceneCoordinate.y - currentTarget.pos.y + currentTarget.anchorPoint.y;
        mouseEvent.id = mousePoint.id;
        mouseEvent.currentTarget = currentTarget;
        mouseEvent.initialTarget = initialTarget;
        mouseEvent.nativeEvent = e as MouseEvent;
        mouseEvent.eventName = eventName;
        mouseEvent.isMouseDown = mousePoint.isMouseDown;
        mouseEvent.button =  (e as MouseEvent).buttons;
        mouseEvent.transclude = true;
        currentTarget.mouseEventHandler.trigger(eventName,mouseEvent);
        return mouseEvent;
    }

    public resolveSceneCoordinates(mousePoint:MousePoint,layerTransform:LayerTransformType):void{
        if (layerTransform===LayerTransformType.STICK_TO_CAMERA) {
            mousePoint.sceneCoordinate.setFrom(mousePoint.screenCoordinate);
        } else {
            const worldPoint = this.game.getCurrentScene().camera.screenToWorld(mousePoint.screenCoordinate);
            mousePoint.sceneCoordinate.setFrom(worldPoint);
            Point2d.pool.recycle(worldPoint);
        }
    }

    public resolvePoint(e:MouseEvent|Touch|PointerEvent):MousePoint{
        const game = this.game;
        const clientX = e.clientX;
        const clientY = e.clientY;

        const screenX = (clientX - game.pos.x ) / game.scale.x;
        const screenY = (clientY - game.pos.y ) / game.scale.y;

        const mousePoint = MousePoint.pool.get();
        mousePoint.target = undefined!;
        mousePoint.screenCoordinate.setXY(screenX,screenY);
        mousePoint.id = (e as Touch).identifier  || (e as PointerEvent).pointerId || 0;

        return mousePoint;
    }

}

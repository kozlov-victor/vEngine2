import {BaseAbstractBehaviour} from "../abstract/baseAbstractBehaviour";
import {Game} from "../../core/game";
import {Scene} from "../../scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IObjectMouseEvent, ISceneMouseEvent, MOUSE_BUTTON} from "@engine/control/mouse/mousePoint";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Int} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";
import {LayerTransformType} from "@engine/scene/layer";
import {IDragPoint} from "@engine/behaviour/impl/dragPoint";
import {DRAG_EVENTS} from "@engine/behaviour/impl/dragEvents";


export class DraggableBehaviour extends BaseAbstractBehaviour {

    constructor(game:Game){
        super(game,{});
    }

    private _blurListener:(e:MouseEvent)=>void;
    private _gameObjectOnClick:(e:IObjectMouseEvent)=>void;
    private _sceneOnMouseDown:(arg:ISceneMouseEvent)=>void;
    private _sceneOnMouseMove:(arg:ISceneMouseEvent)=>void;
    private _sceneOnMouseUp:(arg:ISceneMouseEvent)=>void;

    private readonly _points:{[key:number]:IDragPoint} = {};
    private _gameObject:RenderableModel;

    private static _getEventId(e:ISceneMouseEvent):Int{
        return (e.id || 1) as Int;
    }

    public manage(gameObject:RenderableModel):void {
        if (DEBUG && this._gameObject) {
            throw new DebugError(`DraggableBehaviour is already used by another renderable model`);
        }
        this._gameObject = gameObject;
        this._gameObjectOnClick = gameObject.mouseEventHandler.on(MOUSE_EVENTS.click,(e:IObjectMouseEvent)=>{
            this._points[DraggableBehaviour._getEventId(e)] = {
                mX: e.objectX,
                mY: e.objectY,
                target: gameObject,
                preventDefault():void{
                    this.defaultPrevented = true;
                },
                dragStartX:0,
                dragStartY:0
            } as IDragPoint;
        });
        const scene:Scene = this.game.getCurrScene();
        this._sceneOnMouseDown = scene.mouseEventHandler.on(MOUSE_EVENTS.mouseDown,(e:ISceneMouseEvent)=>{
            const pointId:number = DraggableBehaviour._getEventId(e);
            const point:IDragPoint = this._points[pointId];
            if (!point) return;
            point.dragStartX = point.target.pos.x;
            point.dragStartY = point.target.pos.y;
        });
        this._sceneOnMouseMove = scene.mouseEventHandler.on(MOUSE_EVENTS.mouseMove,(e:ISceneMouseEvent)=>{
            const pointId = DraggableBehaviour._getEventId(e);
            const point:IDragPoint = this._points[pointId];
            if (!point) return;
            if (!point.dragStart) {
                point.dragStart = true;
                gameObject.dragEventHandler.trigger(DRAG_EVENTS.dragStart,point);
                if (point.defaultPrevented) {
                    delete this._points[pointId];
                    return;
                }
            } else {
                gameObject.dragEventHandler.trigger(DRAG_EVENTS.dragMove,point);
            }
            let x:number,y:number;
            if (gameObject.getLayer().transformType===LayerTransformType.TRANSFORM) {
                x = e.sceneX;
                y = e.sceneY;
            } else {
                x = e.screenX;
                y = e.screenY;
            }
            gameObject.pos.x = x - point.mX;
            gameObject.pos.y = y - point.mY;
        });
        this._sceneOnMouseUp = scene.mouseEventHandler.on(MOUSE_EVENTS.mouseUp,(e:ISceneMouseEvent)=>{
            const pointId:number = DraggableBehaviour._getEventId(e);
            const point:IDragPoint = this._points[pointId];
            if (!point) return;
            if (point.dragStart) {
                point.x = gameObject.pos.x;
                point.y = gameObject.pos.y;
                gameObject.dragEventHandler.trigger(DRAG_EVENTS.dragStop,point);
            }
            delete this._points[pointId];
        });
        this._blurListener = (e)=>{
            scene.mouseEventHandler.trigger(MOUSE_EVENTS.mouseUp,{
                screenX:-1,
                screenY:-1,
                sceneX:-1,
                sceneY:-1,
                id:0,
                nativeEvent: e,
                eventName:MOUSE_EVENTS.mouseUp,
                isMouseDown: false,
                button:e.button,
            });
        };
        this.game.getRenderer().container.addEventListener('mouseleave',this._blurListener);
    }

    public revalidate():void {
        super.revalidate();
        if (DEBUG && (this._gameObject.size.isZero())) {
            throw new DebugError(
                `can not apply DraggableBehaviour ot object with zero render size. Current size is ${this._gameObject.size.toJSON()}`
            );
        }
    }

    public destroy():void{
        const scene:Scene = this.game.getCurrScene();
        this.game.getRenderer().container.removeEventListener('mouseleave',this._blurListener);
        this._gameObject.mouseEventHandler.off(MOUSE_EVENTS.click,this._gameObjectOnClick);
        scene.mouseEventHandler.off(MOUSE_EVENTS.mouseDown,this._sceneOnMouseDown);
        scene.mouseEventHandler.off(MOUSE_EVENTS.mouseMove,this._sceneOnMouseMove);
        scene.mouseEventHandler.off(MOUSE_EVENTS.mouseDown,this._sceneOnMouseUp);
    }

}


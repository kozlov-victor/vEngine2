import {BaseAbstractBehaviour} from "../abstract/baseAbstractBehaviour";
import {Game} from "../../core/game";
import {Scene} from "../../scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IObjectMouseEvent, ISceneMouseEvent} from "@engine/control/mouse/mousePoint";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Int} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";
import {LayerTransformType} from "@engine/scene/layer";

interface IMouseDragPoint {
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


export class DraggableBehaviour extends BaseAbstractBehaviour {

    private static _getEventId(e:ISceneMouseEvent):Int{
        return (e.id || 1) as Int;
    }

    private _blurListener:(e:MouseEvent)=>void;
    private _gameObjectOnClick:(e:IObjectMouseEvent)=>void;
    private _sceneOnMouseDown:(arg:ISceneMouseEvent)=>void;
    private _sceneOnMouseMove:(arg:ISceneMouseEvent)=>void;
    private _sceneOnMouseUp:(arg:ISceneMouseEvent)=>void;

    private readonly _points:{[key:number]:IMouseDragPoint} = {};
    private _gameObject:RenderableModel;

    constructor(game:Game){
        super(game,{});
    }

    public manage(gameObject:RenderableModel):void {
        if (DEBUG && this._gameObject) {
            throw new DebugError(`DraggableBehaviour is already used by another renderable model`);
        }
        this._gameObject = gameObject;
        this._gameObjectOnClick = gameObject.on(MOUSE_EVENTS.click,(e:IObjectMouseEvent)=>{
            this._points[DraggableBehaviour._getEventId(e)] = {
                mX: e.objectX,
                mY: e.objectY,
                target: gameObject,
                preventDefault(){
                    this.defaultPrevented = true;
                },
                dragStartX:0,
                dragStartY:0
            } as IMouseDragPoint;
        });
        const scene:Scene = this.game.getCurrScene();
        this._sceneOnMouseDown = scene.on(MOUSE_EVENTS.mouseDown,(e:ISceneMouseEvent)=>{
            const pointId:number = DraggableBehaviour._getEventId(e);
            const point:IMouseDragPoint = this._points[pointId];
            if (!point) return;
            point.dragStartX = point.target.pos.x;
            point.dragStartY = point.target.pos.y;
        });
        this._sceneOnMouseMove = scene.on(MOUSE_EVENTS.mouseMove,(e:ISceneMouseEvent)=>{
            const pointId = DraggableBehaviour._getEventId(e);
            const point:IMouseDragPoint = this._points[pointId];
            if (!point) return;
            if (!point.dragStart) {
                point.dragStart = true;
                gameObject.trigger(MOUSE_EVENTS.dragStart,point);
                if (point.defaultPrevented) {
                    delete this._points[pointId];
                    return;
                }
            } else {
                gameObject.trigger(MOUSE_EVENTS.dragMove,point);
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
        this._sceneOnMouseUp = scene.on(MOUSE_EVENTS.mouseUp,(e:ISceneMouseEvent)=>{
            const pointId:number = DraggableBehaviour._getEventId(e);
            const point:IMouseDragPoint = this._points[pointId];
            if (!point) return;
            if (point.dragStart) {
                point.x = gameObject.pos.x;
                point.y = gameObject.pos.y;
                gameObject.trigger(MOUSE_EVENTS.dragStop,point);
            }
            delete this._points[pointId];
        });
        this._blurListener = (e)=>{
            scene.trigger(MOUSE_EVENTS.mouseUp,e);
        };
        this.game.getRenderer().container.addEventListener('mouseleave',this._blurListener);
    }

    public revalidate() {
        super.revalidate();
        if (DEBUG && (this._gameObject.size.isZero())) throw new DebugError(`can not apply DraggableBehaviour ot object with zero render size. Current size is ${this._gameObject.size.toJSON()}`);
    }

    public destroy():void{
        const scene:Scene = this.game.getCurrScene();
        this.game.getRenderer().container.removeEventListener('mouseleave',this._blurListener);
        this._gameObject.off(MOUSE_EVENTS.click,this._gameObjectOnClick);
        scene.off(MOUSE_EVENTS.mouseDown,this._sceneOnMouseDown);
        scene.off(MOUSE_EVENTS.mouseMove,this._sceneOnMouseMove);
        scene.off(MOUSE_EVENTS.mouseDown,this._sceneOnMouseUp);
    }

}


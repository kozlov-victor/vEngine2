import {BaseAbstractBehaviour} from "../../abstract/baseAbstractBehaviour";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IObjectMouseEvent, ISceneMouseEvent} from "@engine/control/mouse/mousePoint";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Int, Optional} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";
import {LayerTransformType} from "@engine/scene/layer";
import {IDragPoint} from "@engine/behaviour/impl/draggable/dragPoint";
import {DRAG_EVENTS} from "@engine/behaviour/impl/draggable/dragEvents";

export interface IDraggableBehaviourParameters {
    constrainX?:boolean;
    constrainY?:boolean;
    minX?:number;
    maxX?:number;
    minY?:number;
    maxY?:number;
}

export class DraggableBehaviour extends BaseAbstractBehaviour {

    constructor(game:Game, private params?:IDraggableBehaviourParameters){
        super(game,{});
        if (params!==undefined) this.updateConstrains(params);
    }

    private constrainX:boolean;
    private constrainY:boolean;
    private minX:Optional<number>;
    private maxX:Optional<number>;
    private minY:Optional<number>;
    private maxY:Optional<number>;

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

    public updateConstrains(params:IDraggableBehaviourParameters):void {
        this.constrainX = params?.constrainX ?? false;
        this.constrainY = params?.constrainY ?? false;
        this.minX = params?.minX;
        this.maxX = params?.maxX;
        this.minY = params?.minY;
        this.maxY = params?.maxY;
        if (this._gameObject) this.applyNewPositionAndConstrains(this._gameObject.pos.x,this._gameObject.pos.y);
    }

    public override manage(gameObject:RenderableModel):void {
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
        const scene:Scene = this.game.getCurrentScene();
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

            this.applyNewPositionAndConstrains(x - point.mX,y - point.mY);

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

    public override revalidate():void {
        super.revalidate();
        if (DEBUG && (this._gameObject.size.isZero())) {
            throw new DebugError(
                `can not apply DraggableBehaviour ot object with zero render size. Current size is ${this._gameObject.size.toJSON()}`
            );
        }
    }

    public override destroy():void{
        const scene:Scene = this.game.getCurrentScene();
        this.game.getRenderer().container.removeEventListener('mouseleave',this._blurListener);
        this._gameObject.mouseEventHandler.off(MOUSE_EVENTS.click,this._gameObjectOnClick);
        scene.mouseEventHandler.off(MOUSE_EVENTS.mouseDown,this._sceneOnMouseDown);
        scene.mouseEventHandler.off(MOUSE_EVENTS.mouseMove,this._sceneOnMouseMove);
        scene.mouseEventHandler.off(MOUSE_EVENTS.mouseUp,this._sceneOnMouseUp);
    }

    private applyNewPositionAndConstrains(newX:number,newY:number):void{
        const gameObject = this._gameObject;
        if (this.constrainX) newX = gameObject.pos.x;
        if (this.constrainY) newY = gameObject.pos.y;
        if (this.minX!==undefined) if (newX<this.minX) newX = this.minX;
        if (this.maxX!==undefined) if (newX>this.maxX) newX = this.maxX;
        if (this.minY!==undefined) if (newY<this.minY) newY = this.minY;
        if (this.maxY!==undefined) if (newY>this.maxY) newY = this.maxY;

        gameObject.pos.x = newX;
        gameObject.pos.y = newY;
    }

    public clone():this {
        return new DraggableBehaviour(this.game,this.params) as this;
    }



}


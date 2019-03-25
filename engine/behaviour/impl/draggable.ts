import {BaseAbstractBehaviour} from "../abstract/baseAbstractBehaviour";
import {Game} from "../../core/game";
import {GameObject} from "../../model/impl/gameObject";
import {Scene} from "../../model/impl/scene";
import {RenderableModel} from "@engine/model/renderableModel";
import {IMousePoint} from "@engine/core/control/mouse/mousePoint";
import {MOUSE_EVENTS} from "@engine/core/control/mouse/mouseEvents";
import {Int} from "@engine/declarations";

interface MouseDragPoint {
    mX: number,
    mY: number,
    x:number,y:number,
    target: GameObject,
    defaultPrevented:boolean,
    preventDefault():void,
    dragStartX:number,
    dragStartY:number,
    dragStart: boolean
}


export class DraggableBehaviour extends BaseAbstractBehaviour {

    private static _getEventId(e:IMousePoint):Int{
        return (e.id || 1) as Int;
    };

    private blurListener:(e:MouseEvent)=>void;
    private gameObjectOnClick:Function;
    private sceneOnMouseDown:Function;
    private sceneOnMouseMove:Function;
    private sceneOnMouseUp:Function;

    private readonly points:{[key:number]:MouseDragPoint} = {};
    private gameObject:RenderableModel;

    constructor(game:Game){
        super(game,null);
    }

    manage(gameObject:RenderableModel) {
        this.gameObject = gameObject;
        this.gameObjectOnClick = gameObject.on(MOUSE_EVENTS.click,(e:IMousePoint)=>{
            this.points[DraggableBehaviour._getEventId(e)] = {
                mX: e.objectX,
                mY: e.objectY,
                target: gameObject,
                preventDefault(){
                    this.defaultPrevented = true;
                },
                dragStartX:0,
                dragStartY:0
            } as MouseDragPoint;
        });
        const scene:Scene = this.game.getCurrScene();
        this.sceneOnMouseDown = scene.on(MOUSE_EVENTS.mouseDown,(e:IMousePoint)=>{
            let pointId:number = DraggableBehaviour._getEventId(e);
            let point:MouseDragPoint = this.points[pointId];
            if (!point) return;
            point.dragStartX = point.target.pos.x;
            point.dragStartY = point.target.pos.y;
        });
        this.sceneOnMouseMove = scene.on(MOUSE_EVENTS.mouseMove,(e:IMousePoint)=>{
            let pointId = DraggableBehaviour._getEventId(e);
            let point = this.points[pointId];
            if (!point) return;
            if (!point.dragStart) {
                point.dragStart = true;
                gameObject.trigger('dragStart',point);
                if (point.defaultPrevented) {
                    delete this.points[pointId];
                    return;
                }
            }
            gameObject.pos.x = e.screenX - point.mX;
            gameObject.pos.y = e.screenY - point.mY;
        });
        this.sceneOnMouseUp = scene.on(MOUSE_EVENTS.mouseUp,(e:IMousePoint)=>{
            let pointId:number = DraggableBehaviour._getEventId(e);
            let point:MouseDragPoint = this.points[pointId];
            if (!point) return;
            if (point.dragStart) {
                point.x = gameObject.pos.x;
                point.y = gameObject.pos.y;
                gameObject.trigger('dragStop',point);
            }
            delete this.points[pointId];
        });
        this.blurListener = (e)=>{
            scene.trigger(MOUSE_EVENTS.mouseUp,e);
        };
        this.game.getRenderer().container.addEventListener('mouseleave',this.blurListener);
    }

    destroy(){
        const scene:Scene = this.game.getCurrScene();
        this.game.getRenderer().container.removeEventListener('mouseleave',this.blurListener);
        this.gameObject.off(MOUSE_EVENTS.click,this.gameObjectOnClick);
        scene.off(MOUSE_EVENTS.mouseDown,this.sceneOnMouseDown);
        scene.off(MOUSE_EVENTS.mouseMove,this.sceneOnMouseMove);
        scene.off(MOUSE_EVENTS.mouseDown,this.sceneOnMouseUp);
    }

}


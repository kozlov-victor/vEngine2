import {BaseAbstractBehaviour} from "../abstract/baseAbstractBehaviour";
import {Game} from "../../core/game";
import {Scene} from "../../scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IMousePoint} from "@engine/control/mouse/mousePoint";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Int} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";

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

    private static _getEventId(e:IMousePoint):Int{
        return (e.id || 1) as Int;
    }

    private blurListener:(e:MouseEvent)=>void;
    private gameObjectOnClick:(e:IMousePoint)=>void;
    private sceneOnMouseDown:()=>void;
    private sceneOnMouseMove:()=>void;
    private sceneOnMouseUp:()=>void;

    private readonly points:{[key:number]:IMouseDragPoint} = {};
    private gameObject:RenderableModel;

    constructor(game:Game){
        super(game,{});
    }

    public manage(gameObject:RenderableModel):void {
        if (DEBUG && this.gameObject) {
            throw new DebugError(`DraggableBehaviour is already used by another RenderableModel`);
        }
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
            } as IMouseDragPoint;
        });
        const scene:Scene = this.game.getCurrScene();
        this.sceneOnMouseDown = scene.on(MOUSE_EVENTS.mouseDown,(e:IMousePoint)=>{
            const pointId:number = DraggableBehaviour._getEventId(e);
            const point:IMouseDragPoint = this.points[pointId];
            if (!point) return;
            point.dragStartX = point.target.pos.x;
            point.dragStartY = point.target.pos.y;
        });
        this.sceneOnMouseMove = scene.on(MOUSE_EVENTS.mouseMove,(e:IMousePoint)=>{
            const pointId = DraggableBehaviour._getEventId(e);
            const point:IMouseDragPoint = this.points[pointId];
            if (!point) return;
            if (!point.dragStart) {
                point.dragStart = true;
                gameObject.trigger(MOUSE_EVENTS.dragStart,point);
                if (point.defaultPrevented) {
                    delete this.points[pointId];
                    return;
                }
            }
            gameObject.pos.x = e.screenX - point.mX;
            gameObject.pos.y = e.screenY - point.mY;
        });
        this.sceneOnMouseUp = scene.on(MOUSE_EVENTS.mouseUp,(e:IMousePoint)=>{
            const pointId:number = DraggableBehaviour._getEventId(e);
            const point:IMouseDragPoint = this.points[pointId];
            if (!point) return;
            if (point.dragStart) {
                point.x = gameObject.pos.x;
                point.y = gameObject.pos.y;
                gameObject.trigger(MOUSE_EVENTS.dragStop,point);
            }
            delete this.points[pointId];
        });
        this.blurListener = (e)=>{
            scene.trigger(MOUSE_EVENTS.mouseUp,e);
        };
        this.game.getRenderer().container.addEventListener('mouseleave',this.blurListener);
    }

    public revalidate() {
        super.revalidate();
        if (DEBUG && (this.gameObject.size.isZero())) throw new DebugError(`can not apply DraggableBehaviour ot object with zero render size. Current size is ${this.gameObject.size.toJSON()}`);
    }

    public destroy():void{
        const scene:Scene = this.game.getCurrScene();
        this.game.getRenderer().container.removeEventListener('mouseleave',this.blurListener);
        this.gameObject.off(MOUSE_EVENTS.click,this.gameObjectOnClick);
        scene.off(MOUSE_EVENTS.mouseDown,this.sceneOnMouseDown);
        scene.off(MOUSE_EVENTS.mouseMove,this.sceneOnMouseMove);
        scene.off(MOUSE_EVENTS.mouseDown,this.sceneOnMouseUp);
    }

}


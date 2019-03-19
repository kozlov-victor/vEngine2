
import {MathEx} from "../../mathEx";
import {Point2d} from "../../geometry/point2d";
import {Game} from "../../game";
import {Scene} from "@engine/model/impl/scene";
import {Rect} from "../../geometry/rect";
import {RenderableModel} from "@engine/model/renderableModel";
import {IControl} from "@engine/core/control/abstract/iControl";
import {DebugError} from "@engine/debugError";
import {IMousePoint, MousePoint} from "@engine/core/control/mouse/mousePoint";
import {MOUSE_EVENTS} from "@engine/core/control/mouse/mouseEvents";





export class Mouse implements IControl {

    readonly type:string = 'Mouse';
    private objectsCaptured:{[pointId:number]:RenderableModel} = {};
    private container:HTMLElement;
    private readonly game:Game;

    constructor(game:Game){
        this.game = game;
    }


    resolvePoint(e:MouseEvent|TouchEvent|Touch|PointerEvent):MousePoint{
        let game:Game = this.game;
        let clientX:number = <number>(e as any).clientX;
        let clientY:number = <number>(e as any).clientY;

        let screenX:number = (clientX - game.pos.x ) / game.scale.x;
        let screenY:number = (clientY - game.pos.y ) / game.scale.y;

        const screenPoint:Point2d = Point2d.fromPool();
        screenPoint.setXY(screenX,screenY);
        let p:Point2d = game.camera.screenToWorld(screenPoint);
        screenPoint.release();

        let mousePoint:MousePoint = MousePoint.fromPool();
        mousePoint.set(p);
        mousePoint.screenX = screenX;
        mousePoint.screenY = screenY;
        mousePoint.id = (e as Touch).identifier  || 0; // (e as PointerEvent).pointerId
        mousePoint.release();
        return mousePoint;
    }

    private static triggerGameObjectEvent(
        e:MouseEvent|TouchEvent|Touch,
        eventName:string,point:MousePoint,
        go:RenderableModel,offsetX = 0, offsetY = 0):boolean{

        let rectWithOffset = Rect.fromPool().clone().set(go.getRect()).addXY(offsetX,offsetY);
        if (
            MathEx.isPointInRect(point,rectWithOffset)
        ) {
            point.target = go;
            go.trigger(eventName,{
                screenX:point.x,
                screenY:point.y,
                objectX:point.x - go.pos.x,
                objectY:point.y - go.pos.y,
                id:point.id,
                target:go,
                nativeEvent: e,
                eventName,
                isMouseDown: point.isMouseDown
            } as IMousePoint);
            return true;
        }
        return false;
    }


    triggerEvent(e:MouseEvent|TouchEvent|Touch,eventName:string,isMouseDown?:boolean):MousePoint{
        if (isMouseDown===undefined) isMouseDown = false;
        let g:Game = this.game;
        let scene:Scene = g.getCurrScene();
        if (!scene) return;
        let point:MousePoint = this.resolvePoint(e);
        point.isMouseDown = isMouseDown;
        point.target = undefined;

        for (let go of scene.getAllGameObjects()) {
            let isCaptured:boolean = Mouse.triggerGameObjectEvent(e,eventName,point,go);
            if (isCaptured) {
                point.target = go;
                break;
            }
        }

        // todo I will do it later!
        // let untransformedPoint = MousePoint.unTransform(point);
        // for (let j=0;j<scene.uiLayer.children.length;j++){
        //     let go = scene.uiLayer.children[scene.uiLayer.children.length - 1 - j];
        //     let isCaptured:boolean = Mouse.triggerGameObjectEvent(e,eventName,untransformedPoint,go);
        //     if (isCaptured) {
        //         if (go.children) this.triggerChildren(e,go.children,eventName,untransformedPoint,go.pos.x,go.pos.y);
        //         break;
        //     }
        // }
        // if (untransformedPoint.target) point.target = untransformedPoint.target;

        if (point.target===undefined) point.target = scene;
        scene.trigger(eventName,{
            screenX:point.x,
            screenY:point.y,
            id:point.id,
            target:scene,
            eventName,
            isMouseDown
        });
        return point;
    }

    resolveClick(e:TouchEvent|MouseEvent){
        this.triggerEvent(e,MOUSE_EVENTS.click);
        this.triggerEvent(e,MOUSE_EVENTS.mouseDown);
    }

    resolveMouseMove(e:Touch|MouseEvent,isMouseDown:boolean){
        let point:MousePoint = this.triggerEvent(e,MOUSE_EVENTS.mouseMove,isMouseDown);
        if (!point) return;
        let lastMouseDownObject:RenderableModel = this.objectsCaptured[point.id];
        if (lastMouseDownObject && lastMouseDownObject!==point.target) {
            lastMouseDownObject.trigger(MOUSE_EVENTS.mouseLeave,point);
            delete this.objectsCaptured[point.id];
        }

        if (point.target && lastMouseDownObject!==point.target) {
            point.target.trigger(MOUSE_EVENTS.mouseEnter,point);
            this.objectsCaptured[point.id] = point.target as RenderableModel;
        }
    }

    resolveMouseUp(e:MouseEvent|Touch){
        let point:MousePoint = this.triggerEvent(e,MOUSE_EVENTS.mouseUp);
        if (!point) return;
        let lastMouseDownObject = this.objectsCaptured[point.id];
        if (!lastMouseDownObject) return;
        if (point.target!==lastMouseDownObject) lastMouseDownObject.trigger(MOUSE_EVENTS.mouseUp,point);
        delete this.objectsCaptured[point.id];
    }

    resolveDoubleClick(e:MouseEvent){
        let point = this.triggerEvent(e,MOUSE_EVENTS.doubleClick);
        if (!point) return;
        delete this.objectsCaptured[point.id];
    }

    resolveScroll(e:MouseEvent){
        let point = this.triggerEvent(e,MOUSE_EVENTS.scroll);
        if (!point) return;
        delete this.objectsCaptured[point.id];
    }

    listenTo() {

        if (DEBUG && !this.game.getRenderer()) {
            throw new DebugError(`can not initialize mouse control: renderer is not set`);
        }
        const container:HTMLElement = this.game.getRenderer().container;

        this.container = container;
        // mouseDown
        container.ontouchstart = (e:TouchEvent)=>{
            let l = e.touches.length;
            while (l--){
                this.resolveClick((e.touches[l] as any));
            }
        };
        container.onmousedown = (e:MouseEvent)=>{
            (e.button === 0) && this.resolveClick(e);
        };
        // mouseUp
        container.ontouchend = container.ontouchcancel = (e:TouchEvent)=>{
            let l = e.changedTouches.length;
            while (l--){
                this.resolveMouseUp(e.changedTouches[l]);
            }
        };
        container.onmouseup = (e:MouseEvent)=>{
            this.resolveMouseUp(e);
        };
        // mouseMove
        container.ontouchmove = (e:TouchEvent)=>{
            let l = e.touches.length;
            while (l--){
                this.resolveMouseMove(e.touches[l],true);
            }
        };
        container.onmousemove = (e:MouseEvent)=>{
            let isMouseDown = e.buttons === 1;
            this.resolveMouseMove(e,isMouseDown);
        };
        // other
        container.ondblclick = (e:MouseEvent)=>{ // todo now only on pc
            this.resolveDoubleClick(e);
        };
        container.onmousewheel = (e:MouseEvent)=>{
            this.resolveScroll(e);
        }
    }

    update(){}

    destroy(){
            if (!this.container) return;
        [
            'mouseMove','ontouchstart','onmousedown',
            'ontouchend','onmouseup','ontouchmove',
            'onmousemove','ondblclick'].forEach((evtName:string)=>{
            (this.container as any)[evtName] = null;
        })
    }

}
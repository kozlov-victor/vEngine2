import {MathEx} from "../../misc/mathEx";
import {Point2d} from "../../geometry/point2d";
import {Game} from "../../game";
import {Scene} from "@engine/model/impl/general/scene";
import {Rect} from "../../geometry/rect";
import {RenderableModel} from "@engine/model/abstract/renderableModel";
import {IControl} from "@engine/control/abstract/iControl";
import {DebugError} from "@engine/debug/debugError";
import {IMousePoint, MousePoint} from "@engine/control/mouse/mousePoint";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Layer} from "@engine/model/impl/general/layer";


export class MouseControl implements IControl {

    private static triggerGameObjectEvent(
        e:MouseEvent|TouchEvent|Touch,
        eventName:MOUSE_EVENTS,point:MousePoint,
        go:RenderableModel):boolean{

        const rectWithOffset:Rect = Rect.fromPool().set(go.getWorldRect());
        let res:boolean = false;
        if (
            MathEx.isPointInRect(point,rectWithOffset)
        ) {
            point.target = go;
            const iMousePoint:IMousePoint = {
                screenX:point.x,
                screenY:point.y,
                objectX:point.x - go.pos.x,
                objectY:point.y - go.pos.y,
                id:point.id,
                target:go,
                nativeEvent: e as Event,
                eventName,
                isMouseDown: point.isMouseDown
            };
            go.trigger(eventName as string,iMousePoint);
            res = !go.passMouseEventsThrough;
        }
        rectWithOffset.release();
        for (const ch of go.children) {
            res = res || MouseControl.triggerGameObjectEvent(e,eventName,point,ch);
        }
        return res;
    }

    public readonly type:string = 'MouseControl';
    private objectsCaptured:{[pointId:number]:RenderableModel} = {};
    private container:HTMLElement;
    private readonly game:Game;

    constructor(game:Game){
        this.game = game;
    }


    public resolvePoint(e:MouseEvent|Touch|PointerEvent):MousePoint{
        const game:Game = this.game;
        const clientX:number = e.clientX;
        const clientY:number = e.clientY;

        const screenX:number = (clientX - game.pos.x ) / game.scale.x;
        const screenY:number = (clientY - game.pos.y ) / game.scale.y;

        const screenPoint:Point2d = Point2d.fromPool();
        screenPoint.setXY(screenX,screenY);
        const p:Point2d = game.camera.screenToWorld(screenPoint);
        screenPoint.release();

        const mousePoint:MousePoint = MousePoint.fromPool();
        mousePoint.set(p);
        mousePoint.screenX = screenX;
        mousePoint.screenY = screenY;
        mousePoint.id = (e as Touch).identifier  || (e as PointerEvent).pointerId || 0;
        mousePoint.release();

        return mousePoint;
    }


    public triggerEvent(e:MouseEvent|Touch|Touch,eventName:MOUSE_EVENTS,isMouseDown?:boolean):MousePoint{
        if (isMouseDown===undefined) isMouseDown = false;
        const g:Game = this.game;
        const scene:Scene = g.getCurrScene();
        if (!scene) return null;
        const point:MousePoint = this.resolvePoint(e);
        point.isMouseDown = isMouseDown;
        point.target = undefined;

        let isCaptured:boolean = false;
        let i:number = scene.getLayers().length; // reversed loop
        while(i--) {
            const layer:Layer = scene.getLayers()[i];
            let j:number = layer.children.length;
            while(j--) {
               const go:RenderableModel = layer.children[j];
               isCaptured = MouseControl.triggerGameObjectEvent(e,eventName,point,go);
               if (isCaptured) {
                    point.target = go;
                    break;
                }
            }
            if (isCaptured) break;
        }


        // todo I will do it later!
        // let untransformedPoint = MousePoint.unTransform(point);
        // for (let j=0;j<scene.uiLayer.children.length;j++){
        //     let go = scene.uiLayer.children[scene.uiLayer.children.length - 1 - j];
        //     let isCaptured:boolean = MouseControl.triggerGameObjectEvent(e,eventName,untransformedPoint,go);
        //     if (isCaptured) {
        //         if (go.children) this.triggerChildren(e,go.children,eventName,untransformedPoint,go.pos.x,go.pos.y);
        //         break;
        //     }
        // }
        // if (untransformedPoint.target) point.target = untransformedPoint.target;

        if (point.target===undefined) point.target = scene;
        scene.trigger(eventName as string,{
            screenX:point.x,
            screenY:point.y,
            id:point.id,
            target:scene,
            eventName,
            isMouseDown
        });
        return point;
    }

    public resolveClick(e:Touch|MouseEvent):void {
        this.triggerEvent(e,MOUSE_EVENTS.click);
        this.triggerEvent(e,MOUSE_EVENTS.mouseDown);
    }

    public resolveMouseMove(e:Touch|MouseEvent,isMouseDown:boolean):void {
        const point:MousePoint = this.triggerEvent(e,MOUSE_EVENTS.mouseMove,isMouseDown);
        if (!point) return;
        const lastMouseDownObject:RenderableModel = this.objectsCaptured[point.id];
        if (lastMouseDownObject && lastMouseDownObject!==point.target) {
            lastMouseDownObject.trigger(MOUSE_EVENTS.mouseLeave as string,point);
            delete this.objectsCaptured[point.id];
        }

        if (point.target && lastMouseDownObject!==point.target) {
            point.target.trigger(MOUSE_EVENTS.mouseEnter as string,point);
            this.objectsCaptured[point.id] = point.target as RenderableModel;
        }
    }

    public resolveMouseUp(e:MouseEvent|Touch):void {
        const point:MousePoint = this.triggerEvent(e,MOUSE_EVENTS.mouseUp);
        if (!point) return;
        const lastMouseDownObject = this.objectsCaptured[point.id];
        if (!lastMouseDownObject) return;
        if (point.target!==lastMouseDownObject) lastMouseDownObject.trigger(MOUSE_EVENTS.mouseUp as string,point);
        delete this.objectsCaptured[point.id];
    }

    public resolveDoubleClick(e:MouseEvent):void {
        const point:MousePoint = this.triggerEvent(e,MOUSE_EVENTS.doubleClick);
        if (!point) return;
        delete this.objectsCaptured[point.id];
    }

    public resolveScroll(e:MouseEvent):void {
        const point:MousePoint = this.triggerEvent(e,MOUSE_EVENTS.scroll);
        if (!point) return;
        delete this.objectsCaptured[point.id];
    }

    public listenTo():void {
        if (DEBUG && !this.game.getRenderer()) {
            throw new DebugError(`can not initialize mouse control: renderer is not set`);
        }
        const container:HTMLElement = this.game.getRenderer().container;

        this.container = container;
        // mouseDown
        container.ontouchstart = (e:TouchEvent)=>{
            let l = e.touches.length;
            while (l--){
                this.resolveClick((e.touches[l] as Touch));
            }
        };
        container.onmousedown = (e:MouseEvent)=>{
            if (e.button === 0) this.resolveClick(e);
        };
        // mouseUp
        container.ontouchend = container.ontouchcancel = (e:TouchEvent)=>{
            let l:number = e.changedTouches.length;
            while (l--){
                this.resolveMouseUp(e.changedTouches[l]);
            }
        };
        container.onmouseup = (e:MouseEvent)=>{
            this.resolveMouseUp(e);
        };
        // mouseMove
        container.ontouchmove = (e:TouchEvent)=>{
            let l:number = e.touches.length;
            while (l--){
                this.resolveMouseMove(e.touches[l],true);
            }
        };
        container.onmousemove = (e:MouseEvent)=>{
            const isMouseDown:boolean = e.buttons === 1;
            this.resolveMouseMove(e,isMouseDown);
        };
        // other
        container.ondblclick = (e:MouseEvent)=>{ // todo now only on pc
            this.resolveDoubleClick(e);
        };
        (container as any).onmousewheel = (e:MouseEvent)=>{
            e.preventDefault();
            e.stopPropagation(); // to prevent page scroll
            this.resolveScroll(e);
        };
    }

    public update():void{}

    public destroy():void {
            if (!this.container) return;
            [
            'mouseMove','ontouchstart','onmousedown',
            'ontouchend','onmouseup','ontouchmove',
            'onmousemove','ondblclick'].forEach((evtName:string)=>{
            (this.container as any)[evtName] = null;
        });
    }

}
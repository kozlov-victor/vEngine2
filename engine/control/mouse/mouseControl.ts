import {Game} from "../../core/game";
import {Scene} from "@engine/scene/scene";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IControl} from "@engine/control/abstract/iControl";
import {DebugError} from "@engine/debug/debugError";
import {IObjectMouseEvent, ISceneMouseEvent, MousePoint} from "@engine/control/mouse/mousePoint";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Layer, LayerTransformType} from "@engine/scene/layer";
import {MouseControlHelper} from "@engine/control/mouse/mouseControlHelper";
import {Optional} from "@engine/core/declarations";
import {CapturedObjectsByTouchIdHolder} from "@engine/control/mouse/capturedObjectsByTouchIdHolder";
import {RenderingObjectStackItem} from "@engine/scene/internal/renderingObjectStack";


const LEFT_MOUSE_BTN  = 0 as const;

class MouseEventTrottler {
    private event:MOUSE_EVENTS;
    private lastX:number;
    private lastY:number;

    public checkSameEventAndSet(event:MOUSE_EVENTS, x:number, y:number):boolean {
        x = ~~x; // pointer events can generate coordinates with decimal part
        y = ~~y;
        if (
            this.event===event &&
            this.lastX===x &&
            this.lastY===y
        ) {
            return true;
        } else {
            this.event = event;
            this.lastX = x;
            this.lastY = y;
            return false;
        }
    }

    public checkSameEvent(event:MOUSE_EVENTS):boolean {
        return this.event===event;
    }

}

export class MouseControl implements IControl {

    public readonly type:string = 'MouseControl';
    private _helper:MouseControlHelper = new MouseControlHelper(this.game);
    private _capturedObjectsByTouchIdHolder:CapturedObjectsByTouchIdHolder = new CapturedObjectsByTouchIdHolder();
    private _capturedObjectsByTouchIdPrevHolder:CapturedObjectsByTouchIdHolder = new CapturedObjectsByTouchIdHolder();
    private _container:HTMLElement;
    private _mouseEventTrottler = new MouseEventTrottler();

    constructor(private game:Game){
    }

    public listenTo():void {
        if (DEBUG && !this.game.getRenderer()) {
            throw new DebugError(`can not initialize mouse control: renderer is not set`);
        }
        const container:HTMLElement = this.game.getRenderer().container;

        this._container = container;
        // mouseDown
        container.ontouchstart = (e:TouchEvent):void=>{
            // to prevent "mouse" events on touch devices - https://www.html5rocks.com/en/mobile/touchandmouse/
            e.preventDefault();
            if (this._mouseEventTrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseDown, e.touches[0].clientX,e.touches[0].clientY)) {
                return;
            }

            //console.log('ontouchstart');
            let l = e.touches.length;
            while (l--){
                this.resolveClick((e.touches[l] as Touch));
            }
        };
        container.onmousedown = (e:MouseEvent):void=>{
            if (this._mouseEventTrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseDown, e.clientX,e.clientY)) {
                return;
            }

            //console.log('onmousedown');
            if (e.button === LEFT_MOUSE_BTN) this.resolveClick(e);
            else {
                this.resolveButtonPressed(e);
            }
        };
        container.onpointerdown = (e:MouseEvent):void=>{
            if (this._mouseEventTrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseDown, e.clientX,e.clientY)) {
                return;
            }
            this.resolveClick(e);
        };
        // mouseUp
        container.ontouchend = container.ontouchcancel = (e:TouchEvent):void=>{
            if (this._mouseEventTrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseUp, e.changedTouches[0].clientX,e.changedTouches[0].clientY)) {
                return;
            }

            //console.log('ontouchend');
            e.preventDefault();
            let l:number = e.changedTouches.length;
            while (l--){
                this.resolveMouseUp(e.changedTouches[l]);
            }
        };
        document.body.ontouchend = document.body.ontouchcancel = (e:TouchEvent):void=>{
            if (this._mouseEventTrottler.checkSameEvent(MOUSE_EVENTS.mouseUp)) {
                return;
            }
            let l:number = e.changedTouches.length;

            //console.log('ontouchend body');
            while (l--){
                const point:MousePoint = this._helper.resolvePoint(e.changedTouches[l]);
                this.resolveMouseUp(e.changedTouches[l]);
                point.release();
            }
        };
        container.onpointerup =
            container.onpointercancel =
            container.onpointerleave =
            container.onpointerup =
                (e: MouseEvent):void=>{
                    if (this._mouseEventTrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseUp, e.clientX,e.clientY)) {
                        return;
                    }

                    //console.log('onpointerup');
                    this.resolveMouseUp(e);
                };
        container.onmouseup = (e:MouseEvent):void=>{
            if (this._mouseEventTrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseUp, e.clientX,e.clientY)) {
                return;
            }

            //console.log('onmouseup');
            this.resolveMouseUp(e);
        };
        document.body.onpointerup = (e: MouseEvent):void=>{
            if (this._mouseEventTrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseUp, e.clientX,e.clientY)) {
                return;
            }
            this.resolveMouseUp(e);
        };
        document.body.onmouseup = (e: MouseEvent):void=>{
            if (this._mouseEventTrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseUp, e.clientX,e.clientY)) {
                return;
            }
            this.resolveMouseUp(e);
        };
        // mouseMove
        container.ontouchmove = (e:TouchEvent):void=>{
            if (this._mouseEventTrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseMove, e.touches[0].clientX,e.touches[0].clientY)) {
                return;
            }
            //console.log('ontouchmove');
            e.preventDefault(); // to prevent canvas moving
            let l:number = e.touches.length;
            while (l--){
                this.resolveMouseMove(e.touches[l],true);
            }
        };
        container.onpointermove = (e:PointerEvent):void=>{
            if (e.pointerType!=='pen') return; // only for pen support
            if (this._mouseEventTrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseMove, e.clientX,e.clientY)) {
                return;
            }
            this.resolveMouseMove(e,e.pressure>0);
        };
        container.onmousemove = (e:MouseEvent):void=>{
            if (this._mouseEventTrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseMove, e.clientX,e.clientY)) {
                return;
            }

            //console.log('mousemove',e.clientX,e.clientY,e.buttons,e.button);
            const isMouseDown:boolean = e.buttons === 1;
            this.resolveMouseMove(e,isMouseDown);
        };
        // other
        container.ondblclick = (e:MouseEvent):void=>{ // todo now only on pc
            this.resolveDoubleClick(e);
        };
        (container as unknown as {onmousewheel:(e:MouseEvent)=>void}).onmousewheel = (e:MouseEvent):void=>{
            e.preventDefault();
            e.stopPropagation(); // to prevent page scroll
            this.resolveScroll(e);
        };
    }

    public update():void{}

    public destroy():void {
            if (!this._container) return;
            [
            'mouseMove','ontouchstart','onmousedown',
            'ontouchend','onmouseup','ontouchmove',
            'onpointerup', 'onpointermove','onpointerdown',
            'onmousemove','ondblclick'].forEach((evtName:string)=>{
                // eslint-disable-next-line @typescript-eslint/ban-types
            (this._container as unknown as Record<string,null>)[evtName] = null;
            document.body.ontouchend =
                document.body.ontouchcancel =
                document.body.onmouseup =
                document.body.onpointerup =
                null;
        });
    }

    private triggerEvent(e:MouseEvent|Touch, mouseEvent:MOUSE_EVENTS, isMouseDown:boolean = false):MousePoint{
        const scene:Scene = this.game.getCurrentScene();
        const mousePoint:MousePoint = this._helper.resolvePoint(e);
        mousePoint.isMouseDown = isMouseDown;

        const objectStackItems:RenderingObjectStackItem[] = this.game.getCurrentScene()._renderingObjectStack.get();
        let i:number = objectStackItems.length; // reversed loop
        if (mouseEvent===MOUSE_EVENTS.mouseMove) this._capturedObjectsByTouchIdHolder.clear(mousePoint.id);

        let propagationCancelled = false;

        if (i===0) {
            this._helper.resolveSceneCoordinates(mousePoint,LayerTransformType.TRANSFORM);
        } else {
            // trigger the most top object
            while(i--) {
                const objectStackItem:RenderingObjectStackItem = objectStackItems[i];
                const obj:RenderableModel = objectStackItem.obj;
                const constrainObjects:RenderableModel[] = objectStackItem.constrainObjects;
                const layer:Layer = obj.getLayer();
                if (layer===undefined) continue;

                this._helper.resolveSceneCoordinates(mousePoint,layer.transformType);
                const capturedEvent:Optional<IObjectMouseEvent> = this._helper.captureObject(e, mouseEvent, mousePoint, obj, obj, constrainObjects);
                if (capturedEvent!==undefined) {
                    if (!capturedEvent.isPropagated) {
                        propagationCancelled = true;
                        break;
                    }
                    if (mouseEvent===MOUSE_EVENTS.mouseMove) this._capturedObjectsByTouchIdHolder.add(mousePoint.id,obj);
                    // propagate event to parents
                    let parent:Optional<RenderableModel> = obj.parent;
                    while (parent!==undefined) {
                        const propagationEvent:Optional<IObjectMouseEvent> =
                            this._helper.captureObject(e,mouseEvent,mousePoint,parent, obj, constrainObjects);
                        if (propagationEvent!==undefined) {
                            if (!propagationEvent.isPropagated) {
                                propagationCancelled = true;
                                break;
                            }
                            if (mouseEvent===MOUSE_EVENTS.mouseMove) this._capturedObjectsByTouchIdHolder.add(mousePoint.id,parent);
                        }
                        parent = parent.parent;
                    }
                    break;
                }
            }
        }
        if (scene.interactive && !propagationCancelled) {
            if (mousePoint.target===undefined) mousePoint.target = scene;
            scene.mouseEventHandler.trigger(mouseEvent,{
                screenX:mousePoint.screenCoordinate.x,
                screenY:mousePoint.screenCoordinate.y,
                sceneX: mousePoint.sceneCoordinate.x,
                sceneY: mousePoint.sceneCoordinate.y,
                id:mousePoint.id,
                eventName: mouseEvent,
                nativeEvent: e as Event,
                button: (e as MouseEvent).buttons,
                isMouseDown,
            } as ISceneMouseEvent);
        }


        return mousePoint;
    }

    private resolveClick(e:Touch|MouseEvent):void {
        const point:MousePoint = this.triggerEvent(e,MOUSE_EVENTS.click);
        this.triggerEvent(e,MOUSE_EVENTS.mouseDown).release();
        point.release();
    }

    private resolveButtonPressed(e:Touch|MouseEvent):void {
        const point:MousePoint = this.triggerEvent(e,MOUSE_EVENTS.click);
        this.triggerEvent(e,MOUSE_EVENTS.mousePressed).release();
        point.release();
    }

    private resolveMouseMove(e:Touch|MouseEvent|PointerEvent,isMouseDown:boolean):void {
        const point:MousePoint = this.triggerEvent(e,MOUSE_EVENTS.mouseMove,isMouseDown);
        const capturedNew:RenderableModel[] = this._capturedObjectsByTouchIdHolder.getByTouchId(point.id);
        const capturedOld:RenderableModel[] = this._capturedObjectsByTouchIdPrevHolder.getByTouchId(point.id);
        // mouse enter
        for (let i:number = 0; i < capturedNew.length; i++) {
            const obj:RenderableModel = capturedNew[i];
            if (capturedOld.indexOf(obj)===-1) {
                this._helper.triggerEventForObject(e, MOUSE_EVENTS.mouseEnter, point, obj, obj);
            }
        }
        // mouse leave
        for (let i:number = 0; i < capturedOld.length; i++) {
            const obj:RenderableModel = capturedOld[i];
            if (capturedNew.indexOf(obj)===-1) {
                this._helper.triggerEventForObject(e, MOUSE_EVENTS.mouseLeave, point, obj, obj);
            }
        }
        // swap captured objects
        this._capturedObjectsByTouchIdPrevHolder.clear(point.id);
        for (let i:number = 0; i < capturedNew.length; i++) {
            this._capturedObjectsByTouchIdPrevHolder.add(point.id,capturedNew[i]);
        }
        point.release();
    }

    private resolveMouseUp(e:MouseEvent|Touch):void {
        const point:MousePoint = this.triggerEvent(e,MOUSE_EVENTS.mouseUp);
        const capturedNew:RenderableModel[] = this._capturedObjectsByTouchIdHolder.getByTouchId(point.id);
        const capturedOld:RenderableModel[] = this._capturedObjectsByTouchIdPrevHolder.getByTouchId(point.id);
        for (let i = 0; i < capturedOld.length; i++) {
            const obj:RenderableModel = capturedOld[i];
            if (capturedNew.indexOf(obj)===-1) {
                this._helper.triggerEventForObject(e, MOUSE_EVENTS.mouseUp, point, obj, obj);
            }
        }
        this._capturedObjectsByTouchIdPrevHolder.clear(point.id);
        this._capturedObjectsByTouchIdHolder.clear(point.id);
        point.release();
    }

    private resolveDoubleClick(e:MouseEvent):void {
        this.triggerEvent(e,MOUSE_EVENTS.doubleClick).release();
    }

    private resolveScroll(e:MouseEvent):void {
        this.triggerEvent(e,MOUSE_EVENTS.scroll).release();
    }

}

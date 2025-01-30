import {Game} from "../../core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IControl} from "@engine/control/abstract/iControl";
import {DebugError} from "@engine/debug/debugError";
import {MousePoint, ObjectMouseEvent, SceneMouseEvent} from "@engine/control/mouse/mousePoint";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {LayerTransformType} from "@engine/scene/layer";
import {MouseControlHelper} from "@engine/control/mouse/mouseControlHelper";
import {Optional} from "@engine/core/declarations";
import {CapturedObjectsByTouchIdHolder} from "@engine/control/mouse/capturedObjectsByTouchIdHolder";


const LEFT_MOUSE_BTN  = 1 as const;
const RIGHT_MOUSE_BTN  = 2 as const;

class MouseEventThrottler {
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
    private _helper = new MouseControlHelper(this.game);
    private _capturedObjectsByTouchIdHolder = new CapturedObjectsByTouchIdHolder();
    private _capturedObjectsByTouchIdPrevHolder = new CapturedObjectsByTouchIdHolder();
    private _container:HTMLElement;
    private mouseEventThrottler = new MouseEventThrottler();

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
            if (this.mouseEventThrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseDown, e.touches[0].clientX,e.touches[0].clientY)) {
                return;
            }

            //console.log('on touch start');
            let l = e.touches.length;
            while (l--){
                this.resolveClick((e.touches[l] as Touch));
            }
        };
        container.onmousedown = (e:MouseEvent):void=>{
            if (this.mouseEventThrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseDown, e.clientX,e.clientY)) {
                return;
            }

            //console.log('on moused down');
            if (e.buttons === LEFT_MOUSE_BTN) this.resolveClick(e);
            if (e.buttons === RIGHT_MOUSE_BTN) this.resolveRightClick(e);
            else this.resolveMouseDown(e,e.buttons);
        };
        container.onpointerdown = (e:PointerEvent):void=>{
            if (this.mouseEventThrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseDown, e.clientX,e.clientY)) {
                return;
            }
            //console.log('on pointer down',e);
            if (e.buttons === LEFT_MOUSE_BTN) this.resolveClick(e);
            else if (e.buttons === RIGHT_MOUSE_BTN) this.resolveRightClick(e);
            else this.resolveMouseDown(e,e.buttons);
        };
        // mouseUp
        container.ontouchend = container.ontouchcancel = (e:TouchEvent):void=>{
            if (this.mouseEventThrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseUp, e.changedTouches[0].clientX,e.changedTouches[0].clientY)) {
                return;
            }

            //console.log('ontouchend');
            e.preventDefault();
            let l:number = e.changedTouches.length;
            while (l--){
                this.resolveMouseUp(e.changedTouches[l],LEFT_MOUSE_BTN);
            }
        };
        document.body.ontouchend = document.body.ontouchcancel = (e:TouchEvent):void=>{
            if (this.mouseEventThrottler.checkSameEvent(MOUSE_EVENTS.mouseUp)) {
                return;
            }
            let l:number = e.changedTouches.length;

            //console.log('ontouchend body');
            while (l--){
                const point = this._helper.resolvePoint(e.changedTouches[l]);
                this.resolveMouseUp(e.changedTouches[l],LEFT_MOUSE_BTN);
                MousePoint.pool.recycle(point);
            }
        };
        container.onpointerup =
            container.onpointercancel =
            container.onpointerleave =
            container.onpointerup =
                (e: PointerEvent):void=>{
                    if (this.mouseEventThrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseUp, e.clientX,e.clientY)) {
                        return;
                    }

                    //console.log('onpointerup');
                    this.resolveMouseUp(e,LEFT_MOUSE_BTN);
                };
        container.onmouseup = (e:MouseEvent):void=>{
            if (this.mouseEventThrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseUp, e.clientX,e.clientY)) {
                return;
            }

            //console.log('onmouseup');
            this.resolveMouseUp(e,e.buttons);
        };
        document.body.onpointerup = (e: PointerEvent):void=>{
            if (this.mouseEventThrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseUp, e.clientX,e.clientY)) {
                return;
            }
            this.resolveMouseUp(e,e.buttons);
        };
        document.body.onmouseup = (e: MouseEvent):void=>{
            if (this.mouseEventThrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseUp, e.clientX,e.clientY)) {
                return;
            }
            this.resolveMouseUp(e,e.buttons);
        };
        // mouseMove
        container.ontouchmove = (e:TouchEvent):void=>{
            if (this.mouseEventThrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseMove, e.touches[0].clientX,e.touches[0].clientY)) {
                return;
            }
            //console.log('ontouchmove');
            e.preventDefault(); // to prevent canvas moving
            let l:number = e.touches.length;
            while (l--){
                this.resolveMouseMove(e.touches[l],LEFT_MOUSE_BTN);
            }
        };
        container.onpointermove = (e:PointerEvent):void=>{
            if (e.pointerType!=='pen') return; // only for pen support
            if (this.mouseEventThrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseMove, e.clientX,e.clientY)) {
                return;
            }
            this.resolveMouseMove(e,e.pressure>0?LEFT_MOUSE_BTN:undefined);
        };
        container.onmousemove = (e:MouseEvent):void=>{
            if (this.mouseEventThrottler.checkSameEventAndSet(MOUSE_EVENTS.mouseMove, e.clientX,e.clientY)) {
                return;
            }

            //console.log('mousemove',e.clientX,e.clientY,e.buttons,e.button);
            const button = e.button===0?undefined:e.button;
            this.resolveMouseMove(e,button);
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
            (this._container as unknown as Record<string,null>)[evtName] = null;
            document.body.ontouchend =
                document.body.ontouchcancel =
                document.body.onmouseup =
                document.body.onpointerup =
                null;
        });
    }

    private triggerEvent(e:MouseEvent|Touch, mouseEvent:MOUSE_EVENTS, mouseButton?: number):MousePoint{
        const scene = this.game.getCurrentScene();
        const mousePoint = this._helper.resolvePoint(e);
        mousePoint.isMouseDown = mouseButton!==undefined;
        mousePoint.button = mouseButton;

        const objectStackItems = this.game.getCurrentScene()._renderingObjectStack.get();
        let i = objectStackItems.length; // reversed loop
        if (mouseEvent===MOUSE_EVENTS.mouseMove) this._capturedObjectsByTouchIdHolder.clear(mousePoint.id);

        let propagationCancelled = false;

        if (i===0) {
            this._helper.resolveSceneCoordinates(mousePoint,LayerTransformType.TRANSFORM);
        } else {
            // trigger the most top object
            while(i--) {
                const objectStackItem = objectStackItems[i];
                const obj = objectStackItem.obj;
                const constrainObjects = objectStackItem.constrainObjects;
                const layer = obj.getLayer();
                if (layer===undefined) continue;

                this._helper.resolveSceneCoordinates(mousePoint,layer.transformType);
                const capturedEvent = this._helper.captureObject(e, mouseEvent, mousePoint, obj, obj, constrainObjects);
                if (capturedEvent!==undefined) {
                    if (!capturedEvent.transclude) {
                        propagationCancelled = true;
                        break;
                    }
                    if (mouseEvent===MOUSE_EVENTS.mouseMove) this._capturedObjectsByTouchIdHolder.add(mousePoint.id,obj);
                    // propagate event to parents
                    let parent:Optional<RenderableModel> = obj.parent;
                    while (parent!==undefined) {
                        const propagationEvent =
                            this._helper.captureObject(e,mouseEvent,mousePoint,parent, obj, constrainObjects);
                        if (propagationEvent!==undefined) {
                            if (!propagationEvent.transclude) {
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
            const sceneMouseEvent = SceneMouseEvent.pool.get();
            sceneMouseEvent.screenX = mousePoint.screenCoordinate.x;
            sceneMouseEvent.screenY = mousePoint.screenCoordinate.y;
            sceneMouseEvent.sceneX = mousePoint.sceneCoordinate.x;
            sceneMouseEvent.sceneY = mousePoint.sceneCoordinate.y;
            sceneMouseEvent.id = mousePoint.id;
            sceneMouseEvent.eventName = mouseEvent;
            sceneMouseEvent.nativeEvent = e as MouseEvent;
            sceneMouseEvent.button = mouseButton;
            sceneMouseEvent.isMouseDown = mouseButton!==undefined;
            scene.mouseEventHandler.trigger(mouseEvent,sceneMouseEvent);
            SceneMouseEvent.pool.recycle(sceneMouseEvent);
        }


        return mousePoint;
    }

    private resolveClick(e:Touch|MouseEvent):void {
        MousePoint.pool.recycle(this.triggerEvent(e,MOUSE_EVENTS.click,LEFT_MOUSE_BTN));
        MousePoint.pool.recycle(this.triggerEvent(e,MOUSE_EVENTS.mouseDown,LEFT_MOUSE_BTN));
    }

    private resolveRightClick(e:Touch|MouseEvent):void {
        MousePoint.pool.recycle(this.triggerEvent(e,MOUSE_EVENTS.rightClick,RIGHT_MOUSE_BTN));
        MousePoint.pool.recycle(this.triggerEvent(e,MOUSE_EVENTS.mouseDown,RIGHT_MOUSE_BTN));
    }

    private resolveMouseDown(e:Touch|MouseEvent,mouseButton:number):void {
        MousePoint.pool.recycle(this.triggerEvent(e,MOUSE_EVENTS.mouseDown,mouseButton));
    }

    private resolveMouseMove(e:Touch|MouseEvent|PointerEvent,mouseButton?:number):void {
        const point = this.triggerEvent(e,MOUSE_EVENTS.mouseMove,mouseButton);
        const capturedNew = this._capturedObjectsByTouchIdHolder.getByTouchId(point.id);
        const capturedOld = this._capturedObjectsByTouchIdPrevHolder.getByTouchId(point.id);
        // mouse enter
        for (let i = 0; i < capturedNew.length; i++) {
            const obj = capturedNew[i];
            if (capturedOld.indexOf(obj)===-1) {
                const event = this._helper.triggerEventForObject(e, MOUSE_EVENTS.mouseEnter, point, obj, obj);
                ObjectMouseEvent.pool.recycle(event);
            }
        }
        // mouse leave
        for (let i = 0; i < capturedOld.length; i++) {
            const obj = capturedOld[i];
            if (capturedNew.indexOf(obj)===-1) {
                const event = this._helper.triggerEventForObject(e, MOUSE_EVENTS.mouseLeave, point, obj, obj);
                ObjectMouseEvent.pool.recycle(event);
            }
        }
        // swap captured objects
        this._capturedObjectsByTouchIdPrevHolder.clear(point.id);
        for (let i = 0; i < capturedNew.length; i++) {
            this._capturedObjectsByTouchIdPrevHolder.add(point.id,capturedNew[i]);
        }
        MousePoint.pool.recycle(point);
    }

    private resolveMouseUp(e:MouseEvent|Touch,mouseButton:number):void {
        const point = this.triggerEvent(e,MOUSE_EVENTS.mouseUp,mouseButton);
        const capturedNew = this._capturedObjectsByTouchIdHolder.getByTouchId(point.id);
        const capturedOld = this._capturedObjectsByTouchIdPrevHolder.getByTouchId(point.id);
        for (let i = 0; i < capturedOld.length; i++) {
            const obj = capturedOld[i];
            if (capturedNew.indexOf(obj)===-1) {
                const event = this._helper.triggerEventForObject(e, MOUSE_EVENTS.mouseUp, point, obj, obj);
                ObjectMouseEvent.pool.recycle(event);
            }
        }
        this._capturedObjectsByTouchIdPrevHolder.clear(point.id);
        this._capturedObjectsByTouchIdHolder.clear(point.id);
        MousePoint.pool.recycle(point);
    }

    private resolveDoubleClick(e:MouseEvent):void {
        MousePoint.pool.recycle(this.triggerEvent(e,MOUSE_EVENTS.doubleClick));
    }

    private resolveScroll(e:MouseEvent):void {
        MousePoint.pool.recycle(this.triggerEvent(e,MOUSE_EVENTS.scroll));
    }

}

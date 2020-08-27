import {MathEx} from "../../misc/mathEx";
import {Point2d} from "../../geometry/point2d";
import {Game} from "../../core/game";
import {Scene} from "@engine/scene/scene";
import {Rect} from "../../geometry/rect";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {IControl} from "@engine/control/abstract/iControl";
import {DebugError} from "@engine/debug/debugError";
import {IObjectMouseEvent, ISceneMouseEvent, MousePoint} from "@engine/control/mouse/mousePoint";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {Layer} from "@engine/scene/layer";
import {mat4} from "@engine/geometry/mat4";
import {vec4} from "@engine/geometry/vec4";
import Vec4Holder = vec4.Vec4Holder;

const pointTopLeft:Vec4Holder = new Vec4Holder();
pointTopLeft.set(0,0,0,1);

const LEFT_MOUSE_BTN  = 0 as const;

export class MouseControl implements IControl {

    private static triggerGameObjectEvent(
        e:MouseEvent|TouchEvent|Touch,
        eventName:MOUSE_EVENTS,mousePoint:MousePoint,
        go:RenderableModel):boolean{

        const goRect:Rect = Rect.fromPool();


        const pointBottomRight:Vec4Holder = Vec4Holder.fromPool();
        pointBottomRight.set(go.size.width,go.size.height,0,1);
        const pointTopLeftTransformation:Vec4Holder =  Vec4Holder.fromPool();
        const pointBottomRightTransformation:Vec4Holder = Vec4Holder.fromPool();

        mat4.multVecByMatrix(pointTopLeftTransformation,go.worldTransformMatrix,pointTopLeft);
        mat4.multVecByMatrix(pointBottomRightTransformation,go.worldTransformMatrix,pointBottomRight);

        goRect.setXYWH(
            pointTopLeftTransformation.x,
            pointTopLeftTransformation.y,
            pointBottomRightTransformation.x-pointTopLeftTransformation.x,
            pointBottomRightTransformation.y-pointTopLeftTransformation.y
        );

        if (goRect.width<0) {
            goRect.width=-goRect.width;
            goRect.x-=goRect.width;
        }
        if (goRect.height<0) {
            goRect.height=-goRect.height;
            goRect.y-=goRect.height;
        }

        pointBottomRight.release();
        pointTopLeftTransformation.release();
        pointBottomRightTransformation.release();

        // let debugRect:Rectangle = Game.getInstance().getCurrScene().getDefaultLayer().findChildById<Rectangle>('debugRect')!;
        // if (!debugRect) {
        //     const layer:Layer = new Layer(Game.getInstance());
        //     layer.id = 'debugLayer';
        //     layer.transformType = LayerTransformType.STICK_TO_CAMERA;
        //     Game.getInstance().getCurrScene().addLayer(layer);
        //     debugRect = new Rectangle(Game.getInstance());
        //     debugRect.setWH(10);
        //     debugRect.fillColor = Color.RGBA(0,122,12,22);
        //     debugRect.passMouseEventsThrough = true;
        //     debugRect.id = 'debugRect';
        //     layer.appendChild(debugRect);
        // }
        // debugRect.pos.setXY(goRect.x,goRect.y);
        // debugRect.size.setWH(goRect.width || 1, goRect.height || 1);
        //
        // let debugPoint:Circle = Game.getInstance().getCurrScene().getDefaultLayer().findChildById<Circle>('debugPoint')!;
        // if (!debugPoint) {
        //     debugPoint = new Circle( Game.getInstance());
        //     debugPoint.radius = 5;
        //     debugPoint.id = 'debugPoint';
        //     debugPoint.passMouseEventsThrough = true;
        //     Game.getInstance().getCurrScene().getLayerById('debugLayer')!.appendChild(debugPoint);
        // }
        // debugPoint.center.setXY(mousePoint.screenCoordinate.x,mousePoint.screenCoordinate.y);

        const screenPoint:Point2d = Point2d.fromPool();
        screenPoint.setXY(mousePoint.screenCoordinate.x,mousePoint.screenCoordinate.y);
        let res:boolean = false;
        if (
            MathEx.isPointInRect(screenPoint,goRect)
        ) {
            if (!go.passMouseEventsThrough) {
                mousePoint.target = go;
                const mouseEvent:IObjectMouseEvent = { // todo pool?
                    screenX:mousePoint.screenCoordinate.x,
                    screenY:mousePoint.screenCoordinate.y,
                    sceneX:mousePoint.sceneCoordinate.x,
                    sceneY:mousePoint.sceneCoordinate.y,
                    objectX:mousePoint.sceneCoordinate.x - go.pos.x,
                    objectY:mousePoint.sceneCoordinate.y - go.pos.y,
                    id:mousePoint.id,
                    target:go,
                    nativeEvent: e as Event,
                    eventName,
                    isMouseDown: mousePoint.isMouseDown,
                    button: (e as MouseEvent).button,
                };
                go.trigger(eventName,mouseEvent);
            }
            res = !go.passMouseEventsThrough;
        }
        goRect.release();
        screenPoint.release();
        for (const ch of go.children) {
            const childRes:boolean =  MouseControl.triggerGameObjectEvent(e,eventName,mousePoint,ch);
            res = res || childRes;
        }
        return res;
    }

    public readonly type:string = 'MouseControl';
    private _objectsCaptured:{[pointId:number]:RenderableModel|Scene} = {};
    private _objectsHovered:{[pointId:number]:RenderableModel|Scene} = {};
    private _objectsFirstHovered:{[pointId:number]:RenderableModel|Scene} = {};
    private _container:HTMLElement;

    constructor(private _game:Game){
    }

    public listenTo():void {
        if (DEBUG && !this._game.getRenderer()) {
            throw new DebugError(`can not initialize mouse control: renderer is not set`);
        }
        const container:HTMLElement = this._game.getRenderer().container;

        this._container = container;
        // mouseDown
        container.ontouchstart = (e:TouchEvent)=>{
            // to prevent "mouse" events on touch devices - https://www.html5rocks.com/en/mobile/touchandmouse/
            e.preventDefault();
            let l = e.touches.length;
            while (l--){
                this.resolveClick((e.touches[l] as Touch));
            }
        };
        container.onmousedown = (e:MouseEvent)=>{
            if (e.button === LEFT_MOUSE_BTN) this.resolveClick(e);
            else {
                this.resolveButtonPressed(e);
            }
        };
        // mouseUp
        container.ontouchend = container.ontouchcancel = (e:TouchEvent)=>{
            e.preventDefault();
            let l:number = e.changedTouches.length;
            while (l--){
                this.resolveMouseUp(e.changedTouches[l]);
            }
        };
        document.body.ontouchend = document.body.ontouchcancel = (e:TouchEvent)=>{
            let l:number = e.changedTouches.length;
            while (l--){
                const point:MousePoint = this.resolvePoint(e.changedTouches[l]);
                if (this._objectsCaptured[point.id]!==undefined) {
                    this.resolveMouseUp(e.changedTouches[l]);
                }
                point.release();
            }
        };
        container.onmouseup = (e:MouseEvent)=>{
            e.stopPropagation(); // to prevent  document.body.onmouseup triggering
            this.resolveMouseUp(e);
        };
        document.body.onmouseup = (e: MouseEvent)=>{
            const point:MousePoint = this.resolvePoint(e);
            if (this._objectsCaptured[point.id]!==undefined) {
                this.resolveMouseUp(e);
            }
            point.release();
        };
        // mouseMove
        container.ontouchmove = (e:TouchEvent)=>{
            e.preventDefault(); // to prevent canvas move
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
        (container as unknown as {onmousewheel:(e:MouseEvent)=>void}).onmousewheel = (e:MouseEvent)=>{
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
            'onmousemove','ondblclick'].forEach((evtName:string)=>{
                // tslint:disable-next-line:no-null-keyword
            (this._container as unknown as Record<string,null>)[evtName] = null;
                // tslint:disable-next-line:no-null-keyword
            document.body.ontouchend = document.body.ontouchcancel = document.body.onmouseup = null;
        });
    }

    private resolveSceneCoordinates(mousePoint:MousePoint,layer:Layer):void{
        const worldPoint:Point2d = this._game.camera.screenToWorld(mousePoint.screenCoordinate,layer.transformType);
        mousePoint.sceneCoordinate.set(worldPoint);
        worldPoint.release();
    }

    private resolvePoint(e:MouseEvent|Touch|PointerEvent):MousePoint{
        const game:Game = this._game;
        const clientX:number = e.clientX;
        const clientY:number = e.clientY;

        const screenX:number = (clientX - game.pos.x ) / game.scale.x;
        const screenY:number = (clientY - game.pos.y ) / game.scale.y;

        const screenPoint:Point2d = Point2d.fromPool();
        screenPoint.setXY(screenX,screenY);

        const mousePoint:MousePoint = MousePoint.fromPool();
        mousePoint.target = undefined!;
        mousePoint.screenCoordinate.set(screenPoint);
        mousePoint.id = (e as Touch).identifier  || (e as PointerEvent).pointerId || 0;

        screenPoint.release();

        return mousePoint;
    }


    private triggerEvent(e:MouseEvent|Touch, mouseEvent:MOUSE_EVENTS, isMouseDown:boolean = false):MousePoint{
        const scene:Scene = this._game.getCurrScene();
        const mousePoint:MousePoint = this.resolvePoint(e);
        mousePoint.isMouseDown = isMouseDown;

        let isCaptured:boolean = false;
        let i:number = scene.getLayers().length; // reversed loop
        while(i--) {
            const layer:Layer = scene.getLayers()[i];
            this.resolveSceneCoordinates(mousePoint,layer);
            let j:number = layer.children.length;
            while(j--) {
               const go:RenderableModel = layer.children[j];
               isCaptured = MouseControl.triggerGameObjectEvent(e, mouseEvent, mousePoint, go);
               if (isCaptured) {
                    mousePoint.target = go;
                    break;
               }
            }
            if (isCaptured) break;
        }

        if (mousePoint.target===undefined) mousePoint.target = scene;
        scene.trigger(mouseEvent,{
            screenX:mousePoint.screenCoordinate.x,
            screenY:mousePoint.screenCoordinate.y,
            sceneX: mousePoint.sceneCoordinate.x,
            sceneY: mousePoint.sceneCoordinate.y,
            id:mousePoint.id,
            eventName: mouseEvent,
            nativeEvent: e as Event,
            button: (e as MouseEvent).button,
            isMouseDown
        } as ISceneMouseEvent);

        return mousePoint;
    }

    private resolveClick(e:Touch|MouseEvent):void {
        const point:MousePoint = this.triggerEvent(e,MOUSE_EVENTS.click);
        this.triggerEvent(e,MOUSE_EVENTS.mouseDown).release();
        this._objectsCaptured[point.id] = point.target;
        point.release();
    }

    private resolveButtonPressed(e:Touch|MouseEvent):void {
        const point:MousePoint = this.triggerEvent(e,MOUSE_EVENTS.click);
        this.triggerEvent(e,MOUSE_EVENTS.mousePressed).release();
        this._objectsCaptured[point.id] = point.target;
        point.release();
    }

    private resolveMouseMove(e:Touch|MouseEvent,isMouseDown:boolean):void {
        const point:MousePoint = this.triggerEvent(e,MOUSE_EVENTS.mouseMove,isMouseDown);
        const lastHoveredObject:RenderableModel|Scene = this._objectsHovered[point.id];
        if (lastHoveredObject!==undefined) {
            if (lastHoveredObject!==point.target) {
                lastHoveredObject.trigger(MOUSE_EVENTS.mouseLeave,point);
                //this.triggerEvent(e,MOUSE_EVENTS.mouseLeave).release();
                delete this._objectsFirstHovered[point.id];
            } else {
                if (this._objectsFirstHovered[point.id]===undefined) {
                    lastHoveredObject.trigger(MOUSE_EVENTS.mouseEnter,point);
                    this._objectsFirstHovered[point.id] = point.target;
                    //this.triggerEvent(e,MOUSE_EVENTS.mouseEnter).release();
                }
            }
        }
        this._objectsHovered[point.id] = point.target;
        point.release();
    }

    private resolveMouseUp(e:MouseEvent|Touch):void {
        const point:MousePoint = this.triggerEvent(e,MOUSE_EVENTS.mouseUp);
        const lastCapturedObject = this._objectsCaptured[point.id];
        if (lastCapturedObject!==undefined && point.target!==lastCapturedObject) {
            lastCapturedObject.trigger(MOUSE_EVENTS.mouseUp,point);
        }
        delete this._objectsCaptured[point.id];
        delete this._objectsHovered[point.id];
        point.release();
    }

    private resolveDoubleClick(e:MouseEvent):void {
        this.triggerEvent(e,MOUSE_EVENTS.doubleClick).release();
    }

    private resolveScroll(e:MouseEvent):void {
        this.triggerEvent(e,MOUSE_EVENTS.scroll).release();
    }

}

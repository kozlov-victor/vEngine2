import {Layer} from "./layer";
import {AbstractFilter} from "@engine/renderer/webGl/filters/abstract/abstractFilter";
import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/color";
import {CAMERA_MATRIX_MODE} from "@engine/renderer/camera";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {IEventemittable, IFilterable, IRevalidatable, ITweenable, Optional} from "@engine/core/declarations";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {removeFromArray} from "@engine/misc/object";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {ITweenDescription, Tween} from "@engine/animation/tween";
import {Timer} from "@engine/misc/timer";
import {TweenableDelegate} from "@engine/delegates/tweenableDelegate";
import {TimerDelegate} from "@engine/delegates/timerDelegate";
import {EventEmitterDelegate} from "@engine/delegates/eventEmitterDelegate";
import {KEYBOARD_EVENTS, KeyBoardEvent} from "@engine/control/keyboard/keyboardEvents";
import {IMousePoint} from "@engine/control/mouse/mousePoint";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {GAME_PAD_EVENTS, GamePadEvent} from "@engine/control/gamepad/gamePadEvents";
import {Point2d} from "@engine/geometry/point2d";
import {Rect} from "@engine/geometry/rect";


export class Scene implements IRevalidatable, ITweenable, IEventemittable,IFilterable {

    public readonly type:string = "Scene";
    public width!:number;
    public height!:number;
    public colorBG = Color.WHITE.clone();
    public readonly resourceLoader: ResourceLoader;
    public readonly pos:Point2d = new Point2d();
    public filters:AbstractFilter[] = [];

    protected preloadingGameObject!:RenderableModel;
    private _layers:Layer[] = [];
    private readonly _uiLayer:Layer;

    // addTween
    private _tweenDelegate: TweenableDelegate = new TweenableDelegate();

    // timer
    private _timerDelegate:TimerDelegate = new TimerDelegate();

    // eventEmitter
    private _eventEmitterDelegate:EventEmitterDelegate = new EventEmitterDelegate();

    constructor(protected game:Game) {
        this._uiLayer = new Layer(this.game);
        this.resourceLoader = new ResourceLoader(game);
    }

    public revalidate():void {
        if (!this.width) { this.width = this.game.width; }
        if (!this.height) { this.height = this.game.height; }
    }


    public getLayers(): Layer[] {
        return this._layers;
    }

    public getUiLayer(): Layer {
        return this._uiLayer;
    }

    public getDefaultLayer():Layer {
        if (!this._layers.length) this.addLayer(new Layer(this.game));
        return this._layers[0];
    }

    public addLayer(layer:Layer):void {
        layer.setScene(this);
        this._layers.push(layer);
    }

    public removeLayer(layer:Layer):void {
        removeFromArray(this._layers,(it)=>it===layer);
    }

    public appendChild(go:RenderableModel):void {
        go.revalidate();
        this.getDefaultLayer().appendChild(go);
    }

    public prependChild(go:RenderableModel):void {
        this.getDefaultLayer().prependChild(go);
    }


    public update():void {
        if (!this.resourceLoader.isCompleted()) {
            if (this.preloadingGameObject!==undefined) {
                this.preloadingGameObject.update();
            }
        } else {
            this.updateFrame();
        }
    }


    public addTween<T>(t: Tween<T>): void {
        this._tweenDelegate.addTween(t);
    }
    public addTweenMovie(tm: TweenMovie):void {
        this._tweenDelegate.addTweenMovie(tm);
    }
    public tween<T>(desc: ITweenDescription<T>): Tween<T> {
        return this._tweenDelegate.tween(desc);
    }

    public setTimeout(callback:()=>void,interval:number):Timer {
        return this._timerDelegate.setTimeout(callback,interval);
    }

    public setInterval(callback:()=>void,interval:number):Timer {
        return this._timerDelegate.setInterval(callback,interval);
    }

    public off(eventName: string, callBack: ()=>void): void {
        this._eventEmitterDelegate.off(eventName,callBack);
    }
    public on(eventName:MOUSE_EVENTS,callBack:(e:IMousePoint)=>void):()=>void;
    public on(eventName:KEYBOARD_EVENTS,callBack:(e:KeyBoardEvent)=>void):()=>void;
    public on(eventName:GAME_PAD_EVENTS,callBack:(e:GamePadEvent)=>void):()=>void;
    public on(eventName: string, callBack: (arg?:any)=>void): ()=>void {
        return this._eventEmitterDelegate.on(eventName,callBack);
    }
    public trigger(eventName: string, data?: any): void {
        this._eventEmitterDelegate.trigger(eventName,data);
    }

    public findChildById(id:string):Optional<RenderableModel>{
        for (const l of this._layers) {
            const possibleObject:Optional<RenderableModel>= l.findChildById(id);
            if (possibleObject) return possibleObject;
        }
        return undefined;
    }

    public destroy():void {
        this.onDestroy();
    }


    public onPreloading():void {}

    public onProgress(val:number):void {}

    public onReady():void {}


    public render():void {

        this.game.camera.matrixMode = CAMERA_MATRIX_MODE.MODE_TRANSFORM;

        const renderer:AbstractRenderer = this.game.getRenderer();
        renderer.save();
        this.lockSceneView();
        renderer.beforeFrameDraw(this.colorBG);
        this.game.camera.render();
        renderer.translate(this.pos.x,this.pos.y);

        if (!this.resourceLoader.isCompleted()) {
            if (this.preloadingGameObject!==undefined) {
                this.preloadingGameObject.render();
            }
        } else {
            for (const l of this._layers) {
                l.render();
            }
        }

        this.game.camera.matrixMode = CAMERA_MATRIX_MODE.MODE_IDENTITY; // todo manage this
        renderer.restore();
        this.unlockSceneView();


        if (DEBUG) {
            this.game.getRenderer().restore();
            if (
                this.game.getRenderer().debugTextField &&
                this.game.getRenderer().debugTextField.getFont().getResourceLink() &&
                this.game.getRenderer().debugTextField.getFont().getResourceLink().getTarget()
            ) {
                this.game.getRenderer().debugTextField.update();
                this.game.getRenderer().debugTextField.render();
            }
            this.game.getRenderer().restore();
        }
        renderer.afterFrameDraw(this.filters);

    }

    protected onUpdate():void {}

    protected onDestroy():void {}


    private updateFrame():void {

        this.game.camera.update();

        this._tweenDelegate.update();
        this._timerDelegate.update();

        for (const l of this._layers) {
            l.update();
        }
        this._uiLayer.update();

        this.onUpdate();
    }


    private lockSceneView():void {
        if (this.pos.equal(0)) return;
        const renderer:AbstractRenderer = this.game.getRenderer();
        const r:Rect = Rect.fromPool();
        r.setXYWH(
            Math.max(0,this.pos.x),
            Math.max(0,this.pos.y),
            Math.min(this.game.width,this.game.width+this.pos.x),
            Math.min(this.game.height,this.game.height+this.pos.y)
        );
        r.clamp(0,0,this.game.width,this.game.height);
        renderer.lockRect(r);
        r.release();
    }

    private unlockSceneView(){
        if (this.pos.equal(0)) return;
        this.game.getRenderer().unlockRect();
    }
}

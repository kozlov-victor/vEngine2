import {Layer} from "./layer";
import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/common/color";
import {CAMERA_MATRIX_MODE} from "@engine/renderer/camera";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {
    IAlphaBlendable,
    IEventemittable,
    IFilterable,
    IRevalidatable,
    ITweenable,
    Optional
} from "@engine/core/declarations";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {removeFromArray} from "@engine/misc/object";
import {AbstractRenderer, IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
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
import {TransformableModel} from "@engine/renderable/abstract/transformableModel";
import {Rect} from "@engine/geometry/rect";
import {IStateStackPointer} from "@engine/renderer/webGl/base/frameBufferStack";
import {IFilter} from "@engine/renderer/common/ifilter";


export class Scene extends TransformableModel implements IRevalidatable, ITweenable, IEventemittable,IFilterable,IAlphaBlendable {

    public readonly type:string = "Scene";
    public colorBG = Color.WHITE.clone();
    public lockingRect:Optional<Rect>;
    public readonly resourceLoader: ResourceLoader;
    public readonly pos:Point2d = new Point2d();
    public filters:IFilter[] = [];
    public alpha:number = 1;

    protected preloadingGameObject!:RenderableModel;
    private _layers:Layer[] = [];

    // addTween
    private _tweenDelegate: TweenableDelegate = new TweenableDelegate();

    // timer
    private _timerDelegate:TimerDelegate = new TimerDelegate();

    // eventEmitter
    private _eventEmitterDelegate:EventEmitterDelegate = new EventEmitterDelegate();

    constructor(protected game:Game) {
        super(game);
        this.resourceLoader = new ResourceLoader(game);
        this.size.set(this.game.size);
    }

    public revalidate():void {
        if (this.size.isZero()) this.size.set(this.game.size);
    }


    public getLayers(): Layer[] {
        return this._layers;
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

    public removeChild(c:RenderableModel):void{
        for (let i = 0; i < this._layers.length; i++) {
            if (this._layers[i].removeChild(c)) break;
        }
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

    public renderToTexture(target:IRenderTarget):void {
        this.game.getRenderer().getHelper().renderSceneToTexture(this,target);
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
        if (this.lockingRect!==undefined) renderer.lockRect(this.lockingRect);
        renderer.transformSave();
        renderer.saveAlphaBlend();
        renderer.clearColor.set(this.colorBG);
        const statePointer:IStateStackPointer = renderer.beforeFrameDraw(this.filters); // todo blend mode for scene
        this.game.camera.render();
        this.translate();
        this.transform();
        renderer.setAlphaBlend(this.alpha);

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
        renderer.transformRestore();
        renderer.restoreAlphaBlend();
        renderer.unlockRect();

        if (DEBUG) {
            this.game.getRenderer().transformRestore();
            if (
                this.game.getRenderer().debugTextField &&
                this.game.getRenderer().debugTextField.getFont().getResourceLink() &&
                this.game.getRenderer().debugTextField.getFont().getResourceLink().getTarget()
            ) {
                this.game.getRenderer().debugTextField.update();
                this.game.getRenderer().debugTextField.render();
            }
            this.game.getRenderer().transformRestore();
        }
        renderer.afterFrameDraw(statePointer);

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

        this.onUpdate();
    }
}

import {TileMap} from "./tileMap";
import {Layer} from "./layer";
import {AbstractFilter} from "../../renderer/webGl/filters/abstract/abstractFilter";
import {Game} from "../../game";
import {Color} from "../../renderer/color";
import {CAMERA_MATRIX_MODE} from "../../renderer/camera";
import {ResourceLoader} from "../../resources/resourceLoader";
import {Eventemittable, Revalidatable, Tweenable} from "../../declarations";
import {RenderableModel} from "@engine/model/renderableModel";
import {TweenMovie} from "@engine/misc/tweenMovie";
import {removeFromArray} from "@engine/misc/object";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {Tween, TweenDescription} from "@engine/misc/tween";
import {Timer} from "@engine/misc/timer";
import {TweenableDelegate} from "@engine/delegates/tweenableDelegate";
import {TimerDelegate} from "@engine/delegates/timerDelegate";
import {EventEmitterDelegate} from "@engine/delegates/eventEmitterDelegate";


export class Scene implements Revalidatable, Tweenable, Eventemittable {

    readonly type:string = 'Scene';
    width:number;
    height:number;
    colorBG = Color.WHITE.clone();
    tileMap:TileMap;
    preloadingGameObject:RenderableModel;
    filters:AbstractFilter[] = [];

    public readonly resourceLoader: ResourceLoader;

    private _layers:Layer[] = [];
    private _uiLayer:Layer;

    constructor(protected game:Game) {
        this.tileMap = new TileMap(game);
        this._uiLayer = new Layer(this.game);
        this.addLayer(new Layer(game));
        this.resourceLoader = new ResourceLoader(game);
    }

    revalidate():void {
        if (!this.width) this.width = this.game.width;
        if (!this.height) this.height = this.game.height;
    }


    getLayers(): Layer[] {
        return this._layers;
    }

    getUiLayer(): Layer {
        return this._uiLayer;
    }

    getDefaultLayer():Layer{
        return this._layers[0];
    }

    addLayer(layer:Layer):void {
        this._layers.push(layer);
    }

    removeLayer(layer:Layer):void {
        removeFromArray(this._layers,it=>it===layer);
    }

    appendChild(go:RenderableModel):void {
        go.revalidate();
        this.getDefaultLayer().appendChild(go);
    }

    prependChild(go:RenderableModel):void {
        this.getDefaultLayer().prependChild(go);
    }


    onPreloading():void {}

    onProgress(val:number):void {}

    onReady():void {}

    beforeUpdate():void {}

    onUpdate():void {}

    beforeRender():void {}

    onRender():void {}

    onDestroy():void {}


    private updateMainFrame():void {
        this.beforeUpdate();

        this._tweenDelegate.update();
        this._timerDelegate.update();

        for (let l of this._layers) {
            l.update();
        }
        this._uiLayer.update();

        this.onUpdate();
    }


    update():void {
        if (!this.resourceLoader.isCompleted()) {
            if (this.preloadingGameObject!==undefined) {
                this.preloadingGameObject.update();
            }
        } else {
            this.updateMainFrame();
        }
    }

    private renderMainFrame():void {
        const renderer:AbstractRenderer = this.game.getRenderer();
        this.game.camera.update();

        for (let l of this._layers) {
            l.render();
        }

        this.tileMap.render();

        renderer.save();
        renderer.resetTransform();
        this.game.camera.matrixMode = CAMERA_MATRIX_MODE.MODE_IDENTITY;
        this._uiLayer.render();
        renderer.restore();

        this.game.camera.matrixMode = CAMERA_MATRIX_MODE.MODE_TRANSFORM;
        this.onRender();

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
    }

    private renderPreloadingFrame():void {
        this.game.getRenderer().resetTransform();
        this.preloadingGameObject.render();
    }

    render():void {

        this.beforeRender();

        const renderer:AbstractRenderer = this.game.getRenderer();
        renderer.beforeFrameDraw(this.colorBG);

        this.game.camera.matrixMode = CAMERA_MATRIX_MODE.MODE_TRANSFORM;

        if (!this.resourceLoader.isCompleted()) {
            if (this.preloadingGameObject!==undefined) {
                this.renderPreloadingFrame();
            }
        } else {
             this.renderMainFrame();
        }

        renderer.afterFrameDraw(this.filters);
    }

    // tween
    private _tweenDelegate: TweenableDelegate = new TweenableDelegate();

    addTween(t: Tween): void {
        this._tweenDelegate.addTween(t);
    }
    addTweenMovie(tm: TweenMovie):void {
        this._tweenDelegate.addTweenMovie(tm);
    }
    tween(desc: TweenDescription): Tween {
        return this._tweenDelegate.tween(desc);
    }

    // timer
    private _timerDelegate:TimerDelegate = new TimerDelegate();

    setTimeout(callback:Function,interval:number):Timer{
        return this._timerDelegate.setTimeout(callback,interval);
    }

    setInterval(callback:Function,interval:number):Timer{
        return this._timerDelegate.setInterval(callback,interval);
    }

    //eventEmitter
    private _eventEmitterDelegate:EventEmitterDelegate = new EventEmitterDelegate();

    off(eventName: string, callBack: Function): void {
        this._eventEmitterDelegate.off(eventName,callBack);
    }
    on(eventName: string, callBack: Function): Function {
        return this._eventEmitterDelegate.on(eventName,callBack);
    }
    trigger(eventName: string, data?: any): void {
        this._eventEmitterDelegate.trigger(eventName,data);
    }


    destroy():void {
        this.onDestroy();
    }
}

import {TileMap} from "./tileMap";
import {Layer} from "./layer";
import {AbstractFilter} from "../../renderer/webGl/filters/abstract/abstractFilter";
import {Game} from "../../game";
import {AmbientLight} from "../../light/impl/ambientLight";
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
    readonly colorBG = Color.WHITE.clone();
    tileMap:TileMap;
    ambientLight:AmbientLight;
    preloadingGameObject:RenderableModel;
    filters:AbstractFilter[] = [];

    public readonly resourceLoader: ResourceLoader;

    private _layers:Layer[] = [];
    private _uiLayer:Layer;

    constructor(protected game:Game) {
        this.tileMap = new TileMap(game);
        this.ambientLight = new AmbientLight(game);
        this._uiLayer = new Layer(this.game);
        this.addLayer(new Layer(game));
        this.resourceLoader = new ResourceLoader(game);
    }

    revalidate():void {
        if (this.width == 0) this.width = this.game.width;
        if (this.height == 0) this.height = this.game.height;
    }


    getLayers(): Layer[] {
        return this._layers;
    }

    getUiLayer(): Layer {
        return this._uiLayer;
    }

    getAllGameObjects():RenderableModel[] {
        const res:RenderableModel[] = []; // todo optimize
        const ONE:number = 1;
        for (let i:number=0;i<this._layers.length;i++) {
            const layer:Layer = this._layers[this._layers.length - ONE - i];
            for (let j:number = 0; j < layer.children.length; j++) {
                const go:RenderableModel = layer.children[layer.children.length - ONE - j];
                res.push(go);
            }
        }
        return res;
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

        let layers:Layer[] = this._layers;
        for (let l of layers) {
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

        let layers:Layer[] = this._layers;
        for (let l of layers) {
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
        renderer.beginFrameBuffer();
        renderer.clearColor(this.colorBG);

        this.game.camera.matrixMode = CAMERA_MATRIX_MODE.MODE_TRANSFORM;

        if (!this.resourceLoader.isCompleted()) {
            if (this.preloadingGameObject!==undefined) {
                this.renderPreloadingFrame();
            }
        } else {
             this.renderMainFrame();
        }

        renderer.flipFrameBuffer(this.filters);
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

    setTimer(callback:Function,interval:number):Timer{
        return this._timerDelegate.setTimer(callback,interval);
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

import {TileMap} from "./tileMap";
import {Layer} from "./layer";
import {AbstractFilter} from "../../renderer/webGl/filters/abstract/abstractFilter";
import {Game} from "../../game";
import {Color} from "../../renderer/color";
import {CAMERA_MATRIX_MODE} from "../../renderer/camera";
import {ResourceLoader} from "../../resources/resourceLoader";
import {IEventemittable, IFilterable, IRevalidatable, ITweenable} from "../../declarations";
import {RenderableModel} from "@engine/model/renderableModel";
import {TweenMovie} from "@engine/misc/tweenMovie";
import {removeFromArray} from "@engine/misc/object";
import {AbstractRenderer} from "@engine/renderer/abstract/abstractRenderer";
import {Tween, ITweenDescription} from "@engine/misc/tween";
import {Timer} from "@engine/misc/timer";
import {TweenableDelegate} from "@engine/delegates/tweenableDelegate";
import {TimerDelegate} from "@engine/delegates/timerDelegate";
import {EventEmitterDelegate} from "@engine/delegates/eventEmitterDelegate";


export class Scene implements IRevalidatable, ITweenable, IEventemittable,IFilterable {

    public readonly type:string = "Scene";
    public width!:number;
    public height!:number;
    public colorBG = Color.WHITE.clone();
    public readonly resourceLoader: ResourceLoader;
    public filters:AbstractFilter[] = [];

    public tileMap:TileMap; // todo

    protected preloadingGameObject!:RenderableModel;
    private _layers:Layer[] = [];
    private readonly _uiLayer:Layer;

    // tween
    private _tweenDelegate: TweenableDelegate = new TweenableDelegate();

    // timer
    private _timerDelegate:TimerDelegate = new TimerDelegate();

    // eventEmitter
    private _eventEmitterDelegate:EventEmitterDelegate = new EventEmitterDelegate();

    constructor(protected game:Game) {
        this.tileMap = new TileMap(game);
        this._uiLayer = new Layer(this.game);
        this.addLayer(new Layer(game));
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
        return this._layers[0];
    }

    public addLayer(layer:Layer):void {
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
            this.updateMainFrame();
        }
    }

    public render():void {

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

    public addTween(t: Tween): void {
        this._tweenDelegate.addTween(t);
    }
    public addTweenMovie(tm: TweenMovie):void {
        this._tweenDelegate.addTweenMovie(tm);
    }
    public tween(desc: ITweenDescription): Tween {
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
    public on(eventName: string, callBack: (arg?:any)=>void): ()=>void {
        return this._eventEmitterDelegate.on(eventName,callBack);
    }
    public trigger(eventName: string, data?: any): void {
        this._eventEmitterDelegate.trigger(eventName,data);
    }


    public destroy():void {
        this.onDestroy();
    }


    public onPreloading():void {}

    public onProgress(val:number):void {}

    public onReady():void {}

    protected beforeUpdate():void {}

    protected onUpdate():void {}

    protected beforeRender():void {}

    protected onRender():void {}

    protected onDestroy():void {}


    private updateMainFrame():void {
        this.beforeUpdate();

        this._tweenDelegate.update();
        this._timerDelegate.update();

        for (const l of this._layers) {
            l.update();
        }
        this._uiLayer.update();

        this.onUpdate();
    }

    private renderMainFrame():void {
        const renderer:AbstractRenderer = this.game.getRenderer();
        this.game.camera.update();

        for (const l of this._layers) {
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
}

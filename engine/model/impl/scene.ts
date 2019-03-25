import {TileMap} from "./tileMap";
import {Layer} from "./layer";
import {AbstractFilter} from "../../core/renderer/webGl/filters/abstract/abstractFilter";
import {Game} from "../../core/game";
import {AmbientLight} from "../../core/light/ambientLight";
import {Color} from "../../core/renderer/color";
import {CAMERA_MATRIX_MODE} from "../../core/renderer/camera";
import {ResourceLoader} from "../../core/resources/resourceLoader";
import {IMPORT_DEPENDS, Eventemittable, Revalidatable, Tweenable} from "../../declarations";
import {RenderableModel} from "@engine/model/renderableModel";
import {TweenMovie} from "@engine/core/tweenMovie";
import {EventEmitter} from "@engine/core/misc/eventEmitter";
import {removeFromArray} from "@engine/core/misc/object";
import {AbstractRenderer} from "@engine/core/renderer/abstract/abstractRenderer";
import {Tween, TweenDescription} from "@engine/core/tween";
import {Timer} from "@engine/core/timer";
import {MOUSE_EVENTS} from "@engine/core/control/mouse/mouseEvents";
import {DebugError} from "@engine/debugError";


export class Scene implements Revalidatable, Tweenable, Eventemittable {

    readonly type:string = 'Scene';
    width:number;
    height:number;
    useBG:boolean = false;
    colorBG = Color.WHITE.clone();
    tileMap:TileMap;
    ambientLight:AmbientLight;
    preloadingGameObject:RenderableModel;
    filters:AbstractFilter[] = [];

    public readonly resourceLoader: ResourceLoader;

    private _layers:Layer[] = [];
    private _uiLayer:Layer;

    protected _tweens:Tween[] = [];
    protected _tweenMovies:TweenMovie[] = [];
    protected _timers:Timer[] = [];

    constructor(protected game:Game) {
        this.tileMap = new TileMap(game);
        this.ambientLight = new AmbientLight(game);
        this._uiLayer = new Layer(this.game);
        this.addLayer(new Layer(game));
        this.resourceLoader = new ResourceLoader(game);
    }

    revalidate(){
        if (this.width == 0) this.width = this.game.width;
        if (this.height == 0) this.height = this.game.height;
    }


    getLayers(): Layer[] {
        return this._layers;
    }

    getUiLayer(): Layer {
        return this._uiLayer;
    }

    getAllGameObjects(){
        let res = []; // todo optimize
        const ONE = 1;
        for (let i=0;i<this._layers.length;i++) {
            let layer = this._layers[this._layers.length - ONE - i];
            for (let j = 0; j < layer.children.length; j++) {
                let go = layer.children[layer.children.length - ONE - j];
                res.push(go);
            }
        }
        return res;
    }

    getDefaultLayer(){
        return this._layers[0];
    }

    addLayer(layer:Layer){
        this._layers.push(layer);
    }

    removeLayer(layer:Layer){
        removeFromArray(this._layers,it=>it===layer);
    }

    appendChild(go:RenderableModel){
        go.revalidate();
        this.getDefaultLayer().appendChild(go);
    }

    prependChild(go:RenderableModel){
        this.getDefaultLayer().prependChild(go);
    }


    onPreloading(){}

    onProgress(val:number){}

    onReady(){}

    beforeUpdate(){}

    onUpdate(){}

    beforeRender(){}

    onRender(){}

    onDestroy(){}


    private updateMainFrame(){
        this.beforeUpdate();

        this._tweens.forEach((t:Tween, index:number)=>{
            t.update();
            if (t.isCompleted()) this._tweens.splice(index,1);
        });
        this._tweenMovies.forEach((t:TweenMovie,index:number)=>{
            t.update();
            if (t.isCompleted()) this._tweenMovies.splice(index,1);
        });
        this._timers.forEach((t:Timer)=>{
            t.onUpdate();
        });

        let layers = this._layers;
        for (let l of layers) {
            l.update();
        }
        this._uiLayer.update();

        this.onUpdate();
    }


    update(){
        if (!this.resourceLoader.isCompleted()) {
            if (this.preloadingGameObject!==undefined) {
                this.preloadingGameObject.update();
            }
        } else {
            this.updateMainFrame();
        }

    }

    private renderMainFrame(){
        let renderer = this.game.getRenderer();
        this.game.camera.update(this.game.getTime(),this.game.getDeltaTime());

        let layers = this._layers;
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

    private renderPreloadingFrame(){
        this.game.getRenderer().resetTransform();
        this.preloadingGameObject.render();
    }

    render(){

        this.beforeRender();

        let renderer:AbstractRenderer = this.game.getRenderer();
        renderer.beginFrameBuffer();
        if (this.useBG) renderer.clearColor(this.colorBG);
        else renderer.clear();

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

    //#MACROS_BODY_BEGIN = ./engine/macroses/tweenableMacros
    addTween(t: Tween): void {}
    addTweenMovie(tm: TweenMovie) {}
    tween(desc: TweenDescription): Tween {return undefined;}
    //#MACROS_BODY_END

    //#MACROS_BODY_BEGIN = ./engine/macroses/timerMacros
    setTimer(callback:Function,interval:number):Timer{return undefined;}
    //#MACROS_BODY_END

    //#MACROS_BODY_BEGIN = ./engine/macroses/eventEmitterMacros
    off(eventName: string, callBack: Function): void {}
    on(eventName: string, callBack: Function): Function {
        IMPORT_DEPENDS(EventEmitter,MOUSE_EVENTS,DebugError);
        return undefined;
    }
    trigger(eventName: string, data?: any): void {}
    //#MACROS_BODY_END

    destroy(){
        this.onDestroy();
    }
}

import {TileMap} from "./tileMap";
import {Layer} from "./layer";
import {AbstractFilter} from "../../core/renderer/webGl/filters/abstract/abstractFilter";
import {Game} from "../../core/game";
import {AmbientLight} from "../../core/light/ambientLight";
import {Color} from "../../core/renderer/color";
import {CAMERA_MATRIX_MODE} from "../../core/renderer/camera";
import {TextField} from "./ui/components/textField";
import {ResourceLoader} from "../../core/resources/resourceLoader";
import {Revalidatable} from "../../declarations";
import {RenderableModel} from "@engine/model/renderableModel";
import {TweenMovie} from "@engine/core/tweenMovie";
import {EventEmitter} from "@engine/core/misc/eventEmitter";
import {removeFromArray} from "@engine/core/misc/object";
import {DebugError} from "@engine/debugError";
import {MOUSE_EVENTS} from "@engine/core/control/mouse/mouseEvents";


export class Scene implements Revalidatable {

    readonly type:string = 'Scene';
    width:number;  // todo now is 0!!!
    height:number; // todo now is 0!!!
    useBG:boolean = false;
    colorBG = Color.WHITE;
    tileMap:TileMap;
    ambientLight:AmbientLight;
    preloadingGameObject:RenderableModel;
    filters:AbstractFilter[] = [];

    public readonly resourceLoader: ResourceLoader;

    private _tweenMovies:TweenMovie[] = []; // todo lazy?
    private _layers:Layer[] = [];
    private _uiLayer:Layer;


    constructor(protected game:Game) {
        this.tileMap = new TileMap(game);
        this.ambientLight = new AmbientLight(game);
        this._uiLayer = new Layer(this.game);
        this.addLayer(new Layer(game));
        this.resourceLoader = new ResourceLoader(game);
    }

    revalidate(){
        if (this.width = 0) this.width = this.game.width;
        if (this.height = 0) this.height = this.game.height;
    }


    getLayers(): Layer[] {
        return this._layers;
    }

    getUiLayer(): Layer {
        return this._uiLayer;
    }

    addTweenMovie(tm:TweenMovie){
        this._tweenMovies.push(tm);
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

    update(currTime:number,deltaTime:number){

        this.beforeUpdate();

        let layers = this._layers;
        for (let l of layers) {
            l.update(currTime,deltaTime);
        }
        this._uiLayer.update(currTime,deltaTime);

        this.onUpdate();

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

        // this.game.repository.getArray('ParticleSystem').forEach((ps:ParticleSystem)=>{ // todo also while? or foreach
        //     ps.render();
        // });

        if (DEBUG) {
            this.game.getRenderer().restore();
            if (this.game.getRenderer().debugTextField) {
                (this.game.getRenderer().debugTextField as TextField).update(this.game.getTime(),this.game.getDeltaTime());
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

        let renderer = this.game.getRenderer();
        if (this.useBG) renderer.clearColor(this.colorBG);
        else renderer.clear();
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

    // todo repeated block renderable model
    protected _emitter:EventEmitter;
    on(eventName:string,callBack:Function){

        if (DEBUG && !this.game.hasControl('Mouse')) {
            if (MOUSE_EVENTS[eventName]!=undefined) {
                throw new DebugError('can not listen mouse events: mouse control is not added');
            }
        }

        if (this._emitter===undefined) this._emitter = new EventEmitter();
        this._emitter.on(eventName,callBack);
        return callBack;
    }
    off(eventName:string,callBack:Function){
        if (this._emitter!==undefined)this._emitter.off(eventName,callBack);
    }
    trigger(eventName:string,data?:any){
        if (this._emitter!==undefined) this._emitter.trigger(eventName,data);
    }
}

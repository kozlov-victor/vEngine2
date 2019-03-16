import "./misc/polyfills";
import {Camera} from "./renderer/camera";
import {Point2d} from "./geometry/point2d";
import {AbstractRenderer} from "./renderer/abstract/abstractRenderer";
import {Scene} from "../model/impl/scene";
import {LightArray} from "./light/lightArray";
import {ColliderEngine} from "./physics/colliderEngine";
import {DebugError} from "../debugError";
import {AudioPlayer} from "./media/audioPlayer";
import {Clazz} from "@engine/core/misc/clazz";
import {IControl} from "@engine/core/control/abstract/iControl";
import {IAudioPlayer} from "@engine/core/media/interface/iAudioPlayer";

export enum SCALE_STRATEGY {
    NO_SCALE,
    FIT,
    STRETCH
}

export class Game {

    private _lastTime:number = 0;
    private _currTime:number = 0;
    private _deltaTime:number = 0;
    private _currentScene:Scene;
    private _running:boolean = false;
    private _destroyed:boolean = false;
    private _renderer:AbstractRenderer;
    private _controls:IControl[] = [];
    private audioPlayer:IAudioPlayer;

    scale:Point2d = new Point2d(1,1);
    pos:Point2d = new Point2d(0,0);
    width:number = 320;
    height:number = 240;
    gravityConstant:number = 0;
    fps:number = 0;
    lightArray:LightArray;
    collider:ColliderEngine;
    camera:Camera;
    scaleStrategy:number = SCALE_STRATEGY.FIT;

    private static UPDATE_TIME_RATE = 20;

    constructor(){
        this.collider = new ColliderEngine(this);
        this.camera = new Camera(this);
        this.lightArray = new LightArray(this);
        if (DEBUG) (window as any)['game'] = this;
    }

    addControl(C:Clazz<IControl>){
        const instance:IControl = new C(this);
        if (DEBUG) {
            for (let c of this._controls) {
                if (c.type===instance.type) {
                    throw new DebugError(`control with type "${c.type}" added already`)
                }
            }
        }
        this._controls.push(instance);
        instance.listenTo();
    }


    setAudioPLayer(p:IAudioPlayer){
        this.audioPlayer = p;
    }

    getAudioPlayer():IAudioPlayer{
        if (DEBUG && !this.audioPlayer) {
            throw new DebugError('audio player is not set');
        }
        return this.audioPlayer;
    }


    private isOfType<T>(instance:any,C:Clazz<T>):instance is T {
        return instance instanceof C;
    }

    getControl<T>(T:Clazz<IControl>):T {
        for (let c of this._controls) {
            if (c instanceof T) {
                if (this.isOfType(c,T)) return <T>(c as any);
            }
        }
        if (DEBUG) throw new DebugError('no such control');
    }

    hasControl(type:string):boolean {
        for (let c of this._controls) {
            if (c.type===type) {
                return true;
            }
        }
        return false;
    }

    getTime():number{
        return this._lastTime;
    }

    getDeltaTime():number{
        return this._deltaTime;
    }

    log(args:any){
        this._renderer.log(args);
    }

    setRenderer(Renderer:Clazz<AbstractRenderer>){
        this._renderer = new Renderer(this);
    }

    getRenderer():AbstractRenderer{
        return this._renderer;
    }

    private _cnt=0;
    debug2(...val:any[]){
        this._cnt++;
        if (this._cnt>10) throw new DebugError('too many logs');
    }

    runScene(scene:Scene){
        this._currentScene = scene;
        this.revalidate();
        scene.onPreloading();
        scene.resourceLoader.onProgress(()=>{
           scene.onProgress(scene.resourceLoader.getProgress());
        });
        scene.resourceLoader.startLoading();
        if (!this._running) this.update();
        this._running = true;
        scene.resourceLoader.onCompleted(()=>{
           this._currentScene.onReady();
        });
    }

    getCurrScene():Scene{
        if (DEBUG && !this._currentScene) throw new DebugError(`current scene is not set yet`);
        return this._currentScene;
    }

    update(){
        if (this._destroyed) return;
        this._lastTime = this._currTime;
        this._currTime = Date.now();
        let currTimeCopy = this._currTime;
        if (!this._lastTime) this._lastTime = this._currTime;
        this._deltaTime = this._currTime - this._lastTime;

        if (DEBUG) {
            this.fps = ~~(1000 / this._deltaTime);
            let renderError = this._renderer.getError();
            if (renderError) throw new DebugError(`render error with code ${renderError}`);
        }

        let dTime:number = Math.min(this._deltaTime,Game.UPDATE_TIME_RATE);
        let numOfLoops:number = (~~(this._deltaTime / Game.UPDATE_TIME_RATE))||1;
        let currTime:number = this._currTime - numOfLoops * Game.UPDATE_TIME_RATE;
        let loopCnt:number = 0;
        do {
            this._currentScene.update(currTime,dTime);
            //this.collider.collisionArcade(); todo
            for (let c of this._controls) {
                c.update();
            }
            currTime += Game.UPDATE_TIME_RATE;
            loopCnt++;
            if (loopCnt>10) { // to avoid to much iterations
                this._lastTime = this._currTime = currTimeCopy;
                break;
            }
        } while (loopCnt<numOfLoops);

        this._currentScene.render();

        requestAnimationFrame(this.update.bind(this));
    }

    destroy(){
        this._destroyed = true;
        for (let c of this._controls) {
            c.destroy();
        }
        this._renderer.cancelFullScreen();
        this._renderer.destroy();
    }

    revalidate() {
        if (DEBUG && !this._renderer) throw new DebugError(`game renderer is not set`);
        this.camera.revalidate();
    }

}


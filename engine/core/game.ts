import "@engine/misc/polyfills";
import {Camera} from "../renderer/camera";
import {Point2d} from "../geometry/point2d";
import {AbstractRenderer} from "../renderer/abstract/abstractRenderer";
import {Scene} from "./scene";
import {ColliderEngine} from "../physics/unused/colliderEngine";
import {DebugError} from "../debug/debugError";
import {IControl} from "@engine/control/abstract/iControl";
import {IAudioPlayer} from "@engine/media/interface/iAudioPlayer";
import {ClazzEx} from "@engine/core/declarations";
import {ResourceLink} from "@engine/resources/resourceLink";


export enum SCALE_STRATEGY {
    NO_SCALE,
    FIT,
    STRETCH
}

export interface IGameConstructorParams {
    width?:number;
    height?:number;
    scaleStrategy?: SCALE_STRATEGY;
}

export class Game {

    public static getInstance():Game{
        return Game.instance;
    }

    private static UPDATE_TIME_RATE:number = 20;
    private static instance:Game;


    public readonly width:number;
    public readonly height:number;
    public readonly scale:Point2d = new Point2d(1,1);
    public readonly pos:Point2d = new Point2d(0,0);
    public readonly screenSize = new Point2d(0,0);
    public readonly camera:Camera = new Camera(this);

    public gravityConstant:number = 0;
    public fps:number = 0;

    public readonly collider:ColliderEngine = new ColliderEngine(this);
    private _scaleStrategy:SCALE_STRATEGY = SCALE_STRATEGY.FIT;

    private _lastTime:number = 0;
    private _currTime:number = 0;
    private _deltaTime:number = 0;
    private _currentScene:Scene;
    private _running:boolean = false;
    private _destroyed:boolean = false;
    private _renderer:AbstractRenderer;
    private _controls:IControl[] = [];
    private audioPlayer:IAudioPlayer;


    constructor({width = 320,height = 240,scaleStrategy = SCALE_STRATEGY.FIT}:IGameConstructorParams = {}){
        Game.instance = this;
        if (DEBUG) (window as any).game = this;
        this.width = width;
        this.height = height;
        this._scaleStrategy = scaleStrategy;
    }

    get scaleStrategy(): SCALE_STRATEGY {
        return this._scaleStrategy;
    }

    public addControl(C:ClazzEx<IControl,Game>):void{
        const instance:IControl = new C(this);
        if (DEBUG) {
            for (const c of this._controls) {
                if (c.type===instance.type) {
                    throw new DebugError(`control with type "${c.type}" added already`);
                }
            }
        }
        this._controls.push(instance);
        instance.listenTo();
    }


    public setAudioPLayer(p:ClazzEx<IAudioPlayer,Game>):void{
        this.audioPlayer = new p(this);
    }

    public getAudioPlayer():IAudioPlayer{
        if (DEBUG && !this.audioPlayer) {
            throw new DebugError('audio player is not set');
        }
        return this.audioPlayer;
    }

    public hasControl(type:string):boolean {
        for (const c of this._controls) {
            if (c.type===type) {
                return true;
            }
        }
        return false;
    }

    public getTime():number{
        return this._lastTime;
    }

    public getDeltaTime():number{
        return this._deltaTime;
    }

    public log(args:any):void{
        if (DEBUG) this._renderer.log(args);
    }

    public clearLog():void{
        if (DEBUG) this._renderer.clearLog();
    }

    public setRenderer(Renderer:ClazzEx<AbstractRenderer,Game>):void{
        this._renderer = new Renderer(this);
    }

    public getRenderer():AbstractRenderer{
        return this._renderer;
    }

    public debug2?(...val:readonly any[]):void;

    public runScene(scene:Scene):void{
        this._currentScene = scene;
        this.revalidate();
        scene.onPreloading();
        scene.resourceLoader.onProgress(()=>{
           scene.onProgress(scene.resourceLoader.getProgress());
        });
        if (!this._running) this.update();
        this._running = true;
        scene.resourceLoader.onCompleted(()=>{
           this._currentScene.onReady();
        });
        scene.resourceLoader.startLoading();
    }

    public getCurrScene():Scene{
        if (DEBUG && !this._currentScene) throw new DebugError(`current scene is not set yet`);
        return this._currentScene;
    }

    public update():void{
        if (this._destroyed) return;
        this._lastTime = this._currTime;
        this._currTime = Date.now();
        const currTimeCopy:number = this._currTime;
        if (!this._lastTime) this._lastTime = this._currTime;
        this._deltaTime = this._currTime - this._lastTime;

        if (DEBUG) {
            this.fps = ~~(1000 / this._deltaTime);
            const renderError:{code:number,desc:string} = this._renderer.getError();
            if (renderError) {
                throw new DebugError(`rendering error with code ${renderError.code} (${renderError.desc})`);
            }
        }

        const numOfLoops:number = (~~(this._deltaTime / Game.UPDATE_TIME_RATE))||1;
        let currTime:number = this._currTime - numOfLoops * Game.UPDATE_TIME_RATE;
        let loopCnt:number = 0;
        do {
            this._currentScene.update();
            // this.collider.collisionArcade(); todo
            for (const c of this._controls) {
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

    public destroy():void{
        this._destroyed = true;
        for (const c of this._controls) {
            c.destroy();
        }
        if (this._renderer) {
            this._renderer.cancelFullScreen();
            this._renderer.destroy();
        }
    }

    public revalidate():void {
        if (DEBUG && !this._renderer) throw new DebugError(`game renderer is not set`);
        this.camera.revalidate();
    }


}

if (DEBUG) {
    let _cnt:number = 0;
    Game.prototype.debug2  = (...val:any[])=>{
        console.log(val);
        _cnt++;
        if (_cnt>16) throw new DebugError('too many logs');
    };
    if (!window.__POLYFILLS_INCLUDED__) throw new DebugError(`polyfills module is not included!`);
}


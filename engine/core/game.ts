import "@engine/misc/polyfills";
import {Camera} from "../renderer/camera";
import {Point2d} from "../geometry/point2d";
import {AbstractRenderer} from "../renderer/abstract/abstractRenderer";
import {Scene, SCENE_EVENTS} from "../scene/scene";
import {DebugError} from "../debug/debugError";
import {IControl} from "@engine/control/abstract/iControl";
import {IAudioPlayer} from "@engine/media/interface/iAudioPlayer";
import {ClazzEx, Optional} from "@engine/core/declarations";
import {ISceneTransition} from "@engine/scene/transition/abstract/iSceneTransition";
import {Stack} from "@engine/misc/collection/stack";
import {ISize, Size} from "@engine/geometry/size";
import {IPhysicsSystem} from "@engine/physics/common/interfaces";
import {SceneLifeCycleState} from "@engine/scene/sceneLifeCicleState";


export const enum SCALE_STRATEGY {
    NO_SCALE,
    FIT,
    STRETCH
}

export interface IGameConstructorParams {
    width?:number;
    height?:number;
    scaleStrategy?: SCALE_STRATEGY;
}

interface ISceneWithTransition {
    scene:Scene;
    transition:Optional<ISceneTransition>;
}

export class Game {

    public static getInstance():Game{
        return Game.instance;
    }

    private static UPDATE_TIME_RATE:number = 20;
    private static instance:Game;

    public readonly size:ISize = new Size();
    public readonly scale:Point2d = new Point2d(1,1);
    public readonly pos:Point2d = new Point2d(0,0);
    public readonly camera:Camera = new Camera(this);

    public fps:number = 0;

    private readonly _scaleStrategy:SCALE_STRATEGY = SCALE_STRATEGY.FIT;

    private _startedTime:number = 0;
    private _lastTime:number = 0;
    private _currTime:number = 0;
    private _deltaTime:number = 0;
    private _sceneStack:Stack<ISceneWithTransition> = new Stack();
    private _currScene:Scene;
    private _prevScene:Optional<Scene>;
    private _currSceneTransition:Optional<ISceneTransition>;
    private _running:boolean = false;
    private _destroyed:boolean = false;
    private _renderer:AbstractRenderer;
    private _controls:IControl[] = [];
    private audioPlayer:IAudioPlayer;
    private physicsSystem:IPhysicsSystem;
    private mainLoop:MainLoop = new MainLoop(this);


    constructor({width = 320,height = 240,scaleStrategy = SCALE_STRATEGY.FIT}:IGameConstructorParams = {}){
        Game.instance = this;
        if (DEBUG) (window as unknown as {game:Game}).game = this;
        (this.size as Size).setWH(width,height);
        this._scaleStrategy = scaleStrategy;
        this._startedTime = Date.now();
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

    public hasControl(type:string):boolean {
        return this.getControl(type)!==undefined;
    }

    public getControl<T extends IControl>(type:string):Optional<T> {
        for (const c of this._controls) {
            if (c.type===type) {
                return c as T;
            }
        }
        return undefined;
    }

    public setPhysicsSystem(s:ClazzEx<IPhysicsSystem,Game>){
        this.physicsSystem = new s(this);
    }

    public getPhysicsSystem<T extends IPhysicsSystem>():T {
        if (DEBUG && this.physicsSystem===undefined) throw new DebugError(`Physics system is not initialized.`);
        return this.physicsSystem as T;
    }

    public hasPhysicsSystem():boolean {
        return this.physicsSystem!==undefined;
    }

    public setAudioPLayer(p:ClazzEx<IAudioPlayer,Game>):void{
        this.audioPlayer = new p(this);
    }

    public getAudioPlayer<T extends IAudioPlayer>():T{
        if (DEBUG && !this.audioPlayer) {
            throw new DebugError('audio player is not set');
        }
        return this.audioPlayer as T;
    }


    public getCurrentTime():number{
        return this._lastTime;
    }

    public getDeltaTime():number{
        return this._deltaTime;
    }

    public getElapsedTime():number{
        return this._lastTime - this._startedTime;
    }

    public log(...args:unknown[]):void{
        if (DEBUG) this._renderer.log(...args);
    }

    public clearLog():void{
        if (DEBUG) this._renderer.clearLog();
    }

    public setRenderer(Renderer:ClazzEx<AbstractRenderer,Game>):void{
        this._renderer = new Renderer(this);
    }

    public getRenderer<T extends AbstractRenderer>():T{
        return this._renderer as T;
    }

    public debug2?(...val:unknown[]):void;

    public runScene(scene:Scene, transition?:Optional<ISceneTransition>,replaceStack:boolean = true):void{
        if (replaceStack) this._sceneStack.replaceLast({scene,transition});
        this._prevScene = this._currScene;
        if (this._prevScene!==undefined) {
            this._prevScene.trigger(SCENE_EVENTS.INACTIVATED, undefined!);
            this._prevScene.onInactivated();
            (this._currScene as {lifeCycleState:SceneLifeCycleState}).lifeCycleState = SceneLifeCycleState.INACTIVATED;
        }
        this._currScene = scene;
        if (this._currSceneTransition!==undefined) {
            this._currSceneTransition.complete();
            this._currSceneTransition = undefined;
        }
        if (transition!==undefined) {
            this._currSceneTransition = transition;
            transition.start(this._prevScene,this._currScene);
            transition.onComplete(()=>this._currSceneTransition = undefined);
        }

        this.revalidate();
        if (!scene.resourceLoader.isCompleted()) {
            this._currScene.trigger(SCENE_EVENTS.PRELOADING);
            scene?.preloadingTaskFromDecorators?.forEach(cb=>cb(scene));
            scene.onPreloading();
            scene.resourceLoader.onProgress(()=>{
                this._currScene.trigger(SCENE_EVENTS.PROGRESS);
                scene.onProgress(scene.resourceLoader.getProgress());
                (this._currScene as {lifeCycleState:SceneLifeCycleState}).lifeCycleState = SceneLifeCycleState.PRELOADING;
            });
            scene.resourceLoader.onCompleted(()=>{
                this._currScene.onReady();
                this._currScene.onContinue();
                this._currScene.trigger(SCENE_EVENTS.COMPLETED);
                (this._currScene as {lifeCycleState:SceneLifeCycleState}).lifeCycleState = SceneLifeCycleState.COMPLETED;
            });
            scene.resourceLoader.startLoading();
        } else {
            this._currScene.trigger(SCENE_EVENTS.CONTINUE);
            this._currScene.onContinue();
        }
        if (!this._running) {
            this.mainLoop.start();
            this._running = true;
        }
    }

    public pushScene(scene:Scene,transition?:Optional<ISceneTransition>){
        this.runScene(scene,transition,false);
        this._sceneStack.push({scene,transition});
    }

    public popScene():void{
        const last:ISceneWithTransition = this._sceneStack.pop()!;
        if (DEBUG && !last) throw new DebugError(`can not pop scene: no scene in stack`);
        const transition = last.transition?last.transition.getOppositeTransition():undefined;
        this.runScene(this._sceneStack.getLast()!.scene,transition);
    }

    public getCurrScene():Scene{
        if (DEBUG && !this._currScene) throw new DebugError(`current scene is not set yet`);
        return this._currScene;
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
            const renderError:Optional<{code:number,desc:string}> = this._renderer.getError();
            if (renderError!==undefined) {
                throw new DebugError(`rendering error with code ${renderError.code} (${renderError.desc})`);
            }
        }

        const numOfLoops:number = (~~(this._deltaTime / Game.UPDATE_TIME_RATE))||1;
        this._currTime = this._currTime - numOfLoops * Game.UPDATE_TIME_RATE;
        const currentScene:Scene = this._currScene;
        let loopCnt:number = 0;
        do {
            this._lastTime = this._currTime;
            this._currTime += Game.UPDATE_TIME_RATE;
            this._deltaTime = this._currTime - this._lastTime;

            if (this._currSceneTransition!==undefined) this._currSceneTransition.update();
            else currentScene.update();

            for (const c of this._controls) {
                c.update();
            }
            loopCnt++;
            if (loopCnt>10) { // to avoid too much iterations
                this._lastTime = this._currTime = currTimeCopy;
                break;
            }
        } while (loopCnt<numOfLoops);

        if (this._currSceneTransition!==undefined) this._currSceneTransition.render();
        else currentScene.render();

        this.camera.worldTransformDirty = false;
    }

    public destroy():void{
        this.mainLoop.stop();
        this._destroyed = true;
        for (const c of this._controls) {
            c.destroy();
        }
        if (this._renderer) {
            this._renderer.cancelFullScreen();
            this._renderer.destroy();
        }
        if (this.getAudioPlayer()) this.getAudioPlayer().stopAll();
    }

    public revalidate():void {
        if (DEBUG && !this._renderer) throw new DebugError(`game renderer is not set`);
        this.camera.revalidate();
    }


}

if (DEBUG) {
    let _cnt:number = 0;
    Game.prototype.debug2  = (...val:unknown[])=>{
        console.log(val);
        _cnt++;
        if (_cnt>16) throw new DebugError('too many logs');
    };
    if (!window.__POLYFILLS_INCLUDED__) throw new DebugError(`polyfills module is not included!`);
}

if (DEBUG) {
    const now = Date.now();
    const passed = now - BUILD_AT;
    console.log(`last compiled ${passed/1000} sec ago`);
}

class MainLoop {

    private timerId:number;

    constructor(private game:Game) {
    }

    public start():void{
        const game:Game = this.game;
        const updateFn:()=>void = game.update.bind(game);
        const loopFn = ()=>{
            updateFn();
            this.timerId = requestAnimationFrame(loopFn);
        };
        this.timerId = requestAnimationFrame(loopFn);
    }

    public stop():void {
        cancelAnimationFrame(this.timerId);
    }

}

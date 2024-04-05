import "@engine/misc/polyfills";
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
import {TaskQueue} from "@engine/resources/taskQueue";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {FpsCounter} from "@engine/core/fpsCounter";


export const enum SCALE_STRATEGY {
    NO_SCALE,
    FIT_CANVAS_TO_SCREEN,
    STRETCH_CANVAS_TO_SCREEN
}

export interface IGameConstructorParams {
    width?:number;
    height?:number;
    scaleStrategy?: SCALE_STRATEGY;
    containerElement?:HTMLElement;
}

interface ISceneWithTransition {
    scene:Scene;
    transition:Optional<ISceneTransition>;
}

export const enum GAME_EVENTS {
    PRELOADING = 'PRELOADING',
}

export class Game {

    public readonly loadEventHandler = new EventEmitterDelegate<GAME_EVENTS,{taskQueue:TaskQueue}>(this);

    constructor({width = 320,height = 240,scaleStrategy = SCALE_STRATEGY.FIT_CANVAS_TO_SCREEN, containerElement}:IGameConstructorParams = {}){
        Game._instance = this;
        if (DEBUG) (window as unknown as {game:Game}).game = this;
        (this.size as Size).setWH(width,height);
        this.scaleStrategy = scaleStrategy;
        this._startedTime = Date.now();
        this.rootContainerElement = containerElement;
    }

    public get width():number {
        return this.size.width;
    }

    public getCenterX() {
        return this.size.width/2;
    }

    public getCenterY() {
        return this.size.height/2;
    }

    public get height():number {
        return this.size.height;
    }

    private static readonly _UPDATE_TIME_RATE = Math.ceil(1000 / 60);
    private static _instance:Game;

    public readonly size:ISize = new Size();
    public readonly scale:Point2d = new Point2d(1,1);
    public readonly pos:Point2d = new Point2d(0,0);
    public readonly rootContainerElement:Optional<HTMLElement>;
    public readonly scaleStrategy:SCALE_STRATEGY = SCALE_STRATEGY.FIT_CANVAS_TO_SCREEN;

    private readonly _startedTime:number = 0;
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
    private _audioPlayer:IAudioPlayer;
    private _physicsSystem:IPhysicsSystem;
    private _mainLoop = new MainLoop(this);
    private _fpsCounter = new FpsCounter();

    public static getInstance():Game{
        return Game._instance;
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

    public hasControl(type:'KeyboardControl'|'MouseControl'|'GamePadControl'|string):boolean {
        for (const c of this._controls) {
            if (c.type===type) {
                return true;
            }
        }
        return false;
    }

    public getControl<T extends IControl>(type:ClazzEx<T, Game>):T {
        for (const c of this._controls) {
            if ((c as any).constructor===type) {
                return c as T;
            }
        }
        if (DEBUG) {
            throw new DebugError(`control with type "${type.name}" is not added`);
        }
        else throw new Error();
    }

    public setPhysicsSystem(clz:ClazzEx<IPhysicsSystem,Game>):void{
        this._physicsSystem = new clz(this);
    }

    public getPhysicsSystem<T extends IPhysicsSystem>(type?:ClazzEx<T, Game>):T {
        if (DEBUG && this._physicsSystem===undefined) throw new DebugError(`Physics system is not initialized.`);
        const system = this._physicsSystem as T;
        if (type===undefined) return system;
        if (DEBUG) {
            if ((system as any).constructor!==type) {
                throw new DebugError(`can not get physics system with type "${type.name} - current system is of type "${system.constructor.name}"`)
            }
        }
        return system;
    }

    public hasPhysicsSystem():boolean {
        return this._physicsSystem!==undefined;
    }

    public setAudioPLayer(p:ClazzEx<IAudioPlayer,Game>):void{
        this._audioPlayer = new p(this);
    }

    public getAudioPlayer<T extends IAudioPlayer>():T{
        if (DEBUG && !this._audioPlayer) {
            throw new DebugError('audio player is not set');
        }
        return this._audioPlayer as T;
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

    public setRenderer(Renderer:ClazzEx<AbstractRenderer,Game>):void{
        this._renderer = new Renderer(this);
    }

    public getRenderer<T extends AbstractRenderer>(type?:ClazzEx<T,any>):T{
        const renderer = this._renderer as T;
        if (type===undefined) return renderer;
        if (DEBUG) {
            if ((renderer as any).constructor!==type) {
                throw new DebugError(`can not get renderer with type "${type.name} - current renderer is of type "${renderer.constructor.name}"`)
            }
        }
        return renderer;
    }

    public runScene(scene:Scene, transition?:Optional<ISceneTransition>,replaceStack:boolean = true):void{
        Scene._currentRenderingScene = scene;
        if (replaceStack) this._sceneStack.replaceLast({scene,transition});
        this._prevScene = this._currScene;
        if (this._prevScene!==undefined) {
            this._prevScene.sceneEventHandler.trigger(SCENE_EVENTS.INACTIVATED, undefined!);
            this._prevScene.onInactivated();
            this._prevScene.lifeCycleState = SceneLifeCycleState.INACTIVATED;
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
        if (this._currScene.lifeCycleState===SceneLifeCycleState.CREATED) {
            this._currScene.lifeCycleState = SceneLifeCycleState.PRELOADING;
            const taskQueue = new TaskQueue(this);
            taskQueue.
                scheduleStart().
                catch(e=>{
                    if (window.onerror) window.onerror(e);
                    console.trace(e);
                });
            this._currScene.sceneEventHandler.trigger(SCENE_EVENTS.PRELOADING,{taskQueue});
            this.loadEventHandler.trigger(GAME_EVENTS.PRELOADING,{taskQueue});
            scene.onPreloading(taskQueue);
            const resourceLoader = taskQueue.getLoader();
            resourceLoader.onProgress((n:number)=>{
                this._currScene.sceneEventHandler.trigger(SCENE_EVENTS.PROGRESS,{taskQueue});
                scene.onProgress(n);
            });
            resourceLoader.onResolved(()=>{
                this._currScene.onReady();
                this._currScene.onContinue();
                this._currScene.sceneEventHandler.trigger(SCENE_EVENTS.LOADING_COMPLETED,{taskQueue});
                this._currScene.lifeCycleState = SceneLifeCycleState.COMPLETED;
            });
        } else {
            this._currScene.sceneEventHandler.trigger(SCENE_EVENTS.CONTINUE,{taskQueue:undefined!});
            this._currScene.lifeCycleState = SceneLifeCycleState.COMPLETED;
            this._currScene.onContinue();
        }

        if (!this._running) {
            this._mainLoop.start();
            this._running = true;
        }
    }

    public pushScene(scene:Scene,transition?:Optional<ISceneTransition>):void{
        this.runScene(scene,transition,false);
        this._sceneStack.push({scene,transition});
    }

    public popScene():void{
        const last:ISceneWithTransition = this._sceneStack.pop()!;
        if (DEBUG && !last) throw new DebugError(`can not pop scene: no scene in stack`);
        const transition:Optional<ISceneTransition> = last.transition?last.transition.getOppositeTransition():undefined;
        const prevScene:Scene = this._sceneStack.getLast()!.scene;
        this.runScene(prevScene,transition);
    }

    public getCurrentScene():Scene{
        if (DEBUG && !this._currScene) throw new DebugError(`current scene is not set yet`);
        return this._currScene;
    }

    public update():void{
        if (this._destroyed) return;
        this._lastTime = this._currTime;
        this._currTime = Date.now();
        if (!this._lastTime) this._lastTime = this._currTime;
        this._deltaTime = this._currTime - this._lastTime;
        const currTimeOrig = this._currTime;
        const deltaTimeOrig = this._deltaTime;

        if (DEBUG) {
            const renderError = this._renderer.getError();
            if (renderError!==undefined) {
                throw new DebugError(`rendering error with code ${renderError.code} (${renderError.desc})`);
            }
        }

        const numOfLoops:number = Math.ceil(this._deltaTime / Game._UPDATE_TIME_RATE);
        this._currTime =
            numOfLoops===1?
                currTimeOrig:
                this._lastTime;

        const currentScene:Scene = this._currScene;
        let loopCnt:number = 0;
        do {
            if (loopCnt===numOfLoops-1) { // last loop
                this._currTime = currTimeOrig;
            } else {
                this._currTime += Game._UPDATE_TIME_RATE;
            }
            this._deltaTime = this._currTime - this._lastTime;

            if (this._currSceneTransition!==undefined) this._currSceneTransition.update();
            else currentScene.update();

            for (const c of this._controls) {
                c.update();
            }

            this._lastTime = this._currTime;
            loopCnt++;
            if (loopCnt>10) { // to avoid too many iterations
                break;
            }
        } while (loopCnt<numOfLoops);

        this._currTime = currTimeOrig;
        this._deltaTime = deltaTimeOrig;

        if (this._currSceneTransition!==undefined) this._currSceneTransition.render();
        else currentScene.render();

        if (DEBUG) {
            this._fpsCounter.enterFrame(deltaTimeOrig);
        }
    }

    public hasCurrentTransition():boolean {
        return this._currSceneTransition!==undefined;
    }

    public get fps():number {
        return this._fpsCounter.getFps();
    }

    public destroy():void{
        this._mainLoop.stop();
        this._destroyed = true;
        for (const c of this._controls) {
            c.destroy();
        }
        if (this._renderer) {
            this._renderer.cancelFullScreen();
            this._renderer.destroy();
        }
        if (this._audioPlayer) this._audioPlayer.stopAll();
    }

    public revalidate():void {
        if (DEBUG && !this._renderer) throw new DebugError(`game renderer is not set`);
    }



}

if (DEBUG) {
    if (!window.__POLYFILLS_INCLUDED__) throw new DebugError(`polyfills module is not included!`);
}

if (DEBUG) {
    const now = Date.now();
    const passed = now - BUILD_AT;
    console.log(`last compiled ${passed/1000} sec ago, ${COMMIT_HASH}`);
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

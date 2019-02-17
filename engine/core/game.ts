import "./misc/polyfills";
import {Mouse} from "./control/mouse";
import {Keyboard} from "./control/keyboard";
import {GamePad} from "./control/gamePad";
import {Camera} from "./renderer/camera";
import {SCALE_STRATEGY} from "./misc/consts";
import {Point2d} from "./geometry/point2d";
import {AbstractRenderer} from "./renderer/abstract/abstractRenderer";
import {Scene} from "../model/impl/scene";
import {LightArray} from "./light/lightArray";
import {ColliderEngine} from "./physics/colliderEngine";
import {DebugError} from "../debugError";
import {AudioPlayer} from "./media/audioPlayer";
import {Clazz} from "@engine/core/misc/clazz";
import {UIBuilder} from "@engine/model/impl/ui/uiBuilder";


export class Game {

    private _lastTime:number = 0;
    private _currTime:number = 0;
    private _deltaTime:number = 0;
    private _currentScene:Scene;
    private _running:boolean = false;
    private _destroyed:boolean = false;
    private _renderer:AbstractRenderer;

    audioPlayer:AudioPlayer;
    scale:Point2d = new Point2d(1,1);
    pos:Point2d = new Point2d(0,0);
    width:number = 320;
    height:number = 240;
    gravityConstant:number = 0;
    fps:number = 0;
    gamePad:GamePad;
    lightArray:LightArray;
    mouse:Mouse;
    keyboard:Keyboard;
    collider:ColliderEngine;
    camera:Camera;
    uiBuilder:UIBuilder;
    scaleStrategy:number = SCALE_STRATEGY.FIT;

    private static UPDATE_TIME_RATE = 20;

    constructor(){
        this.mouse = new Mouse(this);
        this.keyboard = new Keyboard(this);
        this.keyboard.listenTo();
        this.gamePad = new GamePad(this);
        this.collider = new ColliderEngine(this);
        this.camera = new Camera(this);
        this.lightArray = new LightArray(this);
        this.uiBuilder = new UIBuilder(this);
        this.audioPlayer = new AudioPlayer(this);
        if (DEBUG) (window as any)['game'] = this;
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
        this.mouse.listenTo(this._renderer.container); // todo
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
            this.keyboard.update();
            this.gamePad.update();
            this.audioPlayer.update(currTime,dTime);
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
        this.keyboard.destroy();
        this.mouse.destroy();
        this._renderer.cancelFullScreen();
        this._renderer.destroy();
    }

    revalidate() {
        if (DEBUG && !this._renderer) throw new DebugError(`game renderer is not set`);
        this.camera.revalidate();
    }

}


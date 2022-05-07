import {Layer, LayerTransformType} from "./layer";
import {Game} from "@engine/core/game";
import {Color} from "@engine/renderer/common/color";
import {IAlphaBlendable, IFilterable, IRevalidatable, ITweenable, Optional} from "@engine/core/declarations";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {AbstractRenderer, IRenderTarget} from "@engine/renderer/abstract/abstractRenderer";
import {ITweenDescription, Tween} from "@engine/animation/tween";
import {Timer} from "@engine/misc/timer";
import {TweenableDelegate} from "@engine/delegates/tweenableDelegate";
import {TimerDelegate} from "@engine/delegates/timerDelegate";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {Point2d} from "@engine/geometry/point2d";
import {IStateStackPointer} from "@engine/renderer/webGl/base/frameBufferStack";
import {IAnimation} from "@engine/animation/iAnimation";
import {Mat4} from "@engine/misc/math/mat4";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {DebugError} from "@engine/debug/debugError";
import {SceneLifeCycleState} from "@engine/scene/sceneLifeCicleState";
import {Size} from "@engine/geometry/size";
import {RenderingObjectStack} from "@engine/scene/internal/renderingObjectStack";
import {RenderingSessionInfo} from "@engine/scene/internal/renderingSessionInfo";
import {Camera} from "@engine/renderer/camera";
import {TaskQueue} from "@engine/resources/taskQueue";
import {KeyboardEventEmitterDelegate} from "@engine/delegates/eventDelegates/keyboardEventEmitterDelegate";
import {MouseEventEmitterDelegate} from "@engine/delegates/eventDelegates/mouseEventEmitterDelegate";
import {GamepadEventEmitterDelegate} from "@engine/delegates/eventDelegates/gamepadEventEmitterDelegate";
import IDENTITY_HOLDER = Mat4.IDENTITY_HOLDER;
import {ISceneMouseEvent} from "@engine/control/mouse/mousePoint";
import {SpatialSpace} from "@engine/physics/common/spatialSpace";

export const enum SCENE_EVENTS {
    PRELOADING = 'PRELOADING',
    PROGRESS = 'PROGRESS',
    LOADING_COMPLETED = 'LOADING_COMPLETED',
    CONTINUE = 'CONTINUE',
    INACTIVATED = 'INACTIVATED'
}

export abstract class Scene implements IRevalidatable, ITweenable,IFilterable,IAlphaBlendable {

    public static _currentRenderingScene:Scene;

    constructor(protected game:Game) {
        this._renderingObjectStack = new RenderingObjectStack();
        this.size.setFrom(this.game.size);
    }

    public readonly type:string = "Scene";
    public backgroundColor = Color.WHITE.clone();
    public readonly pos:Point2d = new Point2d();
    public filters:IFilter[] = [];
    public alpha:number = 1;
    public interactive:boolean = false;
    public readonly size:Size = new Size();
    public lifeCycleState:SceneLifeCycleState = SceneLifeCycleState.CREATED;
    public preloadingGameObject:RenderableModel;
    public readonly camera:Camera = new Camera(this.game,this);
    public _spatialSpace:SpatialSpace;


    public readonly keyboardEventHandler:KeyboardEventEmitterDelegate = new KeyboardEventEmitterDelegate(this.game);
    public readonly gamepadEventHandler:GamepadEventEmitterDelegate = new GamepadEventEmitterDelegate(this.game);
    public readonly mouseEventHandler:MouseEventEmitterDelegate<ISceneMouseEvent> = new MouseEventEmitterDelegate<ISceneMouseEvent>(this.game,this);
    public readonly sceneEventHandler = new EventEmitterDelegate<SCENE_EVENTS,{taskQueue:TaskQueue}>(this.game);

    public readonly _renderingObjectStack:RenderingObjectStack;
    public readonly _renderingSessionInfo:RenderingSessionInfo = new RenderingSessionInfo();

    private _layers: Layer[] = [];
    private _propertyAnimations:IAnimation[] = [];

    // addTween
    private _tweenDelegate: TweenableDelegate = new TweenableDelegate(this.game);

    // timer
    private _timerDelegate:TimerDelegate = new TimerDelegate(this.game);


    private static isLayerGuard(modelOrLayer:RenderableModel|Layer):modelOrLayer is Layer {
        return modelOrLayer.type==='Layer';
    }

    public revalidate():void {
        if (this.size.isZero()) this.size.setFrom(this.game.size);
    }


    public getLayers(): Layer[] {
        return this._layers;
    }

    public getGame():Game {
        return this.game;
    }


    public getDefaultLayer():Layer {
        if (!this._layers.length) this.appendChild(new Layer(this.game));
        return this._layers[this._layers.length-1];
    }

    public getLayerById(id:string):Optional<Layer> {
        for (const layer of this._layers) {
            if (layer.id===id) return layer;
        }
        return undefined;
    }

    public getLayerAtIndex(index:number):Layer {
        return this._layers[index];
    }

    public removeChild(modelOrLayer:RenderableModel|Layer):void{
        if (Scene.isLayerGuard(modelOrLayer)) {
            const i:number = this._layers.indexOf(modelOrLayer);
            if (DEBUG && i===-1) throw new DebugError(`can not remove layer: is doesn't belong to target scene`);
            this._layers.splice(i,1);
        } else {
            this.getDefaultLayer().removeChild(modelOrLayer);
        }
    }

    public appendChild(model:RenderableModel):void;
    public appendChild(layer:Layer):void;
    public appendChild(modelOrLayer:RenderableModel|Layer):void {
        if (DEBUG && !modelOrLayer) {
            throw new DebugError(`cannot append child, is is ${modelOrLayer}`);
        }
        if (Scene.isLayerGuard(modelOrLayer)) {
            if (DEBUG && this._layers.indexOf(modelOrLayer)>-1) {
                console.error(modelOrLayer);
                throw new DebugError(`this layer is already added to this scene`);
            }
            modelOrLayer._setScene(this);
            this._layers.push(modelOrLayer);
        } else {
            this.getDefaultLayer().appendChild(modelOrLayer);
        }

    }

    public prependChild(model:RenderableModel):void;
    public prependChild(layer:Layer):void;
    public prependChild(modelOrLayer:RenderableModel|Layer):void {
        if (Scene.isLayerGuard(modelOrLayer)) {
            modelOrLayer._setScene(this);
            this._layers.unshift(modelOrLayer);
        } else {
            this.getDefaultLayer().prependChild(modelOrLayer);
        }
    }

    public fitSizeToChildren():void {
        let maxRight:number = this.game.size.width;
        let maxBottom:number = this.game.size.height;
        this._layers.forEach(l=>{
            l._children.forEach(c=>{
                const right:number = c.pos.x+c.size.width;
                const bottom:number = c.pos.y+c.size.height;
                if (right>maxRight) maxRight = right;
                if (bottom>maxBottom) maxBottom = bottom;
            });
        });
        this.size.setWH(maxRight,maxBottom);
    }


    public update():void {
        if (this.lifeCycleState!==SceneLifeCycleState.COMPLETED) {
            if (this.preloadingGameObject!==undefined) {
                this.preloadingGameObject.update();
            }
        } else {
            this.updateFrame();
        }
    }

    public renderToTexture(target:IRenderTarget):void {
        this.game.getRenderer().getHelper().renderSceneToTexture(this,target);
    }

    public addPropertyAnimation(animation:IAnimation):void{
        this._propertyAnimations.push(animation);
    }

    public addTween<T>(t: Tween<T>): void {
        this._tweenDelegate.addTween(t);
    }
    public addTweenMovie(tm: TweenMovie):void {
        this._tweenDelegate.addTweenMovie(tm);
    }
    public tween<T>(desc: ITweenDescription<T>): Tween<T> {
        return this._tweenDelegate.tween(desc);
    }

    public setTimeout(callback:()=>void,interval:number):Timer {
        return this._timerDelegate.setTimeout(callback,interval);
    }

    public setInterval(callback:()=>void,interval:number):Timer {
        return this._timerDelegate.setInterval(callback,interval);
    }

    public findChildById<T extends RenderableModel>(id:string):Optional<T>{
        for (const l of this._layers) {
            const possibleObject:Optional<RenderableModel>= l.findChildById(id);
            if (possibleObject) return possibleObject as T;
        }
        return undefined;
    }

    public onPreloading(taskQueue:TaskQueue):void {
        const rect = new Rectangle(this.game);
        rect.fillColor.setRGB(10,100,100);
        rect.size.height = 10;
        this.preloadingGameObject = rect;
    }

    public onProgress(val:number):void {
        if (this.preloadingGameObject!==undefined) this.preloadingGameObject.size.width = val*this.game.size.width;
    }

    public onReady():void {}

    public onContinue():void {}


    public render():void {
        Scene._currentRenderingScene = this;
        this._renderingObjectStack.clear();
        const renderer:AbstractRenderer = this.game.getRenderer();
        renderer.transformSave();
        renderer.clearColor.setFrom(this.backgroundColor);

        const ptr:IStateStackPointer = renderer.beforeItemStackDraw(this.filters,this.alpha,false);
        renderer.beforeFrameDraw();

        if (this.camera.worldTransformDirty) {
            this.camera._translate();
            this.camera._transform();
            this.camera.worldTransformMatrix.fromMat16(this.game.getRenderer().transformGet());
        } else {
            this.game.getRenderer().transformSet(this.camera.worldTransformMatrix);
        }

        if (this.lifeCycleState===SceneLifeCycleState.PRELOADING) {
            if (this.preloadingGameObject!==undefined) {
                this.preloadingGameObject.render();
            }
        } else {
            for (const l of this._layers) {
                this._renderingSessionInfo.currentLayer = l;
                const isStuck = l.transformType===LayerTransformType.STICK_TO_CAMERA;
                if (isStuck) {
                    renderer.transformSave();
                    renderer.transformSet(IDENTITY_HOLDER);
                }
                l.render();
                if (isStuck) {
                    renderer.transformRestore();
                }
            }
        }

        renderer.transformSave();
        if (this.lifeCycleState===SceneLifeCycleState.COMPLETED) this.onRender();
        renderer.transformRestore();

        renderer.afterItemStackDraw(ptr);
        renderer.afterFrameDraw();
        renderer.transformRestore();

        this.camera.worldTransformDirty = false;
    }

    public onInactivated():void {}

    protected onUpdate():void {}

    protected onRender():void {}

    private updateFrame():void {
        this.camera.update();
        this._tweenDelegate.update();
        this._timerDelegate.update();
        for (const a of this._propertyAnimations) a.update();
        for (const l of this._layers) l.update();
        if (this.game.hasPhysicsSystem()) this.game.getPhysicsSystem().nextTick(this);
        this.onUpdate();
    }

}

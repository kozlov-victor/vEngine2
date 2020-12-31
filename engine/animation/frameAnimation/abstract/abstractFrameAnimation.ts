import {ICloneable, IEventemittable} from "@engine/core/declarations";
import {Game} from "@engine/core/game";
import {EventEmitterDelegate} from "@engine/delegates/eventEmitterDelegate";
import {DebugError} from "@engine/debug/debugError";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {IAnimation, ITargetAnimation} from "@engine/animation/iAnimation";

export const enum FRAME_ANIMATION_EVENTS {
    completed =  'completed',
    canceled  =  'canceled',
    loop      =  'loop',
}

export abstract class AbstractFrameAnimation<T> implements IEventemittable,ITargetAnimation, ICloneable<AbstractFrameAnimation<T>> {

    public name:string;
    public duration:number = 1000;
    public isRepeating:boolean = true;
    public frames:T[] = [];

    public target:AnimatedImage;

    private _currFrame:number = -1;
    private _startTime:number = 0;
    private _timeForOneFrame:number;
    private _isPlaying:boolean = false;
    private _loopReached:boolean = false;

    //eventEmitter
    private readonly _eventEmitterDelegate:EventEmitterDelegate = new EventEmitterDelegate();


    constructor(protected game:Game) {}

    public abstract clone():this;

    public revalidate():void {
        if (DEBUG && !this.frames.length) throw new DebugError(`animation frames can not be empty`);
        this._timeForOneFrame = ~~(this.duration / this.frames.length);
        this.onNextFrame(0);
    }

    public play():this {
        if (DEBUG) {
            if (!this.target) throw new DebugError(`can not play frame animation: it is not attached to parent`);
        }
        if (this.target.getCurrentFrameAnimation()?._isPlaying) {
            this.target.getCurrentFrameAnimation()!.trigger(FRAME_ANIMATION_EVENTS.canceled);
        }
        if (this.target.getCurrentFrameAnimation()!==this) {
            this.target.playFrameAnimation(this);
        }
        this._isPlaying = true;
        return this;
    }

    public stop():void {
        if (DEBUG && !this.target) throw new DebugError(`can not stop frame animation: it is not attached to parent`);
        this._isPlaying = false;
        this._startTime = 0;
        this._loopReached = false;
    }

    public update():void {
        if (!this._isPlaying) return;
        const time:number = this.game.getCurrentTime();
        if (!this._startTime) this._startTime = time;
        const delta:number = (time - this._startTime) % this.duration;
        let currFrame:number = ~~((this.frames.length) * delta / this.duration);
        currFrame = currFrame % this.frames.length;
        if (currFrame===this._currFrame) return;
        if (this._loopReached && !this.isRepeating) {
            this.stop();
            this.trigger(FRAME_ANIMATION_EVENTS.completed);
            return;
        }
        this._currFrame = currFrame;
        this.onNextFrame(currFrame);
        if (this._currFrame===this.frames.length-1) {
            this.trigger(FRAME_ANIMATION_EVENTS.loop);
            this._loopReached = true;
        }
    }

    public off(eventName: FRAME_ANIMATION_EVENTS, callBack: (arg?:never)=>void): void {
        this._eventEmitterDelegate.off(eventName,callBack as (arg:any)=>void);
    }
    public on(eventName: FRAME_ANIMATION_EVENTS, callBack: (arg?:never)=>void): (arg?:unknown)=>void {
        return this._eventEmitterDelegate.on(eventName,callBack as (arg:any)=>void);
    }
    public once(eventName: FRAME_ANIMATION_EVENTS, callBack: (arg?:never)=>void):void {
        this._eventEmitterDelegate.once(eventName,callBack as (arg:any)=>void);
    }
    public trigger(eventName: FRAME_ANIMATION_EVENTS, data?: never): void {
        this._eventEmitterDelegate.trigger(eventName,data);
    }

    protected abstract onNextFrame(i:number):void;

    protected setClonedProperties(cloned:AbstractFrameAnimation<unknown>):void {
        cloned.frames = [...this.frames];
        cloned.duration = this.duration;
        cloned.isRepeating = this.isRepeating;
        cloned.name = this.name;
        cloned.target = undefined!;
    }

}

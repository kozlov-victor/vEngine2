import {ICloneable} from "@engine/core/declarations";
import {Game} from "@engine/core/game";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {DebugError} from "@engine/debug/debugError";
import {AnimatedImage} from "@engine/renderable/impl/general/animatedImage";
import {ITargetAnimation} from "@engine/animation/iAnimation";

export const enum FRAME_ANIMATION_EVENTS {
    completed =  'completed',
    canceled  =  'canceled',
    loop      =  'loop',
}

export interface IFrameAnimationBaseParams {
    name: string;
    duration?:number;
    isRepeating?:boolean;
}

export interface IFrameAnimationParams<T> extends IFrameAnimationBaseParams{
    frames:T[];
}

export abstract class AbstractFrameAnimation<T> implements ITargetAnimation, ICloneable<AbstractFrameAnimation<T>> {

    public _target:AnimatedImage;

    protected _name:string;
    protected _duration:number = 1000;
    protected _isRepeating:boolean = true;
    protected _frames:T[] = [];

    private _currFrame:number = -1;
    private _startTime:number = 0;
    private _timeForOneFrame:number;
    private _isPlaying:boolean = false;
    private _loopReached:boolean = false;

    public readonly animationEventHandler:EventEmitterDelegate<FRAME_ANIMATION_EVENTS,void> = new EventEmitterDelegate(this.game);

    public constructor(protected game:Game,params:IFrameAnimationParams<T>) {
        this._name = params.name;
        this._frames = params.frames;
        this._duration = params.duration ?? this._duration;
        this._isRepeating = params.isRepeating ?? this._isRepeating;
    }

    public abstract clone():this;

    public revalidate():void {
        if (DEBUG && !this._frames.length) throw new DebugError(`animation frames can not be empty`);
        this._timeForOneFrame = ~~(this._duration / this._frames.length);
        this.onNextFrame(0);
    }

    public play():this {
        if (DEBUG) {
            if (!this._target) throw new DebugError(`can not play frame animation: it is not attached to parent`);
        }
        if (this._target.getCurrentFrameAnimation()?._isPlaying) {
            this._target.getCurrentFrameAnimation()!.animationEventHandler.trigger(FRAME_ANIMATION_EVENTS.canceled);
        }
        if (this._target.getCurrentFrameAnimation()!==this) {
            this._target.playFrameAnimation(this);
        }
        this._isPlaying = true;
        return this;
    }

    public setDuration(duration:number):void {
        this._duration = duration;
    }

    public setRepeating(repeating:boolean):void {
        this._isRepeating = repeating;
    }

    public setDurationByOneFrame(durationOfOneFrame:number):void {
        this._duration = durationOfOneFrame*this._frames.length;
    }

    public stop():void {
        if (DEBUG && !this._target) throw new DebugError(`can not stop frame animation: it is not attached to parent`);
        this._isPlaying = false;
        this._startTime = 0;
        this._loopReached = false;
    }

    public getName():string {
        return this._name;
    }

    public update():void {
        if (!this._isPlaying) return;
        const time:number = this.game.getCurrentTime();
        if (!this._startTime) this._startTime = time;
        const delta:number = (time - this._startTime) % this._duration;
        let currFrame:number = ~~((this._frames.length) * delta / this._duration);
        currFrame = currFrame % this._frames.length;
        if (currFrame===this._currFrame) return;
        if (this._loopReached && !this._isRepeating) {
            this.stop();
            this.animationEventHandler.trigger(FRAME_ANIMATION_EVENTS.completed);
            return;
        }
        this._currFrame = currFrame;
        this.onNextFrame(currFrame);
        if (this._currFrame===this._frames.length-1) {
            this.animationEventHandler.trigger(FRAME_ANIMATION_EVENTS.loop);
            this._loopReached = true;
        }
    }


    protected abstract onNextFrame(i:number):void;

    protected setClonedProperties(cloned:AbstractFrameAnimation<unknown>):void {
        cloned._target = undefined!;
    }

}

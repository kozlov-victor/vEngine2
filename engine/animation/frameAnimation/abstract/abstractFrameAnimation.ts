import {ICloneable} from "@engine/core/declarations";
import {Game} from "@engine/core/game";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {DebugError} from "@engine/debug/debugError";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {ITargetAnimation} from "@engine/animation/iAnimation";

export const enum FRAME_ANIMATION_EVENTS {
    completed,
    canceled,
    loop,
}

interface IDuration {
    duration: number;
}

interface IDurationOfOneFrame {
    durationOfOneFrame: number;
}

export type tFrameAnimationDuration = IDuration | IDurationOfOneFrame;

export interface IFrameAnimationBaseParams {
    isRepeating?:boolean;
}

export interface IFrameAnimationParams<T> extends IFrameAnimationBaseParams{
    frames:T[];
}

export abstract class AbstractFrameAnimation<T> implements ITargetAnimation, ICloneable<AbstractFrameAnimation<T>> {

    public _target:AnimatedImage;

    protected _name:string;
    protected _duration = 1000;
    protected _isRepeating = true;
    protected _frames:T[] = [];

    private _currFrame = 0;
    private _startTime = 0;
    private _isPlaying = false;
    private _loopReached = false;

    public readonly animationEventHandler = new EventEmitterDelegate<FRAME_ANIMATION_EVENTS,void>(this.game);

    public constructor(protected game:Game,params:tFrameAnimationDuration & IFrameAnimationParams<T>) {
        this._frames = params.frames;

        if ((params as IDuration).duration!==undefined) this._duration = (params as IDuration).duration;
        else if ((params as IDurationOfOneFrame).durationOfOneFrame) this.setDurationOfOneFrame((params as IDurationOfOneFrame).durationOfOneFrame);

        this._isRepeating = params.isRepeating ?? this._isRepeating;
    }

    public abstract clone():this;

    public revalidate():void {
        if (DEBUG && !this._frames.length) throw new DebugError(`animation frames can not be empty`);
        this.onNextFrame(this._currFrame);
    }

    public play():this {
        if (DEBUG) {
            if (!this._target) throw new DebugError(`can not play frame animation: it is not attached to a parent`);
        }
        const curr = this._target.getCurrentFrameAnimation();
        if (curr && curr!==this) {
            if (curr.isPlaying()) {
                curr.animationEventHandler.trigger(FRAME_ANIMATION_EVENTS.canceled);
            }
        }
        this._target._currFrameAnimation = this;
        this._isPlaying = true;
        return this;
    }

    public gotoAndPlay(frame:number):void {
        frame = frame % this._frames.length;
        this._currFrame = frame;
        this.play();
    }

    public gotoAndStop(frame:number):void {
        frame = frame % this._frames.length;
        this._currFrame = frame;
        this.onNextFrame(frame);
        this.animationEventHandler.trigger(FRAME_ANIMATION_EVENTS.completed);
        this.stop();
    }

    public setDuration(duration:number):void {
        this._duration = duration;
    }

    public setRepeating(repeating:boolean):void {
        this._isRepeating = repeating;
    }

    public setDurationOfOneFrame(durationOfOneFrame:number):void {
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

    public isPlaying():boolean {
        return this._isPlaying;
    }

    public update():void {
        if (!this._isPlaying) return;
        const time = this.game.getCurrentTime();
        if (this._startTime===0) this._startTime = time;
        const delta = (time - this._startTime) % this._duration;
        let currFrame = ~~((this._frames.length) * delta / this._duration);
        currFrame = currFrame % this._frames.length;

        if (currFrame===0 && this._loopReached) {
            if (!this._isRepeating) {
                this.stop();
                this.animationEventHandler.trigger(FRAME_ANIMATION_EVENTS.completed);
                return;
            } else {
                this.animationEventHandler.trigger(FRAME_ANIMATION_EVENTS.loop);
            }
        }
        this._currFrame = currFrame;
        this.onNextFrame(currFrame);
        if (this._currFrame===this._frames.length-1) {
            this._loopReached = true;
        }
    }

    protected abstract onNextFrame(i:number):void;

    protected setClonedProperties(cloned:AbstractFrameAnimation<unknown>):void {
        cloned._target = undefined!;
    }

}

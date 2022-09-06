import {ICloneable} from "@engine/core/declarations";
import {Game} from "@engine/core/game";
import {EventEmitterDelegate} from "@engine/delegates/eventDelegates/eventEmitterDelegate";
import {DebugError} from "@engine/debug/debugError";
import {AnimatedImage} from "@engine/renderable/impl/general/image/animatedImage";
import {ITargetAnimation} from "@engine/animation/iAnimation";

export const enum FRAME_ANIMATION_EVENTS {
    completed =  'completed',
    canceled  =  'canceled',
    loop      =  'loop',
}

interface IDuration {
    duration: number;
}

interface IDurationOfOneFrame {
    durationOfOneFrame: number;
}

export type tFrameAnimationDuration = IDuration | IDurationOfOneFrame;

export interface IFrameAnimationBaseParams {
    name: string;
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

    private _currFrame:number = 0;
    private _startTime:number = 0;
    private _timeForOneFrame:number;
    private _isPlaying:boolean = false;
    private _loopReached:boolean = false;


    public readonly animationEventHandler:EventEmitterDelegate<FRAME_ANIMATION_EVENTS,void> = new EventEmitterDelegate(this.game);

    public constructor(protected game:Game,params:tFrameAnimationDuration & IFrameAnimationParams<T>) {
        this._name = params.name;
        this._frames = params.frames;

        if ((params as IDuration).duration!==undefined) this._duration = (params as IDuration).duration;
        else if ((params as IDurationOfOneFrame).durationOfOneFrame) this.setDurationOfOneFrame((params as IDurationOfOneFrame).durationOfOneFrame);

        this._isRepeating = params.isRepeating ?? this._isRepeating;
    }

    public abstract clone():this;

    public revalidate():void {
        if (DEBUG && !this._frames.length) throw new DebugError(`animation frames can not be empty`);
        this._timeForOneFrame = ~~(this._duration / this._frames.length);
        this.onNextFrame(this._currFrame);
    }

    public play():this {
        if (DEBUG) {
            if (!this._target) throw new DebugError(`can not play frame animation: it is not attached to parent`);
        }
        if (this._target.getCurrentFrameAnimation()!==this) {
            if (this._target.getCurrentFrameAnimation()?.isPlaying()) {
                this._target.getCurrentFrameAnimation()!.animationEventHandler.trigger(FRAME_ANIMATION_EVENTS.canceled);
            }
            this._target.playFrameAnimation(this);
        }
        this._isPlaying = true;
        return this;
    }

    public gotoAndPlay(frame:number):void {
        this._currFrame = frame;
        this.play();
    }

    public gotoAndStop(frame:number):void {
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
        const time:number = this.game.getCurrentTime();
        const firstFrame = this._startTime===0;
        if (firstFrame) this._startTime = time;
        const delta:number = (time - this._startTime) % this._duration;
        let currFrame:number = ~~((this._frames.length) * delta / this._duration);
        currFrame = currFrame % this._frames.length;
        if (currFrame===this._currFrame && !firstFrame) return; // "firstFrame" flag fixed bug with animation of one frame, witch mill not start otherwise
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

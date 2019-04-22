
import {Eventemittable} from "@engine/declarations";
import {Game} from "@engine/game";
import {EventEmitterDelegate} from "@engine/delegates/eventEmitterDelegate";

export const FRAME_ANIMATION_EVENTS = {
    completed:  'completed',
    loop:       'loop'
};

export abstract class AbstractFrameAnimation<T> implements Eventemittable {

    name:string;
    duration:number = 1000;
    isRepeat:boolean = true;
    frames:T[] = [];

    private _currFrame:number = 0;
    private _startTime:number = 0;
    private _timeForOneFrame:number;
    private _isPlaying:boolean = false;

    constructor(protected game:Game) {}

    protected abstract onNextFrame(i:number):void;

    revalidate():void {
        this._timeForOneFrame = ~~(this.duration / this.frames.length);
        this.onNextFrame(0);
    }

    play():void {
        this._isPlaying = true;
    }

    stop():void {
        this._isPlaying = false;
        this._startTime = 0;
    }

    update():void {
        if (!this._isPlaying) return;
        const time:number = this.game.getTime();
        if (!this._startTime) this._startTime = time;
        const delta:number = (time - this._startTime) % this.duration;
        let currFrame:number = ~~((this.frames.length) * delta / this.duration);
        currFrame = currFrame % this.frames.length;
        if (currFrame==this._currFrame) return;
        this._currFrame = currFrame;
        this.onNextFrame(currFrame);
        //console.log(this.name,this._currFrame,this.game.getTime()/1000);
        if (this._currFrame>=this.frames.length-1) {
            if (this.isRepeat==false) {
                this.stop();
                this.trigger(FRAME_ANIMATION_EVENTS.completed);
                return;
            } else {
                this.trigger(FRAME_ANIMATION_EVENTS.loop);
            }

        }
    }

    protected setClonedProperties(cloned:AbstractFrameAnimation<any>):void {
        cloned.frames = [...this.frames];
        cloned.duration = this.duration;
        cloned.isRepeat = this.isRepeat;
    }


    //eventEmitter
    private _eventEmitterDelegate:EventEmitterDelegate = new EventEmitterDelegate();

    off(eventName: string, callBack: Function): void {
        this._eventEmitterDelegate.off(eventName,callBack);
    }
    on(eventName: string, callBack: Function): Function {
        return this._eventEmitterDelegate.on(eventName,callBack);
    }
    trigger(eventName: string, data?: any): void {
        this._eventEmitterDelegate.trigger(eventName,data);
    }

}
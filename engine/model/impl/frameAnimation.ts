
import {Game} from '../../core/game'
import {GameObject} from './gameObject'
import {EventEmitter} from "../../core/misc/eventEmitter";

export class FrameAnimation  {

    type:string = 'FrameAnimation';
    name:string;
    _currFrame:number = 0;
    frames = [];
    duration:number = 1000;
    _gameObject:GameObject = null;

    private _startTime:number = null;
    private _timeForOneFrame:number;
    private _isRepeat:boolean;

    constructor(public game:Game) {
        this._emitter = new EventEmitter();
        this.stop();
    }

    revalidate(){
        this._timeForOneFrame = ~~(this.duration / this.frames.length);
    }

    play(opts = {repeat:true}) {
        this._isRepeat = opts.repeat;
        this._gameObject.playFrameAnimation(this,opts);
    }

    stop() {
        if (this._gameObject) this._gameObject.stopFrAnimations();
        this._startTime = null;
        this._isRepeat = true;
    }

    update(time) {
        if (!this._startTime) this._startTime = time;
        let delta = (time - this._startTime) % this.duration;
        this._currFrame = ~~((this.frames.length) * delta / this.duration);
        if (this._isRepeat==false && this._currFrame>=this.frames.length-1) {
            this.trigger('loop');
            this.stop();
            return;
        }
        let lastFrIndex = this._gameObject.currFrameIndex;
        if (lastFrIndex != this.frames[this._currFrame]) {
            this._gameObject.setFrameIndex(this.frames[this._currFrame]);
            if (this._currFrame===0 && this._startTime!==time) this.trigger('loop');
        }
    }

    nextFrame() {
        let ind = this._currFrame;
        ind++;
        if (ind == this.frames.length) ind = 0;
        this._gameObject.setFrameIndex(this.frames[ind]);
        this._currFrame = ind;
    }

    previousFrame() {
        let ind = this._currFrame;
        ind--;
        if (ind < 0) ind = this.frames.length - 1;
        this._gameObject.setFrameIndex(this.frames[ind]);
        this._currFrame = ind;
    }

    // todo extract to class?
    _emitter:EventEmitter;

    on(eventName:string,callBack:Function){
        this._emitter.on(eventName,callBack);
        return callBack;
    }
    off(eventName:string,callBack:Function){
        this._emitter.off(eventName,callBack);
    }
    trigger(eventName:string,data?:any){
        this._emitter.trigger(eventName,data);
    }

}


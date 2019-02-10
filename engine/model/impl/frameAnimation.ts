
import {Game} from '../../core/game'
import {GameObject} from './gameObject'
import {EventEmitter} from "../../core/misc/eventEmitter";

export class FrameAnimation  {

    readonly type:string = 'FrameAnimation';
    name:string;
    frames:number[] = [];
    duration:number = 1000;
    isRepeat:boolean = true;

    private _currFrame:number = 0;
    private _gameObject:GameObject;
    private _startTime:number;
    private _timeForOneFrame:number;

    constructor(public game:Game) {
        this._emitter = new EventEmitter();
    }

    revalidate(){
        this._timeForOneFrame = ~~(this.duration / this.frames.length);
    }

    getGameObject():GameObject{
        return this._gameObject;
    }

    setGameObject(g:GameObject){
        this._gameObject = g;
    }

    update(time:number) {
        if (!this._startTime) this._startTime = time;
        let delta = (time - this._startTime) % this.duration;
        this._currFrame = ~~((this.frames.length) * delta / this.duration);
        if (this.isRepeat==false && this._currFrame>=this.frames.length-1) {
            this.trigger('loop');
            this._gameObject.stopFrAnimation();
            return;
        }
        let lastFrIndex = this._gameObject.spriteSheet.getFrameIndex();
        if (lastFrIndex != this.frames[this._currFrame]) {
            let index:number = this.frames[this._currFrame];
            index = index % this._gameObject.spriteSheet.getNumOfFrames();
            this._gameObject.spriteSheet.setFrameIndex(index);
            if (this._currFrame===0 && this._startTime!==time) this.trigger('loop');
        }
    }

    reset(){
        this._startTime = 0;
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


import {Game} from "../../game";
import {Cloneable, Eventemittable} from "@engine/declarations";
import {DebugError} from "@engine/debug/debugError";
import {SpriteSheet} from "@engine/model/impl/spriteSheet";
import {EventEmitterDelegate} from "@engine/delegates/eventEmitterDelegate";

export class FrameAnimation implements Eventemittable, Cloneable<FrameAnimation>{

    readonly type:string = 'FrameAnimation';
    name:string;
    frames:number[] = [];
    duration:number = 1000;
    isRepeat:boolean = true;

    private _currFrame:number = 0;
    private _startTime:number = 0;
    private _timeForOneFrame:number;
    private _isPlaying:boolean = false;
    private _spriteSheet:SpriteSheet;

    constructor(protected game:Game) {}

    revalidate():void {
        this._timeForOneFrame = ~~(this.duration / this.frames.length);
    }

    setSpriteSheet(spr: SpriteSheet):void {
        this._spriteSheet = spr;
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
        this._currFrame = ~~((this.frames.length) * delta / this.duration);
        if (this.isRepeat==false && this._currFrame>=this.frames.length-1) {
            this.trigger('loop');
            this._isPlaying = false;
            return;
        }
        if (DEBUG) {
            if (!this._spriteSheet) throw new DebugError(`can not play frame animation: spriteSheet is not set`);
        }
        let lastFrIndex:number = this._spriteSheet.getFrameIndex();
        if (lastFrIndex != this.frames[this._currFrame]) {
            let index:number = this.frames[this._currFrame];
            index = index % this._spriteSheet.getNumOfFrames();
            this._spriteSheet.setFrameIndex(index);
            if (this._currFrame===0 && this._startTime!==time) this.trigger('loop');
        }
    }

    protected setClonedProperties(cloned:FrameAnimation):void {
        cloned.frames = [...this.frames];
        cloned.duration = this.duration;
        cloned.isRepeat = this.isRepeat;
        cloned.setSpriteSheet(this._spriteSheet);
    }

    clone():FrameAnimation {
        const cloned:FrameAnimation = new FrameAnimation(this.game);
        this.setClonedProperties(cloned);
        return cloned;
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


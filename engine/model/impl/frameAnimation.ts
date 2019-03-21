import {Game} from '../../core/game'
import {GameObject} from './gameObject'
import {EventEmitter} from "../../core/misc/eventEmitter";
import {Cloneable, IMPORT_DEPENDS} from "@engine/declarations";
import {MOUSE_EVENTS} from "@engine/core/control/mouse/mouseEvents";
import {DebugError} from "@engine/debugError";
import {SpriteSheet} from "@engine/model/impl/spriteSheet";

export class FrameAnimation implements Cloneable<FrameAnimation>{

    readonly type:string = 'FrameAnimation';
    name:string;
    frames:number[] = [];
    duration:number = 1000;
    isRepeat:boolean = true;

    private _currFrame:number = 0;
    private _startTime:number;
    private _timeForOneFrame:number;
    private _isPlaying:boolean = false;
    private _spriteSheet:SpriteSheet;

    constructor(protected game:Game) {}

    revalidate(){
        this._timeForOneFrame = ~~(this.duration / this.frames.length);
    }

    setSpriteSheet(spr: SpriteSheet) {
        this._spriteSheet = spr;
    }

    play(){
        this._isPlaying = true;
    }

    stop(){
        this._isPlaying = false;
    }

    update() {
        if (!this._isPlaying) return;
        const time:number = this.game.getTime();
        if (!this._startTime) this._startTime = time;
        let delta = (time - this._startTime) % this.duration;
        this._currFrame = ~~((this.frames.length) * delta / this.duration);
        if (this.isRepeat==false && this._currFrame>=this.frames.length-1) {
            this.trigger('loop');
            this._isPlaying = false;
            return;
        }
        if (DEBUG) {
            if (!this._spriteSheet) throw new DebugError(`can not play frame animation: spriteSheet is not set`);
        }
        let lastFrIndex = this._spriteSheet.getFrameIndex();
        if (lastFrIndex != this.frames[this._currFrame]) {
            let index:number = this.frames[this._currFrame];
            index = index % this._spriteSheet.getNumOfFrames();
            this._spriteSheet.setFrameIndex(index);
            if (this._currFrame===0 && this._startTime!==time) this.trigger('loop');
        }
    }

    protected setClonedProperties(cloned:FrameAnimation) {
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

    //#MACROS_BODY_BEGIN = ./engine/macroses/eventEmitterMacros
    off(eventName: string, callBack: Function): void {}
    on(eventName: string, callBack: Function): void {
        IMPORT_DEPENDS(EventEmitter,MOUSE_EVENTS,DebugError)
    }
    trigger(eventName: string, data?: any): void {}
    //#MACROS_BODY_END

}


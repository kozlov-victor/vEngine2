
import {Game} from "@engine/core/game";
import {Optional} from "@engine/core/declarations";
import {EaseFn} from "@engine/misc/easing/type";
import {EasingLinear} from "@engine/misc/easing/functions/linear";
import {DebugError} from "@engine/debug/debugError";

// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type FilterFlags<Base, Condition> = {
    [Key in keyof Base]:
    Base[Key] extends Condition ? Key : never
};
type AllowedNames<Base, Condition> =
    FilterFlags<Base, Condition>[keyof Base];
type SubType<Base, Condition> =
    Pick<Base, AllowedNames<Base, Condition>>;
//



interface IKeyVal {
    [key:string]:any;
}


export interface ITweenDescription<T> {
    target:T;
    start?:(arg:T)=>void;
    progress?:(arg:T)=>void;
    complete?:(arg:T)=>void;
    ease?:EaseFn;
    time:number;
    delayBeforeStart?:number;
    from?:Partial<SubType<T,number>>;
    to?:Partial<SubType<T,number>>;
    loop?:boolean;
    numOfLoops?:number;
    yoyo?:boolean;
}

interface ITweenDescriptionNormalized<T> {
    target:T;
    progress?:(arg:T)=>void;
    complete?:(arg:T)=>void;
    ease?:EaseFn;
    time:number;
    delayBeforeStart?:number;
    from:Partial<Record<keyof T,number>>;
    to:Partial<Record<keyof T,number>>;
}

export class Tween<T> {

    private _propsToChange:(keyof T)[] = [];
    private _startedTime:number = 0;
    private _delayWaitTime:number = 0;
    private _currTime:number = 0;
    private _completed:boolean = false;
    private readonly _target: T;
    private readonly _progressFn:Optional<((arg:T)=>void)>;
    private readonly _delayBeforeStart:number = 0;
    private readonly _completeFn:Optional<((arg:T)=>void)>;
    private readonly _startedFn:Optional<((arg:T)=>void)>;
    private readonly _easeFn:EaseFn;
    private readonly _tweenTime: number;
    private readonly _loop: boolean;
    private _currentLoop:number = 0;
    private readonly _numOfLoops:number;
    private readonly _yoyo:boolean;
    private _started: boolean = false;
    private _desc:ITweenDescriptionNormalized<T>;

    /*
     new Tween(game,{
        from :{y:5}, //<--error, only numeric properties of target can be tweenable
        target: {x:2,y:'3'},
        time: 1
    });

     new Tween(game,{
        from :{a:5}, //<--error, property 'a' does not belong to target
        target: {x:2,y:'3'},
        time: 1
     });

     new Tween(game,{
        from :{x:5,y:2}, //<--error, target property 'y' is not numeric
        target: {x:2,y:'3'},
        time: 1
     });

     new Tween(game,{
        from :{x:5}, //<--ok
        target: {x:2,y:'3'},
        time: 1
     });
     *
     *
     */
    constructor(private game:Game,tweenDesc:ITweenDescription<T>){
        this._target = tweenDesc.target;
        this._progressFn = tweenDesc.progress;
        this._completeFn = tweenDesc.complete;
        this._startedFn = tweenDesc.start;
        this._easeFn = tweenDesc.ease || EasingLinear;
        this._delayBeforeStart = tweenDesc.delayBeforeStart || 0;
        this._tweenTime = (tweenDesc.time || 1000);
        if (DEBUG && tweenDesc.loop===undefined && tweenDesc.numOfLoops!==undefined) {
            throw new DebugError(`loop property need to be set to true if numOfLoops is specified`);
        }
        if (DEBUG && tweenDesc.loop===undefined && tweenDesc.yoyo!==undefined) {
            throw new DebugError(`loop property need to be set to true if yoyo is true`);
        }
        this._loop = tweenDesc.loop || false;
        this._numOfLoops = tweenDesc.numOfLoops ?? Infinity;
        this._yoyo = tweenDesc.yoyo || false;
        this._desc = this.normalizeDesc(tweenDesc);
    }

    public update():void {
        if (this._completed) return;
        const currTime:number = this.game.getCurrentTime();

        if (this._currentLoop===0 && this._delayBeforeStart>0) {
            this._delayWaitTime = this._delayWaitTime || currTime;
            if (currTime - this._delayWaitTime<this._delayBeforeStart) return;
        }

        this._currTime = currTime;
        if (this._startedTime===0) this._startedTime = currTime;
        let curTweenTime:number = currTime - this._startedTime;

        if (curTweenTime>this._tweenTime) {
            if (this._loop) {
                this._startedTime = currTime;
                if (this._currentLoop===this._numOfLoops-1) {
                    this.complete();
                    return;
                }
                this._currentLoop++;
                curTweenTime = 0;
            } else {
                this.complete();
                return;
            }
        }

        if (this._yoyo && this._currentLoop%2!==0) { // if yoyo and current loop is odd
            curTweenTime = this._tweenTime - curTweenTime; // invert current tween time to achieve yoyo-effect
        }

        let l:number = this._propsToChange.length;
        if (this._startedFn && !this._started) this._startedFn(this._target);
        while(l--) {
            const prp = this._propsToChange[l];
            const valFrom = this._desc.from[prp] as number;
            const valTo = this._desc.to[prp] as number;
            const fn:EaseFn = this._easeFn;
            this._target[prp] = fn(
                curTweenTime,
                valFrom,
                valTo - valFrom,
                this._tweenTime) as T[keyof T];
        }
        if (this._progressFn) this._progressFn(this._target);
        this._started = true;
    }

    public reset():void {
        this._startedTime = 0;
        this._completed = false;
    }

    public complete():void {
        if (this._completed) return;
        const needReversion:boolean = this._yoyo && this._currentLoop%2!==0;
        const target:Partial<Record<keyof T,number>> = needReversion?this._desc.from:this._desc.to;
        for (const k of this._propsToChange) {
            this._target[k] = target[k] as T[keyof T];
        }
        if (this._progressFn) this._progressFn(this._target);
        if (this._completeFn) this._completeFn(this._target);
        this._completed = true;
    }

    public stop():void {
        this._completed = true;
    }

    public isCompleted():boolean{
        return this._completed;
    }

    public getTarget():any{
        return this._target;
    }

    public getTweenTime():number{
        return this._tweenTime;
    }

    private normalizeDesc(tweenDesc:ITweenDescription<T>):ITweenDescriptionNormalized<T>{

        const normalized:ITweenDescriptionNormalized<T> = tweenDesc as unknown as ITweenDescriptionNormalized<T> ;

        normalized.from = normalized.from! || {};
        normalized.to = normalized.to! || {};
        const allPropsMap:IKeyVal = {};
        Object.keys(normalized.from!).forEach((keyFrom)=>{
            allPropsMap[keyFrom] = true;
        });
        Object.keys(normalized.to!).forEach((keyTo)=>{
            allPropsMap[keyTo] = true;
        });
        this._propsToChange = Object.keys(allPropsMap) as (keyof T)[];

        if (DEBUG) {
            this._propsToChange.forEach(key => {
                if (!this._target[key]) {
                    console.error('target',this._target);
                    throw new DebugError(`Can not create tween animation: property "${String(key)}" does not belong to target object or is undefined`);
                }
            });
        }

        this._propsToChange.forEach((prp:keyof T)=>{
            if (normalized.from![prp]===undefined) normalized.from![prp] = this._target[prp] as unknown as number;
            if (normalized.to![prp]===undefined) normalized.to![prp] = this._target[prp] as unknown as number;
        });
        return normalized as ITweenDescriptionNormalized<T>;
    }

}

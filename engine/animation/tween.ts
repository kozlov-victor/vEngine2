import {Easing} from "@engine/misc/easing/linear";

type EaseFn = (t:number,b:number,c:number,d:number)=>number;

import {Game} from "@engine/game";

interface IKeyVal {
    [key:string]:any;
}

interface IValByPathObj {
    targetObj: any;
    targetKey:string;
}

const _accessByPath = (obj:IKeyVal,path:string):IValByPathObj=>{
    const pathArr:string[] = path.split('.');
    if (pathArr.length===1) return {targetObj:obj,targetKey:path};
    const lastPath:string = pathArr.pop() as string;
    pathArr.forEach((p)=>{
        obj = obj[p];
    });
    return {targetObj:obj,targetKey:lastPath};
};

const setValByPath = (obj:IKeyVal,path:string,val:number)=>{
    const {targetObj,targetKey}:IValByPathObj = _accessByPath(obj,path);
    targetObj[targetKey] = val;
};

const getValByPath = (obj:IKeyVal,path:string):number=>{
    const {targetObj,targetKey}:IValByPathObj = _accessByPath(obj,path);
    return targetObj[targetKey];
};

export interface ITweenDescription {
    target:any;
    progress?:(arg?:any)=>void;
    complete?:(arg?:any)=>void;
    ease?:EaseFn;
    time:number;
    delayBeforeStart?:number;
    from?:{[key:string]:number};
    to?:{[key:string]:number};
    loop?:boolean;
}

export interface ITweenDescriptionNormalized extends ITweenDescription{
    ease:EaseFn;
    from:IKeyVal;
    to:IKeyVal;
}

export class Tween {

    private _propsToChange:string[] = [];
    private _startedTime:number = 0;
    private _currTime:number = 0;
    private _completed:boolean = false;
    private readonly _target: any;
    private readonly _loop: boolean;
    private _progressFn:(arg?:any)=>void;
    private _delayBeforeStart:number = 0;
    private readonly _completeFn: (arg?:any)=>void;
    private readonly _easeFn:EaseFn;
    private readonly _tweenTime: number;
    private _desc:ITweenDescriptionNormalized;

    /**
     * @param tweenDesc
     * target: obj,
     * from: object with props,
     * to: object with props,
     * progress: fn,
     * complete: fn,
     * ease: str ease fn name,
     * time: addTween time
     */
    constructor(tweenDesc:ITweenDescription){
        this._target = tweenDesc.target;
        this._progressFn = tweenDesc.progress;
        this._completeFn = tweenDesc.complete;
        this._easeFn = tweenDesc.ease || Easing.linear  as EaseFn;
        this._delayBeforeStart = tweenDesc.delayBeforeStart || 0;
        this._tweenTime = (tweenDesc.time || 1000) + this._delayBeforeStart;
        this._loop = tweenDesc.loop||false;
        this._desc = this.normalizeDesc(tweenDesc);
    }

    public reuse(newTweenDesc:ITweenDescription):void{
        this._startedTime = this._currTime;
        this._completed = false;

        Object.keys(newTweenDesc).forEach((key)=>{
            (this._desc as any)[key] = (newTweenDesc as any)[key];
        });
        this._desc = this.normalizeDesc(newTweenDesc);
    }

    public normalizeDesc(tweenDesc:ITweenDescription):ITweenDescriptionNormalized{
        tweenDesc.from = tweenDesc.from || {};
        tweenDesc.to = tweenDesc.to || {};
        const allPropsMap:IKeyVal = {};
        Object.keys(tweenDesc.from).forEach((keyFrom)=>{
            allPropsMap[keyFrom] = true;
        });
        Object.keys(tweenDesc.to).forEach((keyTo)=>{
            allPropsMap[keyTo] = true;
        });
        this._propsToChange = Object.keys(allPropsMap);
        this._propsToChange.forEach((prp:string)=>{
            if (tweenDesc.from[prp]===undefined) tweenDesc.from[prp] = getValByPath(this._target,prp);
            if (tweenDesc.to[prp]===undefined) tweenDesc.to[prp] = getValByPath(this._target,prp);
        });
        return tweenDesc as ITweenDescriptionNormalized;
    }


    public update():void {
        if (this._completed) return;
        const currTime:number = Game.getInstance().getTime();
        this._currTime = currTime;
        if (!this._startedTime) this._startedTime = currTime;
        let curTweenTime:number = currTime - this._startedTime;
        if (curTweenTime<0) curTweenTime = currTime; // after long delay of looped addTween


        if (curTweenTime<this._delayBeforeStart) return;

        if (curTweenTime>this._tweenTime) {
            if (this._loop) {
                this._startedTime = currTime + (curTweenTime - this._tweenTime);
            } else {
                this.complete();
                return;
            }
        }
        let l:number = this._propsToChange.length;
        while(l--){
            const prp:string = this._propsToChange[l];
            const valFrom:number = this._desc.from[prp] as number;
            const valTo:number = this._desc.to[prp] as number;
            const fn:EaseFn = this._easeFn;
            const valCurr:number = fn(
                curTweenTime,
                valFrom,
                valTo - valFrom,
                this._tweenTime) as number;
            setValByPath(this._target,prp,valCurr);
        }
        if (this._progressFn) this._progressFn(this._target);

    }

    public reset():void {
        this._startedTime = null;
        this._completed = false;
    }

    public complete():void {
        if (this._completed) return;
        let l:number = this._propsToChange.length;
        while(l--){
            const prp:string = this._propsToChange[l];
            const valCurr:number = this._desc.to[prp];
            setValByPath(this._target,prp,valCurr);
        }
        if (this._progressFn) this._progressFn(this._target);
        if (this._completeFn) this._completeFn(this._target);
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

    private progress(_progressFn:(val:number)=>void):void {
        this._progressFn = _progressFn;
    }

}

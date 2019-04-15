import {EaseFn, Easing} from "./easing";
import {Game} from "@engine/game";

interface KeyVal {
    [key:string]:any
}

interface ValByPathObj {
    targetObj: any,
    targetKey:string
}

const _accessByPath = (obj:KeyVal,path:string):ValByPathObj=>{
    let pathArr:string[] = path.split('.');
    if (pathArr.length===1) return {targetObj:obj,targetKey:path};
    let lastPath:string = pathArr.pop() as string;
    pathArr.forEach(p=>{
        obj = obj[p];
    });
    return {targetObj:obj,targetKey:lastPath};
};

const setValByPath = (obj:KeyVal,path:string,val:number)=>{
    let {targetObj,targetKey}:ValByPathObj = _accessByPath(obj,path);
    targetObj[targetKey] = val;
};

const getValByPath = (obj:KeyVal,path:string):number=>{
    let {targetObj,targetKey}:ValByPathObj = _accessByPath(obj,path);
    return targetObj[targetKey];
};

export interface TweenDescription {
    target:any,
    progress?:Function,
    complete?:Function,
    ease?:EaseFn,
    time:number,
    delayBeforeStart?:number,
    from?:{[key:string]:number},
    to?:{[key:string]:number}
}

export interface TweenDescriptionNormalized extends TweenDescription{
    ease:EaseFn,
    from:KeyVal,
    to:KeyVal
}

export class Tween {

    private _propsToChange:any[] = [];
    private _startedTime:number = 0;
    private _currTime:number = 0;
    private _completed:boolean = false;
    private readonly _target: any;
    private _progressFn:Function|undefined;
    private _delayBeforeStart:number = 0;
    private readonly _completeFn: Function|undefined;
    private readonly _easeFn:EaseFn;
    private readonly _tweenTime: number;
    private _desc:TweenDescriptionNormalized;

    /**
     * @param tweenDesc
     * target: obj,
     * from: object with props,
     * to: object with props,
     * progress: fn,
     * complete: fn,
     * ease: str ease fn name,
     * time: tween time
     */
    constructor(tweenDesc:TweenDescription){
        this._target = tweenDesc.target;
        this._progressFn = tweenDesc.progress;
        this._completeFn = tweenDesc.complete;
        this._easeFn = tweenDesc.ease || Easing.linear  as EaseFn; // todo namespaces for easing?
        this._delayBeforeStart = tweenDesc.delayBeforeStart || 0;
        this._tweenTime = (tweenDesc.time || 1000) + this._delayBeforeStart;
        this._desc = this.normalizeDesc(tweenDesc);
    }

    reuse(newTweenDesc:TweenDescription):void{
        this._startedTime = this._currTime;
        this._completed = false;

        Object.keys(newTweenDesc).forEach(key=>{
            (this._desc as any)[key] = (newTweenDesc as any)[key];
        });
        this._desc = this.normalizeDesc(newTweenDesc);
    }

    normalizeDesc(tweenDesc:TweenDescription):TweenDescriptionNormalized{
        tweenDesc.from = tweenDesc.from || {};
        tweenDesc.to = tweenDesc.to || {};
        let allPropsMap:KeyVal = {};
        Object.keys(tweenDesc.from).forEach(keyFrom=>{
            allPropsMap[keyFrom] = true;
        });
        Object.keys(tweenDesc.to).forEach(keyTo=>{
            allPropsMap[keyTo] = true;
        });
        this._propsToChange = Object.keys(allPropsMap);
        this._propsToChange.forEach((prp:string)=>{
            if (tweenDesc.from[prp]===undefined) tweenDesc.from[prp] = getValByPath(this._target,prp);
            if (tweenDesc.to[prp]===undefined) tweenDesc.to[prp] = getValByPath(this._target,prp);
        });
        return tweenDesc as TweenDescriptionNormalized;
    }


    update():void {
        if (this._completed) return;
        const currTime:number = Game.getInstance().getTime();
        this._currTime = currTime;
        if (!this._startedTime) this._startedTime = currTime;
        const curTweenTime:number = currTime - this._startedTime;

        if (curTweenTime<this._delayBeforeStart) return;

        if (curTweenTime>this._tweenTime) {
            this.complete();
            return;
        }
        let l:number = this._propsToChange.length;
        while(l--){
            let prp:string = this._propsToChange[l];
            let valFrom:number = this._desc.from[prp] as number;
            let valTo:number = this._desc.to[prp] as number;
            let fn:EaseFn = this._easeFn;
            let valCurr:number = <number>fn(
                curTweenTime,
                valFrom,
                valTo - valFrom,
                this._tweenTime);
            setValByPath(this._target,prp,valCurr);
        }
        this._progressFn && this._progressFn(this._target);

    }

    private progress(_progressFn:(val:number)=>void):void {
        this._progressFn = _progressFn;
    }

    reset():void {
        this._startedTime = null;
        this._completed = false;
    }

    complete():void {
        if (this._completed) return;
        let l = this._propsToChange.length;
        while(l--){
            let prp = this._propsToChange[l];
            let valCurr = this._desc.to[prp];
            setValByPath(this._target,prp,valCurr);
        }
        this._progressFn && this._progressFn(this._target);
        this._completeFn && this._completeFn(this._target);
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

}

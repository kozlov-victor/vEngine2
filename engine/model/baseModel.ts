import {Timer} from "../core/timer";
import {CommonObject} from './commonObject'
import {Tween, TweenDescription} from '../core/tween'
import {EventEmitter} from '../core/misc/eventEmitter'
import {Rect} from "../core/geometry/rect";
import {Point2d} from "../core/geometry/point2d";
import {Game} from "../core/game";
import {AbstractFilter} from "../core/renderer/webGl/filters/abstract/abstractFilter";
import {DebugError} from "../debugError";
import {TweenMovie} from "../core/tweenMovie";



export abstract class BaseModel extends CommonObject {

    name:string;
    id:string;
    width:number = 0;
    height:number = 0;
    game:Game;
    type:string;

    _tweens:Tween[] = [];
    _tweenMovies:TweenMovie[] = [];
    _dirty = true;
    _timers:Timer[] = [];

    protected _rect:Rect = new Rect(0,0);

    constructor(game:Game){
        super();
        if (DEBUG && !game) throw new DebugError(
            `can not create model '${this.type}': game instance not passed to model constructor`
        );
        this.game = game;
        this._emitter = new EventEmitter();
    }

    setIndividualBehaviour(instance){}

    setCommonBehaviour(){}

    setTimer(callback:Function,interval:number):Timer{
        let t:Timer = new Timer(callback,interval);
        this._timers.push(t);
        return t;
    }

    /**
     * {target:obj,from:a,to:b,progress:fn,complete:fn,ease:str,time:t}}
     * @param desc
     */
    tween(desc:TweenDescription):Tween{
        let t:Tween = new Tween(desc);
        this._tweens.push(t);
        return t;
    }

    tweenMovie():TweenMovie{
        let tm:TweenMovie = new TweenMovie(this.game);
        this._tweenMovies.push(tm);
        return tm;
    }

    update(currTime:number,delta:number){
        this._tweens.forEach((t:Tween, index:number)=>{
            t.update(currTime);
            if (t.isCompleted()) this._tweens.splice(index,1);
        });
        this._tweenMovies.forEach((t:TweenMovie,index:number)=>{
            t.update(currTime);
            if (t.isCompleted()) this._tweenMovies.splice(index,1);
        });
        this._timers.forEach((t:Timer)=>{
            t.onUpdate(currTime);
        });
    }

    _emitter:EventEmitter;

    on(eventName:string|string[],callBack:Function){
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

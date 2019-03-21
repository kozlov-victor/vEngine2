import {Tween, TweenDescription} from "@engine/core/tween";
import {TweenMovie} from "@engine/core/tweenMovie";
import {MOUSE_EVENTS} from "@engine/core/control/mouse/mouseEvents";
import {DebugError} from "@engine/debugError";
import {EventEmitter} from "@engine/core/misc/eventEmitter";

export const IMPORT_DEPENDS = (...args)=>{

};

export interface MouseEventEx extends MouseEvent {
    id:number,
    wheelDelta: number,
    touches: any[]
}

export interface Cloneable<T> {
    clone:()=>T
}

export interface Revalidatable {
    revalidate:()=>void
}

export interface Tweenable {
    tween(desc:TweenDescription):Tween;
    addTween(t:Tween):void;
    addTweenMovie(tm:TweenMovie);
}

export interface Eventemittable {
    on(eventName:string,callBack:Function):void;
    off(eventName:string,callBack:Function):void,
    trigger(eventName:string,data?:any):void
}


import {Tween, TweenDescription} from "@engine/misc/tween";
import {TweenMovie} from "@engine/misc/tweenMovie";

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
    addTweenMovie(tm:TweenMovie):void;
}

export interface Eventemittable {
    on(eventName:string,callBack:Function):Function;
    off(eventName:string,callBack:Function):void,
    trigger(eventName:string,data?:any):void
}

type Brand<K,T> = K & {__brand: T};

export type Int = Brand<number,'Int'>;


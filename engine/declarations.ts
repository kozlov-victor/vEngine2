import {ITweenDescription, Tween} from "@engine/misc/tween";
import {TweenMovie} from "@engine/misc/tweenMovie";
import {ResourceLink} from "@engine/resources/resourceLink";
import {AbstractFilter} from "@engine/renderer/webGl/filters/abstract/abstractFilter";
import {Game} from "@engine/game";

export type Clazz<T> = new() => T;
export type ClazzEx<T> = new(game:Game) => T;

export interface IMouseEventEx extends MouseEvent {
    id:number;
    wheelDelta: number;
    touches: any[];
}

export interface ICloneable<T> {
    clone():T;
}

export interface IRevalidatable {
    revalidate():void;
}

export interface ITweenable {
    tween(desc:ITweenDescription):Tween;
    addTween(t:Tween):void;
    addTweenMovie(tm:TweenMovie):void;
}

export interface IEventemittable {
    on(eventName:string,callBack:(arg?:any)=>void):()=>void;
    off(eventName:string,callBack:()=>void):void;
    trigger(eventName:string,data?:any):void;
}

export interface IResource<T> {
    setResourceLink(link:ResourceLink<T>):void;
    getResourceLink():ResourceLink<T>;
}

export interface IFilterable {
    filters: AbstractFilter[];
}

type Brand<K,T> = K & {__brand: T};

export type Int = Brand<number,'Int'>;


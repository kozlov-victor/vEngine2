import {ITweenDescription, Tween} from "@engine/animation/tween";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {ResourceLink} from "@engine/resources/resourceLink";
import {IFilter} from "@engine/renderer/ifilter";
import {Layer} from "@engine/renderable/impl/general/layer";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";

export type Clazz<T> = new() => T;
export type ClazzEx<T,U> = new(arg:U) => T;

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
    filters: IFilter[];
}

export interface IDestroyable {
    destroy:()=>void;
}

export interface IParentChild {
    id:string;
    parent:Optional<IParentChild>;
    children:IParentChild[];
    appendChild(c:RenderableModel):void;
    appendChildAt(c:RenderableModel,index:number):void;
    appendChildAfter(modelAfter:RenderableModel,newChild:RenderableModel):void;
    appendChildBefore(modelBefore:RenderableModel,newChild:RenderableModel):void;
    prependChild(c:RenderableModel):void;
    removeChildAt(i:number):void;
    removeChildren():void;
    moveToFront():void;
    moveToBack():void;
    findChildById(id:string):Optional<RenderableModel>;
    getParent():Optional<RenderableModel|Layer>;
}

type Brand<K,T> = K & {__brand: T};

export type Int = Brand<number,'Int'>;
export declare type Optional<T> = T | undefined;
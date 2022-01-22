import {ITweenDescription, Tween} from "@engine/animation/tween";
import {TweenMovie} from "@engine/animation/tweenMovie";
import {Layer} from "@engine/scene/layer";
import {Scene} from "@engine/scene/scene";
import {Mat4} from "@engine/geometry/mat4";
import Mat16Holder = Mat4.Mat16Holder;

export type Clazz<T> = new() => T;
export type ClazzEx<T,U> = new(arg:U) => T;

export interface ICloneable<T> {
    clone():T;
}

export interface IRevalidatable {
    revalidate():void;
}

export interface IRenderable {
    render():void;
    draw():void;
}

export interface ITweenable {
    tween<T>(desc:ITweenDescription<T>):Tween<T>;
    addTween<T>(t:Tween<T>):void;
    addTweenMovie(tm:TweenMovie):void;
}

export interface IEventemittable {
    on(eventName:string,callBack:(arg?:any)=>void):(arg?:any)=>void;
    once(eventName:string,callBack:(arg?:any)=>void):void;
    off(eventName:string,callBack:(arg?:any)=>void):void;
    trigger(eventName:string,data?:any):void;
}

export interface IFilterable {
    filters: IFilter[];
}

export interface IAlphaBlendable {
    alpha:number;
}

export interface IDestroyable {
    destroy():void;
}

export interface IUpdatable {
    update():void;
}

export interface IFocusable {
    focus:()=>void;
    blur:()=>void;
    isFocused():boolean;
}

export interface ITransformable {
    worldTransformDirty:boolean;
    worldTransformMatrix:Mat16Holder;
    transform():void;
    translate():void;
}

export interface IParentChild {
    id:string;
    parent:Optional<IParentChild>;
    _children:IParentChild[];
    getChildAt(index:number):IParentChild;
    getChildrenCount():number;
    appendChild(c:IParentChild):void;
    appendChildAt(c:IParentChild,index:number):void;
    appendChildAfter(modelAfter:IParentChild,newChild:IParentChild):void;
    appendChildBefore(modelBefore:IParentChild,newChild:IParentChild):void;
    prependChild(c:IParentChild):void;
    replaceChild(c:IParentChild,newChild:IParentChild):void;
    removeChildAt(i:number):void;
    removeChild(c:IParentChild):void;
    getChildAt(index:number):IParentChild;
    removeSelf():void;
    removeChildren():void;
    moveToFront():void;
    moveToBack():void;
    findChildById(id:string):Optional<IParentChild>;
    getParent():Optional<IParentChild|Layer|Scene>;
    getParentNode():IParentChild;
}

type Brand<K,T> = K & {__brand: T};

export type Int = Brand<number,'Int'>;
export type Base64 = Brand<string,'Base64'>;
export type URI = Brand<string,'URI'>;
export declare type Optional<T> = T | undefined;

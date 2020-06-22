import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";

export abstract class AbstractElementCreator<T> {

    public abstract createElementByTagName(tagName:string): T;
    public abstract setProps(model:T,virtualNode:VirtualNode):void;

}

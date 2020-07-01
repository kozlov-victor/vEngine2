import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";

export abstract class AbstractElementCreator<T> {

    public abstract createElementByTagName(node:VirtualNode): T;
    public abstract setProps(model:T,virtualNode:VirtualNode):void;

}

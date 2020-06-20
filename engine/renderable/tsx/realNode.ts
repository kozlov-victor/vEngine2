
export interface IRealNode {
    parent:IRealNode;
    children:IRealNode[];
    removeSelf():void;
    removeChildren():void;
    replaceChild(oldNode:IRealNode,newNode:IRealNode):void;
    setProps(props:Record<string, any>):void;
    appendChild(child:IRealNode):void;
    on(event:string,cb:(e:any)=>void):void;
    off(event:string):void;
}

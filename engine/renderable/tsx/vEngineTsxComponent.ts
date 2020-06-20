import {VirtualNode} from "@engine/renderable/tsx/virtualNode";
import {VEngineTsxDOM} from "@engine/renderable/tsx/vEngineTsxDOM";
import {IRealNode} from "@engine/renderable/tsx/realNode";


export abstract class VEngineTsxComponent<T extends Record<string, any>> {

    public state:T;

    public rootNativeElement:IRealNode;
    public oldVirtualDom:VirtualNode;

    protected constructor() {
    }

    public abstract render():VirtualNode;

    public setState(newState:Partial<T>):void{
        Object.keys(newState).forEach(k=>{
            (this.state as Record<string, any>)[k] = newState[k];
        });
        if (this.rootNativeElement!==undefined) VEngineTsxDOM.render(this,this.rootNativeElement);
    }

}

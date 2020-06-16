import {VirtualNode} from "@engine/renderable/tsx/virtualNode";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {VEngineTsxDOM} from "@engine/renderable/tsx/vEngineTsxDOM";


export abstract class VEngineTsxComponent<T extends Record<string, any>> {

    public state:T;

    private rootNativeElement:RenderableModel;
    private oldVirtualDom:VirtualNode;

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

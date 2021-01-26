import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {AbstractTsxDOMRenderer} from "@engine/renderable/tsx/genetic/abstractTsxDOMRenderer";
import {IRealNode} from "@engine/renderable/tsx/genetic/realNode";


export abstract class VEngineTsxComponent<T extends Record<string, any>> {

    protected state:T;
    public rootNativeElement:IRealNode;

    protected constructor(
        private tsxDOMRenderer:AbstractTsxDOMRenderer<any>
    ) {
    }

    public abstract render():VirtualNode;

    public setState(newState:Partial<T>):void{
        Object.keys(newState).forEach(k=>{
            (this.state as Record<string, any>)[k] = newState[k];
        });
        if (this.rootNativeElement!==undefined) this.tsxDOMRenderer.render(this,this.rootNativeElement);
    }

    public triggerRendering():void{
        this.tsxDOMRenderer.render(this,this.rootNativeElement);
    }

    public mountTo(root:IRealNode):void {
        root.removeChildren();
        this.tsxDOMRenderer.render(this,root);
    }

}

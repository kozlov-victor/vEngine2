import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {AbstractTsxDOMRenderer} from "@engine/renderable/tsx/genetic/abstractTsxDOMRenderer";
import {IRealNode} from "@engine/renderable/tsx/genetic/realNode";


export abstract class VEngineTsxComponent {

    public rootNativeElement:IRealNode;

    protected constructor(
        private tsxDOMRenderer:AbstractTsxDOMRenderer<any>
    ) {
    }

    public abstract render():VirtualNode;

    protected triggerRendering():void{
        if (this.rootNativeElement!==undefined) this.tsxDOMRenderer.render(this,this.rootNativeElement);
    }

    public mountTo(root:IRealNode):void {
        root.removeChildren();
        this.tsxDOMRenderer.render(this,root);
    }

}

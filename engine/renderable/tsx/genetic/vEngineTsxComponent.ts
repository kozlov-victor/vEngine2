import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {AbstractTsxDOMRenderer} from "@engine/renderable/tsx/genetic/abstractTsxDOMRenderer";
import {IRealNode} from "@engine/renderable/tsx/genetic/realNode";
import {BaseTsxComponent} from "@engine/renderable/tsx/genetic/baseTsxComponent";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";


export abstract class VEngineTsxComponent extends BaseTsxComponent {

    public rootNativeElement:IRealNode;
    private rootVirtualElement:VirtualNode;

    protected constructor(
        private tsxDOMRenderer:AbstractTsxDOMRenderer<any>
    ) {
        super();
    }

    protected triggerRendering():void{
        if (this.rootNativeElement!==undefined) {
            this.rootVirtualElement = this.tsxDOMRenderer.render(this,this.rootNativeElement);
        }
    }

    public mountTo(root:IRealNode):void {
        root.removeChildren();
        this.rootVirtualElement = this.tsxDOMRenderer.render(this,root);
        this.onMounted();
    }

    public destroy():void {
        VEngineTsxFactory.destroyElement(this.rootVirtualElement);
    }

}

import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/virtualNode";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {VEngineReact} from "@engine/renderable/tsx/tsxFactory.h";
import {Optional} from "@engine/core/declarations";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class VEngineTsxDOM {

    public static render(component:VEngineTsxComponent<any>, root:RenderableModel):void{
        (component as unknown as {rootNativeElement:RenderableModel}).rootNativeElement = root;
        const virtualNode:VirtualNode = component.render();
        VEngineTsxDOM.compareAndRenderRoot(VEngineReact.getGame(),virtualNode,root);
    }

    private static compareAndRenderRoot(game:Game,virtualNode:VirtualNode,parent:RenderableModel):void{
        let realNode:RenderableModel = parent.children[0];
        if (realNode===undefined) {
            realNode = new virtualNode.elementConstructor(game);
            realNode.setProps(virtualNode.props);
            VEngineTsxDOM.setGenericProps(realNode,virtualNode.props);
            parent.appendChild(realNode);
        } else realNode.setProps(virtualNode.props);
        VEngineTsxDOM.compareAndRenderChildren(game,virtualNode,realNode);
    }

    private static compareAndRenderChildren(game:Game,virtualParent:VirtualNode,realParent:RenderableModel):void{
        const maxNumOfChild:number = Math.max(virtualParent?.children?.length??0,realParent?.children?.length??0);
        for (let i:number = 0;i<maxNumOfChild;i++) {
            const virtualChild:Optional<VirtualNode> = virtualParent.children[i];
            let realChild:Optional<RenderableModel> = realParent.children[i];
            if (virtualChild===undefined && realChild!==undefined) {  // remove real node
                realChild.removeSelf();
                i--;
            } else if (virtualChild!==undefined && realChild!==undefined) {
                if (virtualChild.elementConstructor!==realChild.constructor) { // replace real node
                    realChild.removeSelf();
                    i--;
                    realChild = new virtualChild.elementConstructor(game);
                    realChild!.setProps(virtualChild.props);
                    realParent.appendChild(realChild!);
                    VEngineTsxDOM.setGenericProps(realChild!,virtualChild.props);
                } else {
                    realChild.setProps(virtualChild.props); // update real node
                }
            } else if ((virtualChild!==undefined && realChild===undefined)){ // (virtualChild!==undefined && realChild==undefined)  create new real node
                realChild = new virtualChild.elementConstructor(game);
                realChild!.setProps(virtualChild.props);
                realParent.appendChild(realChild!);
                VEngineTsxDOM.setGenericProps(realChild!,virtualChild.props);
            } else {
                // virtual and real node is undefined due to removing, ignore
                continue;
            }
            VEngineTsxDOM.compareAndRenderChildren(game,virtualChild,realChild!);
        }
    }

    private static setGenericProps(model:RenderableModel,props:IGenericProps<unknown>){
        if (props.ref!==undefined) props.ref.current = model;
        if (props.click!==undefined) model.on(MOUSE_EVENTS.click, props.click);
    }

}

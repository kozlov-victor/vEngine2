import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/virtualNode";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {VEngineReact} from "@engine/renderable/tsx/tsxFactory.h";
import {Optional} from "@engine/core/declarations";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";

export class VEngineTsxDOM {

    public static render(component:VEngineTsxComponent<any>, root:RenderableModel):void{
        component.rootNativeElement = root;
        const newVirtualDom:VirtualNode = new VirtualNode({},{type:"node",ctor:undefined});
        newVirtualDom.children = [component.render()];
        const oldVirtualDom:VirtualNode =
            ((component as unknown as {oldVirtualDom:VirtualNode}).oldVirtualDom) ??
            new VirtualNode({},{type:"node",ctor:undefined});
        VEngineTsxDOM.compareAndRenderChildren(VEngineReact.getGame(),newVirtualDom,oldVirtualDom,root);
        component.oldVirtualDom = newVirtualDom;
    }

    private static removeNode(node:Optional<RenderableModel>):void {
        node?.removeSelf();
    }

    private static replaceNode(game:Game,node:Optional<RenderableModel>,newVirtualNode:VirtualNode,parent:RenderableModel):RenderableModel{
        node?.removeSelf();
        node = new newVirtualNode.elementConstructor.ctor(game);
        node!.setProps(newVirtualNode.props);
        parent.appendChild(node!);
        VEngineTsxDOM.setGenericProps(node!,newVirtualNode.props);
        return node!;
    }

    private static updateNode(node:RenderableModel,props:Record<string, any>):void{
        node.setProps(props);
    }

    private static createNode(game:Game,newVirtualNode:VirtualNode,parent:RenderableModel):RenderableModel{
        const node = new newVirtualNode.elementConstructor.ctor(game);
        node.setProps(newVirtualNode.props);
        parent.appendChild(node);
        VEngineTsxDOM.setGenericProps(node,newVirtualNode.props);
        return node;
    }

    private static compareAndRenderChildren(game:Game,newVirtualDom:VirtualNode,oldVirtualDom:Optional<VirtualNode>,parent:RenderableModel):void{
        const maxNumOfChild:number = Math.max(newVirtualDom?.children?.length??0,oldVirtualDom?.children?.length??0);
        for (let i:number = 0;i<maxNumOfChild;i++) {
            const newVirtualChild:Optional<VirtualNode> = newVirtualDom?.children?.[i];
            const oldVirtualChild:Optional<VirtualNode> = oldVirtualDom?.children?.[i];
            let realChild:Optional<RenderableModel> = parent.children[i];
            // if (newVirtualChild!==undefined && newVirtualChild.elementConstructor.type==='component') {
            //     const component = new newVirtualChild.elementConstructor.ctor();
            //     Object.keys(newVirtualChild.props).forEach(p=>component[p] = newVirtualChild.props[p]);
            //     VEngineTsxDOM.render(component,parent);
            //     continue;
            // }
            if (newVirtualChild===undefined && oldVirtualChild!==undefined) {  // remove node
                VEngineTsxDOM.removeNode(realChild);
            } else if (newVirtualChild!==undefined && oldVirtualChild!==undefined) {
                if (newVirtualChild.elementConstructor!==oldVirtualChild.elementConstructor) { // replace node
                    realChild = VEngineTsxDOM.replaceNode(game,realChild,newVirtualChild,parent);
                } else {
                    VEngineTsxDOM.updateNode(realChild,newVirtualChild.props) // update node
                }
            } else if ((newVirtualChild!==undefined && oldVirtualChild===undefined)){ // create new node
                realChild = VEngineTsxDOM.createNode(game,newVirtualChild,parent);
            }
            VEngineTsxDOM.compareAndRenderChildren(game,newVirtualChild,oldVirtualChild,realChild!);
        }
    }

    private static setGenericProps(model:RenderableModel,props:IGenericProps<unknown>){
        if (props.ref!==undefined) props.ref.current = model;
        if (props.click!==undefined) model.on(MOUSE_EVENTS.click, props.click);
    }

}

import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/virtualNode";
import {Game} from "@engine/core/game";
import {VEngineReact} from "@engine/renderable/tsx/tsxFactory.h";
import {Optional} from "@engine/core/declarations";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IRealNode} from "@engine/renderable/tsx/realNode";

export class VEngineTsxDOM {

    public static render(component:VEngineTsxComponent<any>, root:IRealNode):IRealNode{
        component.rootNativeElement = root;
        const newVirtualDom:Optional<VirtualNode> = component.render();
        console.log(newVirtualDom);
        const oldVirtualDom:Optional<VirtualNode> = component.oldVirtualDom;
        VEngineTsxDOM.compareAndRenderElement(VEngineReact.getGame(),newVirtualDom,oldVirtualDom,root.children[0],root);
        component.oldVirtualDom = newVirtualDom;
        return root.children[0];
    }

    private static removeNode(node:Optional<IRealNode>):void {
        console.log('remove');
        node?.removeSelf();
    }

    private static replaceNode(game:Game,node:IRealNode,newVirtualNode:VirtualNode,parent:IRealNode):Optional<IRealNode>{
        console.log('replace');
        if (newVirtualNode.elementConstructor.type==='component') {
            const component:VEngineTsxComponent<any> = VEngineTsxDOM.instantiateComponent(newVirtualNode);
            node.removeChildren();
            const newNode:IRealNode = VEngineTsxDOM.render(component,node);
            parent.replaceChild(node,newNode);
            return undefined;
        } else {
            const newNode = new newVirtualNode.elementConstructor.ctor(game);
            newNode.setProps(newVirtualNode.props);
            VEngineTsxDOM.setGenericProps(newNode,newVirtualNode.props);
            parent.replaceChild(node,newNode);
            return newNode;
        }
    }

    private static instantiateComponent(virtualNode:VirtualNode):VEngineTsxComponent<any> {
        const component:VEngineTsxComponent<any> = new virtualNode.elementConstructor.ctor() as VEngineTsxComponent<any>;
        Object.keys(virtualNode.props).forEach(p=>(component as Record<string, any>)[p]=virtualNode.props[p]);
        return component;
    }

    private static updateNode(game:Game,node:IRealNode,newVirtualNode:VirtualNode,oldVirtualNode:VirtualNode):void{
        console.log('update');
        if (newVirtualNode.elementConstructor.type==='component') {
            const componentNew:VEngineTsxComponent<any> = VEngineTsxDOM.instantiateComponent(newVirtualNode);
            const componentOld:VEngineTsxComponent<any> = VEngineTsxDOM.instantiateComponent(oldVirtualNode);
            VEngineTsxDOM.compareAndRenderElement(game,componentNew.render(),componentOld.render(),node,node.parent);
        } else {
            node.setProps(newVirtualNode.props);
            VEngineTsxDOM.setGenericProps(node,newVirtualNode.props);
        }
    }

    private static createNode(game:Game,newVirtualNode:VirtualNode,parent:IRealNode):Optional<IRealNode>{
        console.log('create');
        if (newVirtualNode.elementConstructor.type==='component') {
            const component = VEngineTsxDOM.instantiateComponent(newVirtualNode);
            VEngineTsxDOM.render(component,parent);
            return undefined;
        } else {
            const node = new newVirtualNode.elementConstructor.ctor(game);
            node.setProps(newVirtualNode.props);
            parent.appendChild(node);
            VEngineTsxDOM.setGenericProps(node,newVirtualNode.props);
            return node;
        }

    }

    private static compareAndRenderElement(
        game:Game,newVirtualNode:Optional<VirtualNode>,
        oldVirtualNode:Optional<VirtualNode>,realNode:IRealNode,
        parent:IRealNode):Optional<IRealNode>{

        //node
        let newRealNode:Optional<IRealNode> = realNode;
        if (newVirtualNode===undefined && oldVirtualNode!==undefined) {  // remove node
            VEngineTsxDOM.removeNode(realNode);
        } else if (newVirtualNode!==undefined && oldVirtualNode!==undefined) {
            if (newVirtualNode.elementConstructor.ctor!==oldVirtualNode.elementConstructor.ctor) { // replace node
                newRealNode = VEngineTsxDOM.replaceNode(game,realNode,newVirtualNode,parent);
            } else {
                VEngineTsxDOM.updateNode(game,realNode,newVirtualNode,oldVirtualNode); // update node
            }
        } else if ((newVirtualNode!==undefined && oldVirtualNode===undefined)){ // create new node
            newRealNode = VEngineTsxDOM.createNode(game,newVirtualNode,parent);
        }
        // children
        if (newRealNode!==undefined) VEngineTsxDOM.compareAndRenderChildren(game,newVirtualNode,oldVirtualNode,newRealNode);
        return newRealNode;
    }

    private static compareAndRenderChildren(game:Game,newVirtualNode:Optional<VirtualNode>,oldVirtualNode:Optional<VirtualNode>,parent:IRealNode):void{
        const maxNumOfChild:number = Math.max(newVirtualNode?.children?.length??0,oldVirtualNode?.children?.length??0);
        for (let i:number = 0;i<maxNumOfChild;i++) {
            const newVirtualChild:Optional<VirtualNode> = newVirtualNode?.children?.[i];
            const oldVirtualChild:Optional<VirtualNode> = oldVirtualNode?.children?.[i];
            VEngineTsxDOM.compareAndRenderElement(game,newVirtualChild,oldVirtualChild,parent.children?.[i],parent);
        }
    }

    private static setGenericProps(model:IRealNode,props:IGenericProps<unknown>){
        if (props.ref!==undefined) props.ref(model);
        if (props.click!==undefined) {
            model.off(MOUSE_EVENTS.click);
            model.on(MOUSE_EVENTS.click, props.click);
        }
    }

}

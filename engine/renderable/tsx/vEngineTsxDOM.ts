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
        const oldVirtualDom:Optional<VirtualNode> = component.oldVirtualDom;
        console.log({component,oldVirtualDom,newVirtualDom});
        VEngineTsxDOM.compareAndRenderElement(VEngineReact.getGame(),newVirtualDom,oldVirtualDom,root.children[0],root);
        component.oldVirtualDom = newVirtualDom;
        return root.children[0];
    }

    private static removeNode(node:IRealNode):void {
        console.log('remove',node);
        node.removeSelf();
    }

    private static replaceNode(game:Game,node:IRealNode,newVirtualNode:VirtualNode,parent:IRealNode):Optional<IRealNode>{
        console.log('replacing',newVirtualNode);
        if (newVirtualNode.elementConstructor.type==='component') {
            const component:VEngineTsxComponent<any> = VEngineTsxDOM.instantiateComponent(newVirtualNode);
            node.removeChildren();
            const newNode:IRealNode = VEngineTsxDOM.render(component,node);
            parent.replaceChild(node,newNode);
            return undefined;
        } else {
            const newNode:IRealNode = new newVirtualNode.elementConstructor.ctor(game);
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
        console.log('updaing component',newVirtualNode);
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
        if (newVirtualNode.elementConstructor.type==='component') {
            const component:VEngineTsxComponent<any> = VEngineTsxDOM.instantiateComponent(newVirtualNode);
            VEngineTsxDOM.render(component,parent);
            console.log('created component',component);
            return undefined;
        } else {
            const node:IRealNode = new newVirtualNode.elementConstructor.ctor(game);
            node.setProps(newVirtualNode.props);
            parent.appendChild(node);
            VEngineTsxDOM.setGenericProps(node,newVirtualNode.props);
            console.log('created node',node);
            return node;
        }

    }

    private static compareAndRenderElement(
        game:Game,newVirtualNode:Optional<VirtualNode>,
        oldVirtualNode:Optional<VirtualNode>,realNode:IRealNode,
        parent:IRealNode):Optional<IRealNode>{

        //render node
        let newRealNode:Optional<IRealNode> = realNode;
        if (newVirtualNode===undefined && oldVirtualNode!==undefined) {  // remove node
            if (newRealNode!==undefined) VEngineTsxDOM.removeNode(newRealNode);
        } else if (newVirtualNode!==undefined && oldVirtualNode!==undefined && newRealNode!==undefined) {
            console.log({newVirtualNode,oldVirtualNode});
            if (
                newVirtualNode.index !==oldVirtualNode.index ||
                newVirtualNode.key!==oldVirtualNode.key ||
                newVirtualNode.elementConstructor.ctor!==oldVirtualNode.elementConstructor.ctor ||
                (newVirtualNode.elementConstructor.type==='node' && newRealNode.constructor !==newVirtualNode.elementConstructor.ctor)
            ) { // replace node
                newRealNode = VEngineTsxDOM.replaceNode(game,newRealNode,newVirtualNode,parent);
            } else {
                VEngineTsxDOM.updateNode(game,newRealNode,newVirtualNode,oldVirtualNode); // update node
            }
        } else if (newVirtualNode!==undefined && (oldVirtualNode===undefined || newRealNode===undefined)){ // create new node
            newRealNode = VEngineTsxDOM.createNode(game,newVirtualNode,parent);
        }
        // render children
        if (newRealNode!==undefined) VEngineTsxDOM.compareAndRenderChildren(game,newVirtualNode,oldVirtualNode,newRealNode);
        return newRealNode;
    }

    private static compareAndRenderChildren(game:Game,newVirtualNode:Optional<VirtualNode>,oldVirtualNode:Optional<VirtualNode>,parent:IRealNode):void{
        let maxNumOfChild:number = newVirtualNode?.children?.length || 0;
        if (oldVirtualNode) {
            const l:number = oldVirtualNode.children?.length ?? 0;
            if (l>maxNumOfChild) maxNumOfChild = l;
        }
        const children:IRealNode[] = [...parent.children];
        for (let i:number = 0;i<maxNumOfChild;i++) {
            const newVirtualChild:Optional<VirtualNode> = newVirtualNode?.children?.[i];
            const oldVirtualChild:Optional<VirtualNode> = oldVirtualNode?.children?.[i];
            VEngineTsxDOM.compareAndRenderElement(game,newVirtualChild,oldVirtualChild,children[i],parent);
        }
    }

    private static setGenericProps(model:IRealNode,props:IGenericProps<unknown>){
        if (props.ref!==undefined) props.ref(model);
        model.off(MOUSE_EVENTS.click);
        if (props.click!==undefined) {
            model.on(MOUSE_EVENTS.click, props.click);
        }
    }

}

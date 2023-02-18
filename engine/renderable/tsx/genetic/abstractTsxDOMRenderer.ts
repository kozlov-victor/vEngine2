import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {Optional} from "@engine/core/declarations";
import {IRealNode} from "@engine/renderable/tsx/genetic/realNode";
import {AbstractElementCreator} from "@engine/renderable/tsx/genetic/abstractElementCreator";

const debug = false;

export abstract class AbstractTsxDOMRenderer<T extends IRealNode> {

    private oldVirtualDom:VirtualNode;

    protected constructor(private elementCreator:AbstractElementCreator<T>) {
    }

    public render(component:VEngineTsxComponent, root:T):VirtualNode{
        component.rootNativeElement = root;
        if (debug) console.log('before render');
        const newVirtualNode:VirtualNode = component.render();
        const newVirtualNodeChildren:VirtualNode[] = [];
        if (newVirtualNode.type==='virtualFragment') {
            newVirtualNodeChildren.push(...newVirtualNode.children);
        } else {
            newVirtualNodeChildren.push(newVirtualNode);
        }
        const newVirtualDom:VirtualNode = new VirtualNode({},"root",newVirtualNodeChildren);
        this.reconcileChildren(newVirtualDom,this.oldVirtualDom,root);
        this.oldVirtualDom = newVirtualDom;
        return newVirtualDom;
    }

    private removeNode(node:T):void {
        if (debug) console.log('remove',node);
        node.removeSelf();
    }

    private replaceNode(node:T,newVirtualNode:VirtualNode,parent:T):Optional<T>{
        if (debug) console.log('replacing',newVirtualNode);
        const newNode:T = this.elementCreator.createElementByTagName(newVirtualNode);
        this.setGenericProps(newNode,newVirtualNode);
        parent.replaceChild(node,newNode);
        return newNode;
    }

    private updateNode(node:T,newVirtualNode:VirtualNode):void{
        if (debug) console.log('updating',newVirtualNode);
        this.setGenericProps(node,newVirtualNode);
    }

    private createNode(newVirtualNode:VirtualNode,parent:T):Optional<T>{
        const node:T = this.elementCreator.createElementByTagName(newVirtualNode);
        this.setGenericProps(node,newVirtualNode);
        parent.appendChild(node);
        return node;
    }

    private reconcile(
        newVirtualNode:Optional<VirtualNode>,
        oldVirtualNode:Optional<VirtualNode>,realNode:T,
        parent:T):Optional<T>{

        //render node
        let newRealNode:Optional<T> = realNode;
        if (newVirtualNode===undefined && oldVirtualNode!==undefined) {  // remove node
            if (newRealNode!==undefined) this.removeNode(newRealNode);
        } else if (newVirtualNode!==undefined && oldVirtualNode!==undefined && newRealNode!==undefined) {
            if (
                newVirtualNode.index !==oldVirtualNode.index ||
                newVirtualNode.props?.__id !==oldVirtualNode.props?.__id ||
                newVirtualNode.loopIndex!==oldVirtualNode.loopIndex ||
                newVirtualNode.tagName!==oldVirtualNode.tagName
            ) { // replace node
                newRealNode = this.replaceNode(newRealNode,newVirtualNode,parent);
            } else {
                this.updateNode(newRealNode,newVirtualNode); // update node
            }
        } else if (newVirtualNode!==undefined && (oldVirtualNode===undefined || newRealNode===undefined)){ // create new node
            newRealNode = this.createNode(newVirtualNode,parent);
        }
        // render children
        if (newRealNode!==undefined) this.reconcileChildren(newVirtualNode,oldVirtualNode,newRealNode);
        return newRealNode;
    }

    private reconcileChildren(newVirtualNode:Optional<VirtualNode>,oldVirtualNode:Optional<VirtualNode>,parent:T):void{
        const maxNumOfChild:number =
            Math.max(
                newVirtualNode?.children?.length ?? 0,
                oldVirtualNode?.children?.length ?? 0
            );
        const realChildren:IRealNode[] = [];
        for (let i=0,max=parent.getChildrenCount();i<max;++i) realChildren.push(parent.getChildAt(i));
        for (let i:number = 0;i<maxNumOfChild;++i) {
            const newVirtualChild:Optional<VirtualNode> = newVirtualNode?.children?.[i];
            const oldVirtualChild:Optional<VirtualNode> = oldVirtualNode?.children?.[i];
            this.reconcile(newVirtualChild,oldVirtualChild,realChildren[i] as T,parent);
        }
    }

    private setGenericProps(model:T,virtualNode:VirtualNode):void{
        if (virtualNode?.props?.ref!==undefined) virtualNode.props.ref(model);
        this.elementCreator.setProps(model,virtualNode);
    }

}

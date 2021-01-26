import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {Optional} from "@engine/core/declarations";
import {IRealNode} from "@engine/renderable/tsx/genetic/realNode";
import {AbstractElementCreator} from "@engine/renderable/tsx/genetic/abstractElementCreator";

const debug = false;

export abstract class AbstractTsxDOMRenderer<T extends IRealNode> {

    private newVirtualDomNodes:VirtualNode[] = [];
    private oldVirtualDomNodes:VirtualNode[] = [];

    protected constructor(private elementCreator:AbstractElementCreator<T>) {
    }

    public render(component:VEngineTsxComponent<any>, root:T):void{
        component.rootNativeElement = root;
        if (debug) console.log('before render');
        this.newVirtualDomNodes.length = 0;
        const newVirtualDom:VirtualNode = component.render();
        if (newVirtualDom.type==='virtualFragment') {
            this.newVirtualDomNodes.push(...newVirtualDom.children);
        } else {
            this.newVirtualDomNodes.push(newVirtualDom);
        }
        const maxLength:number = Math.max(this.newVirtualDomNodes.length,this.oldVirtualDomNodes?.length??0);
        for (let i:number=0;i<maxLength;i++) {
            this.reconcile(this.newVirtualDomNodes[i],this.oldVirtualDomNodes[i],root.getChildAt(i) as T,root);
        }
        this.oldVirtualDomNodes.length = 0;
        this.oldVirtualDomNodes.push(...this.newVirtualDomNodes);
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
        let maxNumOfChild:number = newVirtualNode?.children?.length || 0;
        if (oldVirtualNode) {
            const l:number = oldVirtualNode.children?.length ?? 0;
            if (l>maxNumOfChild) maxNumOfChild = l;
        }
        const children:T[] = [...parent.getChildren()] as T[];
        for (let i:number = 0;i<maxNumOfChild;i++) {
            const newVirtualChild:Optional<VirtualNode> = newVirtualNode?.children?.[i];
            const oldVirtualChild:Optional<VirtualNode> = oldVirtualNode?.children?.[i];
            this.reconcile(newVirtualChild,oldVirtualChild,children[i],parent);
        }
    }

    private setGenericProps(model:T,virtualNode:VirtualNode):void{
        if (virtualNode.props.ref!==undefined) virtualNode.props.ref(model);
        this.elementCreator.setProps(model,virtualNode);
    }

}

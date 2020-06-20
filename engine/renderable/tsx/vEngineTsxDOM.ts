import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/virtualNode";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {VEngineReact} from "@engine/renderable/tsx/tsxFactory.h";
import {Optional} from "@engine/core/declarations";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";

export class VEngineTsxDOM {

    public static render(component:VEngineTsxComponent<any>, root:RenderableModel):RenderableModel{
        console.log('render',component);
        component.rootNativeElement = root;
        const newVirtualDom:VirtualNode = new VirtualNode({},{type:"node",ctor:undefined});
        newVirtualDom.children = [component.render()];
        const oldVirtualDom:VirtualNode =
            component.oldVirtualDom ??
            new VirtualNode({},{type:"node",ctor:undefined});
        VEngineTsxDOM.compareAndRenderChildren(VEngineReact.getGame(),newVirtualDom,oldVirtualDom,root);
        component.oldVirtualDom = newVirtualDom;
        return root.children[0];
    }

    private static removeNode(node:Optional<RenderableModel>):void {
        console.log('remove',node);
        node?.removeSelf();
    }

    private static replaceNode(game:Game,node:RenderableModel,newVirtualNode:VirtualNode,parent:RenderableModel):Optional<RenderableModel>{
        console.log('replace');
        if (newVirtualNode.elementConstructor.type==='component') {
            const component = new newVirtualNode.elementConstructor.ctor();
            Object.keys(newVirtualNode.props).forEach(p=>component[p]=newVirtualNode.props[p]);
            const newNode = VEngineTsxDOM.render(component,new NullGameObject(game));
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

    private static updateNode(game:Game,node:RenderableModel,newVirtualNode:VirtualNode):void{
        console.log('update');
        if (newVirtualNode.elementConstructor.type==='component') {
            const component = new newVirtualNode.elementConstructor.ctor();
            Object.keys(newVirtualNode.props).forEach(p=>component[p]=newVirtualNode.props[p]);
            const newNode = VEngineTsxDOM.render(component,new NullGameObject(game));

        } else {
            node.setProps(newVirtualNode.props);
            VEngineTsxDOM.setGenericProps(node,newVirtualNode.props);
        }
    }

    private static createNode(game:Game,newVirtualNode:VirtualNode,parent:RenderableModel):Optional<RenderableModel>{
        console.log('create');
        if (newVirtualNode.elementConstructor.type==='component') {
            const component = new newVirtualNode.elementConstructor.ctor();
            Object.keys(newVirtualNode.props).forEach(p=>component[p]=newVirtualNode.props[p]);
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
        oldVirtualNode:Optional<VirtualNode>,realNode:RenderableModel,
        parent:RenderableModel):Optional<RenderableModel>{

        let newRealNode:Optional<RenderableModel> = realNode;
        if (newVirtualNode===undefined && oldVirtualNode!==undefined) {  // remove node
            VEngineTsxDOM.removeNode(realNode);
        } else if (newVirtualNode!==undefined && oldVirtualNode!==undefined) {
            if (newVirtualNode.elementConstructor.ctor!==oldVirtualNode.elementConstructor.ctor) { // replace node
                newRealNode = VEngineTsxDOM.replaceNode(game,realNode,newVirtualNode,parent);
            } else {
                VEngineTsxDOM.updateNode(game,realNode,newVirtualNode); // update node
            }
        } else if ((newVirtualNode!==undefined && oldVirtualNode===undefined)){ // create new component of node
            newRealNode = VEngineTsxDOM.createNode(game,newVirtualNode,parent);
        }
        return newRealNode;
    }

    private static compareAndRenderChildren(game:Game,newVirtualDom:VirtualNode,oldVirtualDom:Optional<VirtualNode>,parent:RenderableModel):void{
        const maxNumOfChild:number = Math.max(newVirtualDom?.children?.length??0,oldVirtualDom?.children?.length??0);
        for (let i:number = 0;i<maxNumOfChild;i++) {
            const newVirtualChild:Optional<VirtualNode> = newVirtualDom?.children?.[i];
            const oldVirtualChild:Optional<VirtualNode> = oldVirtualDom?.children?.[i];
            const realChild = VEngineTsxDOM.compareAndRenderElement(game,newVirtualChild,oldVirtualChild,parent.children?.[i],parent);
            if (realChild!==undefined) VEngineTsxDOM.compareAndRenderChildren(game,newVirtualChild,oldVirtualChild,realChild);
        }
    }

    private static setGenericProps(model:RenderableModel,props:IGenericProps<unknown>){
        if (props.ref!==undefined) props.ref.current = model;
        if (props.click!==undefined) {
            model.off(MOUSE_EVENTS.click);
            model.on(MOUSE_EVENTS.click, props.click);
        }
    }

}

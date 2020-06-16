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
        const newVirtualDom:VirtualNode = new VirtualNode({},{type:"node",ctor:undefined});
        newVirtualDom.children = [component.render()];
        const oldVirtualDom:VirtualNode =
            ((component as unknown as {oldVirtualDom:VirtualNode}).oldVirtualDom) ??
            new VirtualNode({},{type:"node",ctor:undefined});
        VEngineTsxDOM.compareAndRenderChildren(VEngineReact.getGame(),newVirtualDom,oldVirtualDom,root);
        (component as unknown as {oldVirtualDom:VirtualNode}).oldVirtualDom = newVirtualDom;
    }


    private static compareAndRenderChildren(game:Game,newVirtualDom:VirtualNode,oldVirtualDom:VirtualNode,parent:RenderableModel):void{
        const maxNumOfChild:number = Math.max(newVirtualDom?.children?.length??0,oldVirtualDom?.children?.length??0);
        for (let i:number = 0;i<maxNumOfChild;i++) {
            const newVirtualChild:Optional<VirtualNode> = newVirtualDom?.children?.[i];
            const oldVirtualChild:Optional<VirtualNode> = oldVirtualDom?.children?.[i];
            let realChild:Optional<RenderableModel> = parent.children[i];
            if (newVirtualChild===undefined && oldVirtualChild!==undefined) {  // remove real node
                realChild?.removeSelf();
            } else if (newVirtualChild!==undefined && oldVirtualChild!==undefined) {
                if (newVirtualChild.elementConstructor!==oldVirtualChild.elementConstructor) { // replace real node
                    realChild?.removeSelf();
                    realChild = new newVirtualChild.elementConstructor.ctor(game);
                    realChild!.setProps(newVirtualChild.props);
                    parent.appendChild(realChild!);
                    VEngineTsxDOM.setGenericProps(realChild!,newVirtualChild.props);
                } else {
                    realChild.setProps(newVirtualChild.props); // update real node
                }
            } else if ((newVirtualChild!==undefined && oldVirtualChild===undefined)){ // create new real node
                realChild = new newVirtualChild.elementConstructor.ctor(game);
                realChild!.setProps(newVirtualChild.props);
                parent.appendChild(realChild!);
                VEngineTsxDOM.setGenericProps(realChild!,newVirtualChild.props);
            }
            VEngineTsxDOM.compareAndRenderChildren(game,newVirtualChild,oldVirtualChild,realChild!);
        }
    }

    private static setGenericProps(model:RenderableModel,props:IGenericProps<unknown>){
        if (props.ref!==undefined) props.ref.current = model;
        if (props.click!==undefined) model.on(MOUSE_EVENTS.click, props.click);
    }

}

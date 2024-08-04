import {VirtualCommentNode, VirtualNode, VirtualTextNode} from "@engine/renderable/tsx/_genetic/virtualNode";
import {VirtualFragment} from "@engine/renderable/tsx/_genetic/virtualFragment";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";

const flattenDeep = <T>(arr:(T[]|T)[]):T[]=> {
    const res =  arr.reduce((acc, val) => {
        if (Array.isArray(val)) {
            val.forEach((v,i)=>{
                (v as any).loopIndex=i;
            });
            return (acc as T[]).concat(flattenDeep(val as T[]));
        } else return (acc as T[]).concat(val as T);
    },[]);
    return res as T[];
};

export const getComponentUuid = (props:Record<string, any>)=>{
    return props.trackBy ??  props.__id;
}


export class VEngineTsxFactory<T> {

    private static componentInstances:Record<number, BaseTsxComponent> = {};

    private static renderComponent(instance:BaseTsxComponent,props: Record<string, any>) {
        (instance as any).props = props;
        const node = instance.render() as VirtualNode|VirtualFragment;
        const commentNode = new VirtualCommentNode(props,`cid:${getComponentUuid(props)}`);
        commentNode.parentComponent = instance;
        node.children.unshift(commentNode);
        return node;
    }

    public static createElement(
        item:string|((props:Record<string, any>)=>VirtualNode|VirtualFragment)|{new: BaseTsxComponent},
        props:Record<string, any>|null,
        ...children: (VirtualNode|VirtualFragment|string|number|any)[]
    ):JSX.Element {
        if (props===null) props = {};

        const flattenedChildren:(VirtualNode|VirtualFragment)[] =
            flattenDeep(children).
            map((it,i)=>{
                if ((it as unknown as string)?.substr!==undefined || (it as unknown as number)?.toFixed!==undefined) {
                    return  new VirtualTextNode(String(it));
                }
                // else if (
                //     typeof it === 'object'
                // ) {
                //     return  new VirtualTextNode(''+it);
                // }
                else return it;
            }).
            filter(it=>!!it); // remove null, false and undefined;
        const flattenedChildrenNoFragments:VirtualNode[] = [];
        for (const node of flattenedChildren) {
            if (node.type==='virtualFragment') {
                flattenedChildrenNoFragments.push(...node.children);
            }
            else flattenedChildrenNoFragments.push(node);
        }

        const propsWithChildren:Record<string, any> & {children:VirtualNode[]} =
            {...props,children:flattenedChildrenNoFragments};

        if ((item as any).__VEngineTsxComponent) {
            const uuid = getComponentUuid(props);
            if (VEngineTsxFactory.componentInstances[uuid]) {
                const instance = VEngineTsxFactory.componentInstances[uuid];
                return this.renderComponent(instance,propsWithChildren);
            } else {
                const instance = new (item as any)(propsWithChildren) as BaseTsxComponent;
                VEngineTsxFactory.componentInstances[uuid] = instance;
                return this.renderComponent(instance,propsWithChildren);
            }
        }
        else if ((item as (props:Record<string, any>)=>VirtualNode).call!==undefined) {
            return (item as (arg: any) => VirtualNode)(propsWithChildren);
        }
        else {
            const tagName = item as string;
            return new VirtualNode(propsWithChildren, tagName, flattenedChildrenNoFragments);
        }
    }

    public static destroyElement(el:VirtualNode) {
        VEngineTsxFactory.clearCachedInstance((el.parentComponent as any)?.props);
        el.children.forEach(it=>this.destroyElement(it));
    }

    public static clearCachedInstance(props:Record<string, any>) {
        if (!props) return;
        const uuid = getComponentUuid(props);
        delete this.componentInstances[uuid];
    }

    public static createFragment({children}:{children: VirtualNode[]}):VirtualFragment {
        return new VirtualFragment(children);
    }

    public static clean() {
        this.componentInstances = {};
    }

}

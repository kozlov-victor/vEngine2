import {VirtualNode} from "@engine/renderable/tsx/_genetic/virtualNode";
import {VirtualFragment} from "@engine/renderable/tsx/_genetic/virtualFragment";
import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";

const flattenDeep = (arr:(VirtualNode[]|VirtualNode)[]):VirtualNode[]=> {
    const res =  arr.reduce((acc, val) => {
        if (Array.isArray(val)) {
            val.forEach((v,i)=>{
                v.loopIndex=i;
            });
            return (acc as VirtualNode[]).concat(flattenDeep(val as VirtualNode[]));
        } else return (acc as VirtualNode[]).concat(val as VirtualNode);
    },[]);
    return res as VirtualNode[];
};

export const getComponentUuid = (props:Record<string, any>)=>{
    return props.trackBy ??  props.__id;
}

export class VEngineTsxFactory<T> {

    private static componentInstances:Record<number, BaseTsxComponent> = {};

    private static attachComponentInstanceToNode(node:VirtualNode|VirtualFragment, componentInstance:any) {
        if (node.type==='virtualNode') {
            node.parentComponent = componentInstance;
            node.shouldBeMounted = true;
        }
        else {
            node.children?.forEach(c=>{
                this.attachComponentInstanceToNode(c,componentInstance);
            });
        }
    }

    public static createElement(
        item:string|((props:Record<string, any>)=>VirtualNode)|{new: BaseTsxComponent},
        // eslint-disable-next-line @typescript-eslint/ban-types
        props:Record<string, any>|null,
        ...children: VirtualNode[]
    ):JSX.Element {
        if (props===null) props = {};

        const flattened:VirtualNode[] =
            flattenDeep(children).
            map((it,i)=>{
                if ((it as unknown as string)?.substr!==undefined || (it as unknown as number)?.toFixed!==undefined) {
                    const textNode = new VirtualNode({children: undefined!}, undefined!,undefined!);
                    textNode.text = String(it);
                    return textNode;
                } else return it;
            }).
            filter(it=>!!it); // remove null, false and undefined;
        const flattenedNoFragments:VirtualNode[] = [];
        for (const node of flattened) {
            if (node.type==='virtualFragment') flattenedNoFragments.push(...node.children);
            else flattenedNoFragments.push(node);
        }

        const propsFull:Record<string, any> & {children:VirtualNode[]} =
            {...props,children:flattenedNoFragments};

        if ((item as any).__VEngineTsxComponent) {
            const uuid = getComponentUuid(props);
            if (VEngineTsxFactory.componentInstances[uuid]) {
                const instance = VEngineTsxFactory.componentInstances[uuid];
                (instance as any).props = props;
                const node =  instance.render() as VirtualNode|VirtualFragment;
                this.attachComponentInstanceToNode(node,instance);
                return node;
            } else {
                const instance = new (item as any)(props) as BaseTsxComponent;
                VEngineTsxFactory.componentInstances[uuid] = instance;
                const node = instance.render() as VirtualNode|VirtualFragment;
                this.attachComponentInstanceToNode(node,instance);
                return node;
            }

        }
        else if ((item as (props:Record<string, any>)=>VirtualNode).call!==undefined) {
            return (item as (arg:any)=>VirtualNode)(propsFull);
        }
        else {
            return new VirtualNode(propsFull, item as string, flattenedNoFragments);
        }
    }

    public static destroyElement(el:VirtualNode) {
        this.clearCachedInstance(el.props);
        el.children?.forEach(it=>this.destroyElement(it));
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

import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {VirtualFragment} from "@engine/renderable/tsx/genetic/virtualFragment";
import {BaseTsxComponent} from "@engine/renderable/tsx/genetic/baseTsxComponent";

const flattenDeep = (arr:(VirtualNode[]|VirtualNode)[]):VirtualNode[]=> {
    const res =  arr.reduce((acc, val) => {
        if (Array.isArray(val)) {
            val.forEach((v,i)=>v.loopIndex=i);
            return (acc as VirtualNode[]).concat(flattenDeep(val as VirtualNode[]));
        } else return (acc as VirtualNode[]).concat(val as VirtualNode);
    },[]);
    return res as VirtualNode[];
};

export class VEngineTsxFactory<T> {

    private static components:Record<number, BaseTsxComponent> = {};

    public static createElement(
        item:string|((props:Record<string, any>)=>VirtualNode)|{new: BaseTsxComponent},
        // eslint-disable-next-line @typescript-eslint/ban-types
        props:Record<string, any>|null,
        ...children: VirtualNode[]
    ):VirtualNode{
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
            if (VEngineTsxFactory.components[props.__id]) {
                const instance = VEngineTsxFactory.components[props.__id];
                (instance as any).props = props;
                return instance.render();
            } else {
                const instance = new (item as any)(props) as BaseTsxComponent;
                VEngineTsxFactory.components[props.__id] = instance;
                const node = instance.render();
                node.parentComponent = instance;
                instance.onMounted();
                return node;
            }

        }
        else if ((item as (props:Record<string, any>)=>VirtualNode).call!==undefined) {
            return (item as (arg:any)=>VirtualNode)(propsFull);
        }
        else return new VirtualNode(propsFull, item as string, flattenedNoFragments);
    }

    public static destroyElement(el:VirtualNode) {
        if (this.components[el.props.__id]) {
            delete VEngineTsxFactory.components[el.props.__id];
        }
        el.children.forEach(it=>this.destroyElement(el));
    }

    public static createFragment({children}:{children: VirtualNode[]}):VirtualFragment {
        return new VirtualFragment(children);
    }

}

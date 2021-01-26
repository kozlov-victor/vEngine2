import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {VirtualFragment} from "@engine/renderable/tsx/genetic/virtualFragment";

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


    public static createElement(
        item:string|((props:Record<string, any>)=>VirtualNode),
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

        if ((item as (props:Record<string, any>)=>VirtualNode).call!==undefined) {
            return (item as (arg:any)=>VirtualNode)(propsFull);
        }
        return new VirtualNode(propsFull, item as string, flattenedNoFragments);
    }

    public static createFragment({children}:{children: VirtualNode[]}):VirtualFragment {
        return new VirtualFragment(children);
    }

}

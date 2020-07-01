import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";

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


    public static createElement(item:string|((props:Record<string, any>)=>VirtualNode), props:Record<string, any>|null,...children: VirtualNode[]):VirtualNode{
        if (props===null) props = {};
        if ((item as (props:Record<string, any>)=>VirtualNode).call!==undefined) {
            return (item as (arg:any)=>VirtualNode)(props);
        }
        const element:VirtualNode = new VirtualNode(props,item as string);
        element.children =
            flattenDeep(children). // flat
            map((it,i)=>{
                if ((it as unknown as string)?.substr!==undefined || (it as unknown as number)?.toFixed!==undefined) {
                    const textNode = new VirtualNode({}, undefined!);
                    textNode.text = String(it);
                    return textNode;
                } else return it;
            }).filter(it=>!!it); // remove null, false and undefined
        return element;
    }

}

import {IRealNode} from "@engine/renderable/tsx/realNode";
import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";


export class VirtualNode {

    public children:VirtualNode[];

    constructor(
        public props: Record<string, any>,
        public elementConstructor: {type:'component',ctor:{new():VEngineTsxComponent<any>}} | {type: 'node', ctor:{new(...args:any[]):(IRealNode)}}
        ) {

    }
}

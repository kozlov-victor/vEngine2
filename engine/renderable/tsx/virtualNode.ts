import {IRealNode} from "@engine/renderable/tsx/realNode";
import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";


export class VirtualNode {

    public children:VirtualNode[];
    public index:number = 0;
    public key:number|string;
    public lastComponentInstance:VEngineTsxComponent<any>;

    constructor(
        public props: Record<string, any>,
        public elementConstructor: {type:'component',ctor:{new():VEngineTsxComponent<any>}} | {type: 'node', ctor:{new(...args:any[]):(IRealNode)}}
        ) {
            this.key = props.key;
    }
}

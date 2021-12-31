import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {BaseTsxComponent} from "@engine/renderable/tsx/genetic/baseTsxComponent";

export class VirtualNode implements INode{

    public index:number = 0;
    public loopIndex:number = undefined!;
    public text:string;
    public type:'virtualNode'|'virtualFragment' = 'virtualNode';
    public parentComponent:BaseTsxComponent;

    constructor(
        public readonly props: Readonly<Record<string, any>>,
        public readonly tagName:string,
        public readonly children:VirtualNode[],
    ) {}
}

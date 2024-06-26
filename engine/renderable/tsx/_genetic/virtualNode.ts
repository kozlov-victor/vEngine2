import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";

export interface IBaseProps {
    __id?:number;
}

export class VirtualNode implements INode, JSX.Element {

    public index:number = 0;
    public loopIndex:number = undefined!;
    public text:string;
    public type:'virtualNode'|'virtualFragment' = 'virtualNode';
    public parentComponent:BaseTsxComponent;
    public shouldBeMounted = false;

    constructor(
        public readonly props: Readonly<Record<string, any>>,
        public readonly tagName:string,
        public readonly children:VirtualNode[],
    ) {}
}

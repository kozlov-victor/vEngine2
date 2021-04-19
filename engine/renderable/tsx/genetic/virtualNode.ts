
export class VirtualNode implements INode{

    public index:number = 0;
    public loopIndex:number = undefined!;
    public text:string;
    public type:'virtualNode'|'virtualFragment' = 'virtualNode';

    constructor(
        public readonly props: Readonly<Record<string, any>>,
        public readonly tagName:string,
        public readonly children:VirtualNode[],
    ) {}
}

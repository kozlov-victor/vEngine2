export class VirtualNode {

    public children:VirtualNode[];
    public index:number = 0;
    public loopIndex:number = undefined!;
    public text:string;
    public type:'virtualNode' = 'virtualNode';

    constructor(
        public props: Record<string, any>,
        public readonly tagName:string) {}
}

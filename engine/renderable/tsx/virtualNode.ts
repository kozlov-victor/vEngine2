export class VirtualNode {

    public children:VirtualNode[];

    constructor(public props: Record<string, any>,public elementConstructor: any) {

    }
}

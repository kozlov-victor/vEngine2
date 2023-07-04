import {VirtualNode} from "@engine/renderable/tsx/_genetic/virtualNode";

export class VirtualFragment implements JSX.Element{

    public type = 'virtualFragment' as const;

    constructor(public readonly children:VirtualNode[]) {}

}

import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";

export class VirtualFragment {

    public type = 'virtualFragment' as const;

    constructor(public readonly children:VirtualNode[]) {}

}

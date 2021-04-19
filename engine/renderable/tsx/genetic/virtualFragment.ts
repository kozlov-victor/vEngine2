import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";

export class VirtualFragment {

    public type:'virtualFragment' = 'virtualFragment';

    constructor(public readonly children:VirtualNode[]) {}

}

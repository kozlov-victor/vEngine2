import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";

export class VirtualFragment {

    public type:string = 'virtualFragment';

    constructor(public readonly children:VirtualNode[]) {}

}

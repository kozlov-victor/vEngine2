import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";

export abstract class BaseTsxComponent {

    public static __VEngineTsxComponent = true as const;

    public abstract render():VirtualNode;
    public onMounted() {}
}

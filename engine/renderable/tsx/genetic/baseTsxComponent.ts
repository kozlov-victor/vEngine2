import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";

export abstract class BaseTsxComponent implements JSX.Element {

    public static __VEngineTsxComponent = true as const;

    public abstract render():JSX.Element;
    public onMounted() {}
}

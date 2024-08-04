import {BaseTsxComponent} from "@engine/renderable/tsx/base/baseTsxComponent";

export interface IBaseProps {
    __id?:number;
}

export class VirtualNode implements INode, JSX.Element {

    public index:number = 0;
    public loopIndex:number = undefined!;
    public type = 'virtualNode' as const;
    public parentComponent:BaseTsxComponent;

    constructor(
        public readonly props: Readonly<Record<string, any>>,
        public readonly tagName:string,
        public readonly children:VirtualNode[] = [],
    ) {}
}

export class VirtualTextNode extends VirtualNode {

    public text: string;

    constructor(text:string) {
        super({children: undefined!}, undefined!,undefined!);
        this.text = text;
    }
}

export class VirtualCommentNode extends VirtualNode {

    public comment: string;

    constructor(props: Readonly<Record<string, any>>, comment:string) {
        super(props, undefined!,undefined!);
        this.comment = comment;
    }
}

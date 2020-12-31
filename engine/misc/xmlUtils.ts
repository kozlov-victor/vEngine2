import {ICloneable, Optional} from "@engine/core/declarations";

export interface IElementDescription {
    tagName:string;
    attributes:Record<string,string>;
    children:IElementDescription[];
}

// tslint:disable-next-line:no-empty-interface
export interface IDocumentDescription extends IElementDescription {}

export class Element implements ICloneable<Element>{

    public readonly children:Element[] = [];
    public readonly parent:Element = undefined!;

    public readonly tagName:string;
    public attributes:Record<string,string> = {};

    protected static fromData(data:IElementDescription):Element{
        const el:Element = new Element();
        (el as {tagName:string}).tagName = data.tagName;
        el.attributes = data.attributes ?? {};
        if (data.children) data.children.forEach((c:IElementDescription) => {
            const child:Element = Element.fromData(c);
            (child as {parent:Element}).parent = el;
            el.children.push(child);
        });
        return el;
    }

    private static visitAll(children:Element[],onVisited:(c:Element)=>void):void{
        children.forEach((c:Element)=>{
            onVisited(c);
            Element.visitAll(c.children,onVisited);
        });
    }

    public getElementById(id:string):Optional<Element>{
        let el:Optional<Element>;
        Element.visitAll(this.children,(current:Element)=>{
            if (current.attributes.id===id) el = current;
        });
        if (el===undefined) return undefined;
        else return el;
    }

    public getElementsByTagName(tagName:string):Element[]{
        const arr:Element[] = [];
        Element.visitAll(this.children,(current:Element)=>{
            if (current.tagName===tagName) arr.push(current);
        });
        return arr;
    }

    public querySelector(path:string):Element{
        return this.getElementsByTagName(path)[0];
    }

    public querySelectorAll(path:string):Element[]{
        return this.getElementsByTagName(path);
    }

    public getAttribute(name:string):string {
        return this.attributes[name];
    }

    public clone():Element {
        const el = new Element();
        this.children.forEach(c=>{
            const clonedChild = c.clone();
            (clonedChild as {parent:Element}).parent = el;
            (el as {children:Element[]}).children.push(clonedChild);
        });
        (el as {tagName:string}).tagName = this.tagName;
        el.attributes = {...this.attributes};
        return el;
    }
}

export class Document extends Element {

    public static create(desc:IElementDescription):Document{
        return Element.fromData(desc);
    }

    private constructor(){
        super();
    }

}

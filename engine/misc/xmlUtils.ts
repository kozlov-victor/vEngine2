import {ICloneable, Optional} from "@engine/core/declarations";

export interface IElementDescription {
    tagName:string;
    attributes:Record<string,string>;
    children:IElementDescription[];
}

// tslint:disable-next-line:no-empty-interface
export interface IDocumentDescription extends IElementDescription {}

export class XmlElement implements ICloneable<XmlElement>{

    public readonly children:XmlElement[] = [];
    public readonly parent:XmlElement = undefined!;

    public readonly tagName:string;
    private attributes:Record<string,string> = {};

    protected static fromData(data:IElementDescription):XmlElement{
        const el:XmlElement = new XmlElement();
        (el as {tagName:string}).tagName = data.tagName;
        el.attributes = data.attributes ?? {};
        if (data.children) data.children.forEach((c:IElementDescription) => {
            const child:XmlElement = XmlElement.fromData(c);
            (child as {parent:XmlElement}).parent = el;
            el.children.push(child);
        });
        return el;
    }

    private static visitAll(children:XmlElement[], onVisited:(c:XmlElement)=>void):void{
        children.forEach((c:XmlElement)=>{
            onVisited(c);
            XmlElement.visitAll(c.children,onVisited);
        });
    }

    public getElementById(id:string):Optional<XmlElement>{
        let el:Optional<XmlElement>;
        XmlElement.visitAll(this.children,(current:XmlElement)=>{
            if (current.attributes.id===id) el = current;
        });
        if (el===undefined) return undefined;
        else return el;
    }

    public getElementsByTagName(tagName:string):XmlElement[]{
        const arr:XmlElement[] = [];
        XmlElement.visitAll(this.children,(current:XmlElement)=>{
            if (current.tagName===tagName) arr.push(current);
        });
        return arr;
    }

    public querySelector(path:string):XmlElement{
        return this.getElementsByTagName(path)[0];
    }

    public querySelectorAll(path:string):XmlElement[]{
        return this.getElementsByTagName(path);
    }

    public getAttribute(name:string):string {
        return this.attributes[name];
    }

    public getAttributes():Readonly<Record<string, string>> {
        return {...this.attributes};
    }

    public setAttribute(name:string,value:string|number):void {
        this.attributes[name] = value.toString();
    }

    public clone():XmlElement {
        const el = new XmlElement();
        this.children.forEach(c=>{
            const clonedChild = c.clone();
            (clonedChild as {parent:XmlElement}).parent = el;
            (el as {children:XmlElement[]}).children.push(clonedChild);
        });
        (el as {tagName:string}).tagName = this.tagName;
        el.attributes = {...this.attributes};
        return el;
    }
}

export class XmlDocument extends XmlElement {

    public static create(desc:IElementDescription):XmlDocument{
        return XmlElement.fromData(desc);
    }

    private constructor(){
        super();
    }

}

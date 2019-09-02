
import * as docDesc from './scenes.xml';

export interface IElementDescription {
    tagName:string;
    attributes:Record<string,string>;
    children:IElementDescription[];
}

export class Element  {

    protected static fromData(data:IElementDescription):Element{
        const el:Element = new Element();
        el.tagName = data.tagName;
        el.attributes = data.attributes;
        el.children = [];
        if (data.children) data.children.forEach((c:IElementDescription) => {
            el.children.push(Element.fromData(c));
        });
        return el;
    }

    private static visitAll(children:Element[],onVisited:(c:Element)=>void){
        children.forEach((c:Element)=>{
            onVisited(c);
            Element.visitAll(c.children,onVisited);
        });
    }

    public children:Element[];

    public tagName:string;
    public attributes:Record<string,string> = {};

    public getElementById(id:string):Element|null{
        let el:Element|null = null;
        Element.visitAll(this.children,(current:Element)=>{
            if (current.attributes.id===id) el = current;
        });
        if (el===null) return null;
        return Element.fromData(el);
    }

    public getElementsByTagName(tagName:string):Element[]{
        const arr:Element[] = [];
        Element.visitAll(this.children,(current:Element)=>{
            if (current.tagName===tagName) arr.push(current);
        });
        return arr;
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

export abstract class AssetsDocumentHolder {

    public static getDocument():Document {
        if (AssetsDocumentHolder.document===undefined) {
            AssetsDocumentHolder.document = Document.create(docDesc);
        }
        return AssetsDocumentHolder.document;
    }

    private static document:Document;

    private constructor(){

    }

}
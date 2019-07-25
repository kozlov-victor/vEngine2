
import * as docDesc from './scenes.xml';

export interface IElement {
    tagName:string;
    attributes:Record<string,string>;
    children:IElement[];
}

export class Element implements IElement {

    private static visitAll(children:IElement[],onVisited:(c:IElement)=>void){
        children.forEach((c:IElement)=>{
            onVisited(c);
            Element.visitAll(c.children,onVisited);
        });
    }

    private static fromData(data:IElement):Element{
        const el:Element = new Element();
        el.tagName = data.tagName;
        el.attributes = data.attributes;
        el.children = data.children;
        return el;
    }

    public tagName:string;
    public attributes:Record<string,string> = {};
    public children:IElement[] = [];

    public getElementById(id:string):Element|null{
        let el:IElement = null;
        Element.visitAll(this.children,(current:IElement)=>{
            if (current.attributes.id===id) el = current;
        });
        if (el===null) return null;
        return Element.fromData(el);
    }

    public getElementsByTagName(tagName:string):Element[]{
        const arr:Element[] = [];
        Element.visitAll(this.children,(current:IElement)=>{
            if (current.tagName===tagName) arr.push(Element.fromData(current));
        });
        return arr;
    }


}


export class Document extends Element {

    constructor(public children:IElement[]){
        super();
    }

}

export abstract class AssetsDocumentHolder {

    public static getDocument():Document {
        if (AssetsDocumentHolder.document===undefined) {
            AssetsDocumentHolder.document = new Document(docDesc.children as IElement[]);
        }
        return AssetsDocumentHolder.document;
    }

    private static document:Document;

    private constructor(){

    }

}
import {ICloneable, Optional} from "@engine/core/declarations";

export interface IXmlNode {
    tagName:string;
    attributes: Record<string, string>;
    children:(IXmlNode|IXmlTextNode)[];
}

export interface IXmlTextNode {
    data: string;
}

export class XmlNode implements IXmlNode, ICloneable<XmlNode> {

    public tagName: string;
    public attributes: Record<string, string> = {};
    public children:(XmlNode|IXmlTextNode)[] = [];
    public parent:XmlNode;

    private static visitAll(element:XmlNode,onVisited:(c:XmlNode)=>boolean):void{
        if (onVisited(element)) return;
        for (const c of element.children) {
            if (!(c instanceof XmlNode)) continue;
            this.visitAll(c,onVisited);
        }
    }

    public getElementById(id:string):Optional<XmlNode>{
        let el:Optional<XmlNode>;
        XmlNode.visitAll(this,(current:XmlNode):boolean=>{
            if (current.attributes.id===id) {
                el = current;
                return true;
            }
            return false;
        });
        return el;
    }

    public getChildNodes():XmlNode[]{
        return this.children.filter(it=>it instanceof XmlNode) as XmlNode[];
    }

    public getElementsByTagName(tagName:string):XmlNode[]{
        const arr:XmlNode[] = [];
        XmlNode.visitAll(this,(current:XmlNode)=>{
            if (current.tagName===tagName) arr.push(current);
            return false;
        });
        return arr;
    }

    private getFirstElementByTagName(tagName:string):Optional<XmlNode>{
        let result:Optional<XmlNode>;
        XmlNode.visitAll(this,(current:XmlNode)=>{
            if (current.tagName===tagName) {
                result = current;
                return true;
            }
            return false;
        });
        return result;
    }

    public querySelector(path:string):XmlNode{
        return this.getFirstElementByTagName(path)!;
    }

    public querySelectorAll(path:string):XmlNode[]{
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

    public toJSON():IXmlNode {
        const res:IXmlNode = {tagName:this.tagName,attributes:{...this.attributes},children:[]};
        for (const c of this.children) {
            if (c instanceof XmlNode) res.children.push(c.toJSON());
            else res.children.push({data:c.data});
        }
        return res;
    }

    public fromJSON(obj:IXmlNode):void {
        this.tagName = obj.tagName;
        this.attributes = obj.attributes;
        this.children = [];
        for (const c of obj.children) {
            if ((c as IXmlTextNode).data!==undefined) this.children.push(c as IXmlTextNode);
            else {
                const cNode:IXmlNode = c as IXmlNode;
                const childNode = new XmlNode();
                childNode.fromJSON(cNode);
                this.children.push(childNode);
                childNode.parent = this;
            }
        }
    }

    public clone():XmlNode {
        const node:XmlNode = new XmlNode();
        node.fromJSON(this.toJSON());
        return node;
    }

}

export class XmlDocument extends XmlNode {


    public static create(desc:IXmlNode):XmlDocument{
        const doc = new XmlDocument();
        doc.fromJSON(desc);
        return doc;
    }

    private constructor(){
        super();
    }

}

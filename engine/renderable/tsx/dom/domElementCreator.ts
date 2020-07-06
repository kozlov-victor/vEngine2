import {AbstractElementCreator} from "@engine/renderable/tsx/genetic/abstractElementCreator";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/HTMLElementWrap";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";

export class ElementFactory {

    private static instance:ElementFactory = new ElementFactory();

    private elements:(Text|HTMLElement)[] = [];
    private wrappers:HTMLElementWrap[] = [];

    public static getInstance():ElementFactory{
        return ElementFactory.instance;
    }

    public onElementCreated(el:Text|HTMLElement){
        this.elements.push(el);
    }

    public onElementRemoved(el:Text|HTMLElement) {
        const indexOf:number = this.elements.indexOf(el);
        this.elements.splice(indexOf,1);
        this.wrappers.splice(indexOf,1);
    }

    public getWrapByElement(el:Text|HTMLElement):HTMLElementWrap {
        const indexOf:number = this.elements.indexOf(el);
        this.wrappers[indexOf] = this.wrappers[indexOf] || new HTMLElementWrap(el);
        return this.wrappers[indexOf];
    }

}

export class DomElementCreator extends AbstractElementCreator<HTMLElementWrap>{

    constructor() {
        super();
    }

    createElementByTagName(node:VirtualNode): HTMLElementWrap {
        let htmlNode:Text|HTMLElement;
        if (node.tagName===undefined) {
            htmlNode = document.createTextNode(node.text);
        } else {
            htmlNode = document.createElement(node.tagName);
        }
        ElementFactory.getInstance().onElementCreated(htmlNode);
        return new HTMLElementWrap(htmlNode);
    }

    setProps(model: HTMLElementWrap, virtualNode:VirtualNode): void {
        const props = virtualNode.props;
        const el = model.htmlElement;
        if (virtualNode.props.ref!==undefined) virtualNode.props.ref(el);
        if (el.nodeType===3) {
            if (virtualNode.text!==model.attributes.text) {
                model.attributes.text = virtualNode.text;
                (el as Text).data = virtualNode.text;
            }
        } else {
            const htmlEl:HTMLElement = el as HTMLElement;
            for (const key of Object.keys(props)) {
                if (key.indexOf('on')===0) {// events
                    (htmlEl as Record<string, any>)[key] = props[key];
                }
                else if (model.attributes[key]!==props[key]) {
                    model.attributes[key] = props[key];
                    let attrName = key.toLowerCase();
                    if (key==='htmlFor') attrName = 'for';
                    else if (key==='className') attrName = 'class';
                    const value = props[key];
                    if (value===null || value===undefined) htmlEl.removeAttribute(attrName);
                    else htmlEl.setAttribute(attrName,props[key]);
                }
            }

        }
    }


}

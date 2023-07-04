import {AbstractElementCreator} from "@engine/renderable/tsx/_genetic/abstractElementCreator";
import {VirtualNode} from "@engine/renderable/tsx/_genetic/virtualNode";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/internal/HTMLElementWrap";

const ELEMENT_PROPERTIES = ['value','checked','selected','focus','disabled','readonly'];
const SPECIAL_ATTRIBUTES = ['children','__id'];
const svgTags = ['svg','g','rect','path','circle','line'];

export class ElementFactory {

    private static instance:ElementFactory = new ElementFactory();

    private elements:(Text|HTMLElement|SVGElement)[] = [];
    private wrappers:HTMLElementWrap[] = [];

    public static getInstance():ElementFactory{
        return ElementFactory.instance;
    }

    public onElementCreated(el:Text|HTMLElement|SVGElement):void{
        this.elements.push(el);
    }

    public onElementRemoved(el:Text|HTMLElement|SVGElement):void {
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
        let htmlNode:Text|HTMLElement|SVGElement;
        if (node.tagName===undefined) {
            htmlNode = document.createTextNode(node.text);
        } else {
            if (svgTags.indexOf(node.tagName)>-1) {
                htmlNode = document.createElementNS('http://www.w3.org/2000/svg',node.tagName);
            }
            else htmlNode = document.createElement(node.tagName);
        }
        ElementFactory.getInstance().onElementCreated(htmlNode);
        return new HTMLElementWrap(htmlNode);
    }

    setProps(model: HTMLElementWrap, virtualNode:VirtualNode): void {
        const props = virtualNode.props;
        const el = model.htmlElement;
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
                    let attrName = key;
                    if (SPECIAL_ATTRIBUTES.indexOf(attrName)>-1) continue;
                    if (attrName==='style') {
                        const styleDeclarationNew = props[key];
                        if (styleDeclarationNew?.substr) {
                            htmlEl.setAttribute('style',styleDeclarationNew);
                        } else {
                            const styleDeclarationOld = virtualNode.props.style;
                            Object.keys(styleDeclarationNew).forEach(k=>(htmlEl.style as any)[k]=styleDeclarationNew[k]);
                            Object.keys(styleDeclarationOld).forEach(k=>{
                                if (styleDeclarationNew[k]===undefined) (htmlEl.style as any)[k]=undefined;
                            });
                        }
                        continue;
                    }

                    if (key==='htmlFor') attrName = 'for';
                    else if (key==='className') attrName = 'class';
                    else if (key==='ref') {
                        virtualNode.props.ref(el);
                        continue;
                    }

                    if (ELEMENT_PROPERTIES.indexOf(key)>-1) { // property
                        (htmlEl as any)[key] = props[key];
                    } else { // attribute
                        const value = props[key];
                        if (value===null || value===undefined) htmlEl.removeAttribute(attrName);
                        else htmlEl.setAttribute(attrName,props[key]);
                    }

                }
            }

        }
    }


}

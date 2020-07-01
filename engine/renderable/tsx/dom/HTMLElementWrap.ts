import {IRealNode} from "@engine/renderable/tsx/genetic/realNode";
import {ElementFactory} from "@engine/renderable/tsx/dom/domElementCreator";


export class HTMLElementWrap implements IRealNode {

    public readonly attributes:Record<string, any> = {};

    constructor(public readonly htmlElement:HTMLElement|Text) {
    }

    appendChild(child: HTMLElementWrap): void {
        if ((this.htmlElement as any).styleSheet && !(this.htmlElement as any).sheet) { // ie8
            (this.htmlElement as any).styleSheet.cssText=(child.htmlElement as any).data;
        }
        else this.htmlElement.appendChild(child.htmlElement);
    }

    removeSelf(): void {
        this.htmlElement.parentNode!.removeChild(this.htmlElement);
        ElementFactory.getInstance().onElementRemoved(this.htmlElement);
    }

    replaceChild(oldNode: HTMLElementWrap, newNode: HTMLElementWrap): void {
        ElementFactory.getInstance().onElementRemoved(oldNode.htmlElement);
        this.htmlElement.replaceChild(newNode.htmlElement,oldNode.htmlElement);
    }

    getChildAt(index:number):HTMLElementWrap{
        if (this.htmlElement.nodeType===3) return undefined!;
        return wrap(this.htmlElement.childNodes[index] as HTMLElement);
    }

    getChildren(): HTMLElementWrap[] {
        const arr:HTMLElementWrap[] = [];
        if (this.htmlElement.nodeType===3) return arr;
        for (let i:number=0,l:number=this.htmlElement.childNodes.length;i<l;i++) {
            const c = this.htmlElement.childNodes[i];
            arr.push(wrap(c as HTMLElement));
        }
        return arr;
    }

    getParentNode(): IRealNode {
        return wrap(this.htmlElement.parentElement as HTMLElement);
    }

    removeChildren(): void {
        if (this.htmlElement.nodeType===3) {
            (this.htmlElement as Text).data = '';
        }
        (this.htmlElement as HTMLElement).innerHTML = '';
    }


}

const wrap = (htmlElement: HTMLElement):HTMLElementWrap=>{
    return ElementFactory.getInstance().getWrapByElement(htmlElement);
};

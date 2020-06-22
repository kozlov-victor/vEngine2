import {IRealNode} from "@engine/renderable/tsx/genetic/realNode";

export class HTMLElementWrap implements IRealNode {

    constructor(public readonly htmlElement:HTMLElement) {
    }

    appendChild(child: HTMLElementWrap): void {
        this.htmlElement.appendChild(child.htmlElement);
    }

    removeSelf(): void {
        this.htmlElement.parentNode!.removeChild(this.htmlElement);
    }

    replaceChild(oldNode: HTMLElementWrap, newNode: HTMLElementWrap): void {
        this.htmlElement.replaceChild(newNode.htmlElement,oldNode.htmlElement);
    }

    getChildAt(index:number):HTMLElementWrap{
        return new HTMLElementWrap(this.htmlElement.childNodes.item(index) as HTMLElement);
    }

    getChildren(): HTMLElementWrap[] {
        const arr:HTMLElementWrap[] = [];
        this.htmlElement.childNodes.forEach(c=>{
            arr.push(new HTMLElementWrap(c as HTMLElement));
        });
        return arr;
    }

    getParentNode(): IRealNode {
        return new HTMLElementWrap(this.htmlElement.parentElement as HTMLElement);
    }

    removeChildren(): void {
        this.htmlElement.innerHTML = '';
    }



}

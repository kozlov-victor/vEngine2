import {AbstractElementCreator} from "@engine/renderable/tsx/genetic/abstractElementCreator";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/HTMLElementWrap";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";

export class DomElementCreator extends AbstractElementCreator<HTMLElementWrap>{

    constructor() {
        super();
    }

    createElementByTagName(tagName: string): HTMLElementWrap {
        return new HTMLElementWrap(document.createElement(tagName));
    }

    setProps(model: HTMLElementWrap, virtualNode:VirtualNode): void {
        const props = virtualNode.props;
        const el = model.htmlElement;
        if (props.click) {
            el.onclick = props.click;
        }
        if (virtualNode.text) el.textContent = virtualNode.text;
    }


}

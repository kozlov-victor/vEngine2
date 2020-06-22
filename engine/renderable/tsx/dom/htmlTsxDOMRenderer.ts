import {AbstractTsxDOMRenderer} from "@engine/renderable/tsx/genetic/abstractTsxDOMRenderer";
import {DomElementCreator} from "@engine/renderable/tsx/dom/domElementCreator";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/HTMLElementWrap";


export class HtmlTsxDOMRenderer extends AbstractTsxDOMRenderer<HTMLElementWrap> {
    constructor() {
        super(new DomElementCreator());
    }
}

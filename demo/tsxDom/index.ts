import {HTMLElementWrap} from "@engine/renderable/tsx/dom/HTMLElementWrap";
import {Widget} from "./widget";

const widget = new Widget();
widget.mountTo(new HTMLElementWrap(document.body));

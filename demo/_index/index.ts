import {Widget} from "./widget";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/HTMLElementWrap";


new Widget().mountTo(new HTMLElementWrap(document.body));

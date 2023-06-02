import {Widget} from "./widget";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/internal/HTMLElementWrap";


new Widget().mountTo(new HTMLElementWrap(document.body));

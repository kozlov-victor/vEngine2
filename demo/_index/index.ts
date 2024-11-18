import {Widget} from "./widget";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/internal/HTMLElementWrap";

const root = document.getElementById('root')!;
new Widget().mountTo(new HTMLElementWrap(root));

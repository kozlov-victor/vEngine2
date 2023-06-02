
import {Widget} from "./widget";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/internal/HTMLElementWrap";

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const widget = new Widget();
widget.mountTo(new HTMLElementWrap(root));

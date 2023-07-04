import {HTMLElementWrap} from "@engine/renderable/tsx/dom/internal/HTMLElementWrap";
import {BaseWidget} from "./base.widget";



const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const widget = new BaseWidget();
widget.mountTo(new HTMLElementWrap(root));

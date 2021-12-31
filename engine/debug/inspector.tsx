import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/HTMLElementWrap";
import {Game} from "@engine/core/game";

export interface IState {
    test:boolean;
}

const createDraggableElement = ():HTMLDivElement=>{
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.left = '0';
    el.style.top = '0';
    el.style.width = '100px';
    el.style.height = '100px';
    const mouseDownPoint = {x:0,y:0};
    let isMouseDown:boolean = false;
    el.onmousedown = e=>{
        mouseDownPoint.x = e.screenX - parseInt(el.style.left);
        mouseDownPoint.y = e.screenY -  parseInt(el.style.top);
        isMouseDown = true;
        console.log(e,mouseDownPoint);
    };
    document.body.addEventListener('mouseup',e=>{
        isMouseDown = false;
    },true);
    document.body.addEventListener('mousemove',e=>{
        if (!isMouseDown) return;
        el.style.left = `${e.screenX - mouseDownPoint.x}px`;
        el.style.top =  `${e.screenY - mouseDownPoint.y}px`;
    },true);
    return el;
};

const game:Game = (window as any).game;

const NodeWidget = (props:{tagName:string,__id?:number}):VirtualNode=>{
    return (
        <div>{props.tagName}</div>
    );
};

class InspectorWidget extends VEngineTsxComponent{

    constructor() {
        super(new HtmlTsxDOMRenderer());
    }

    render(): VirtualNode {
        return (
            <>
                {game.getCurrentScene().getLayers().map(it=><NodeWidget tagName='layer'/>)}
            </>
        );
    }

}
const draggableElContainer = createDraggableElement();
document.body.appendChild(draggableElContainer);
new InspectorWidget().mountTo(new HTMLElementWrap(draggableElContainer));

console.log(draggableElContainer);

import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/HTMLElementWrap";
import {Game} from "@engine/core/game";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Layer} from "@engine/scene/layer";

export interface IState {
    test:boolean;
}

const createDraggableElement = ():HTMLDivElement=>{
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.left = '0';
    el.style.top = '0';
    el.style.width = '100%';
    el.style.height = '100%';
    const mouseDownPoint = {x:0,y:0};
    let isMouseDown:boolean = false;
    el.onmousedown = e=>{
        mouseDownPoint.x = e.screenX - parseInt(el.style.left);
        mouseDownPoint.y = e.screenY -  parseInt(el.style.top);
        isMouseDown = true;
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

const createCss = (str:string):void=>{
    const style = document.createElement('style');
    style.textContent = str;
    document.head.appendChild(style);
}

const game:Game = (window as any).game;

const stateMap:Record<string, boolean> = {};

const NodeRoot = (props:{__id?:number,nested:boolean,opened:boolean,children?:any[],onClicked:(id:string)=>void}):VirtualNode=>{
    const className = `${props.nested?'nested':'root'} ${props.opened?'active':'inactive'}`;
    return (
        <ul className={className}>
            {props.children}
        </ul>
    );
}

const NodeLeafs = (props:{tagName:string,__id?:number,model:RenderableModel|Layer,onClicked:(id:string)=>void}):VirtualNode=>{
    let opened = stateMap[props.model.id];
    if (props.model.getChildrenCount()===0 && opened===undefined) opened = true;
    opened??=false;
    stateMap[props.model.id] = opened;
    return (
        <li>
            <span onclick={()=>props.onClicked(props.model.id)} className={`caret ${opened?'caret-down':''}`}>{props.tagName}</span>
            {
                (()=>{
                    const arr = [];
                    for (let i=0;i<props.model.getChildrenCount();i++) {
                        const c = props.model.getChildAt(i);
                        arr.push(
                            <NodeRoot nested={true} opened={opened} onClicked={(id)=> props.onClicked(id)}>
                                <NodeLeafs onClicked={(id)=> props.onClicked(id)} tagName={c.constructor.name} model={c}/>
                            </NodeRoot>
                        );
                    }
                    return arr;
                })()
            }
        </li>
    );
};


class InspectorWidget extends VEngineTsxComponent{

    constructor() {
        super(new HtmlTsxDOMRenderer());
    }

    @ReactiveMethod()
    private onClicked(id:string):void {
        stateMap[id]??=false;
        stateMap[id]=!stateMap[id];
    }

    render(): VirtualNode {
        return (
            <NodeRoot nested={false} opened={true} onClicked={(id)=>this.onClicked(id)}>
                {game.getCurrentScene().getLayers().map(l=>
                    <NodeLeafs onClicked={(id)=>this.onClicked(id)} tagName='layer' model={l}/>
                )}
            </NodeRoot>
        );
    }

}

//language=css
createCss(`
    /* Remove default bullets */
        ul {
            list-style-type: none;
        }

        ul.root {
            margin: 0;
            padding: 0;
        }

        /* Hide the nested list */
        ul.nested {
            padding-left: 10px;
        }

        /* Show the nested list when the user clicks on the caret/arrow (with JavaScript) */
        ul.active {
            display: block;
        }

        /* Show the nested list when the user clicks on the caret/arrow (with JavaScript) */
        ul.inactive {
            display: none;
        }

        /* Style the caret/arrow */
        .caret {
            cursor: pointer;
            user-select: none; /* Prevent text selection */
        }

        /* Create the caret/arrow with a unicode, and style it */
        .caret::before {
            content: "\\25B6";
            color: black;
            display: inline-block;
            margin-right: 6px;
        }

        /* Rotate the caret/arrow icon when clicked on (using JavaScript) */
        .caret-down::before {
            transform: rotate(90deg);
        }
`);
const draggableElContainer = createDraggableElement();
document.body.appendChild(draggableElContainer);
new InspectorWidget().mountTo(new HTMLElementWrap(draggableElContainer));

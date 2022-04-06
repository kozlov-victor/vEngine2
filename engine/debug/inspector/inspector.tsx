import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/HTMLElementWrap";
import {Game} from "@engine/core/game";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Layer} from "@engine/scene/layer";
import {createDraggableElement, init} from "@engine/debug/inspector/helpers";


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
                    let tooManyChildrenWarn = false;
                    for (let i=0;i<props.model.getChildrenCount();i++) {
                        if (i>20) {
                            tooManyChildrenWarn = true;
                        }
                        const c = props.model.getChildAt(i);
                        arr.push(
                            <NodeRoot nested={true} opened={opened} onClicked={(id)=> props.onClicked(id)}>
                                <NodeLeafs onClicked={(id)=> props.onClicked(id)} tagName={c.constructor.name} model={c}/>
                                {tooManyChildrenWarn && <div className={'tooManyChildrenWarn'}>too many children...</div>}
                            </NodeRoot>
                        );
                        if (tooManyChildrenWarn) break;
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
        if (!game) return <></>;
        return (
            <NodeRoot nested={false} opened={true} onClicked={(id)=>this.onClicked(id)}>
                {game.getCurrentScene().getLayers().map(l=>
                    <NodeLeafs onClicked={(id)=>this.onClicked(id)} tagName={l.constructor.name} model={l}/>
                )}
            </NodeRoot>
        );
    }

}

init();
const draggableElContainer = createDraggableElement({className:'panel'});
document.body.appendChild(draggableElContainer);
new InspectorWidget().mountTo(new HTMLElementWrap(draggableElContainer));

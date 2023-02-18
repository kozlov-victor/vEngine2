import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";
import {IBaseProps, VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {HtmlTsxDOMRenderer} from "@engine/renderable/tsx/dom/htmlTsxDOMRenderer";
import {VEngineTsxFactory} from "@engine/renderable/tsx/genetic/vEngineTsxFactory.h";
import {HTMLElementWrap} from "@engine/renderable/tsx/dom/HTMLElementWrap";
import {Game} from "@engine/core/game";
import {ReactiveMethod} from "@engine/renderable/tsx/genetic/reactiveMethod";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Layer} from "@engine/scene/layer";
import {createDraggableElement, init} from "@engine/debug/inspector/helpers";
import {isArray, isNumber, isString} from "@engine/misc/object";


const game:Game = (window as any).game;

const stateMap:Record<string, boolean> = {};
let currentModel:RenderableModel|Layer;

const val = (model:any,key:string):string|number|undefined=>{
    const rawVal = model[key];
    if (rawVal===null || rawVal===undefined) return undefined;
    else if (isArray(rawVal)) return undefined;
    else if (rawVal.toJSON!==undefined) {
        const val = rawVal.toJSON();
        return JSON.stringify(val);
    }
    else if (isNumber(rawVal)) return `${rawVal}`;
    else if (isString(rawVal)) return rawVal;
    else if (rawVal===true || rawVal===false) return `${rawVal}`;
    else return undefined;
}

const PropertyPanel = (props:{model:RenderableModel|Layer}&IBaseProps):VirtualNode=>{
    const keyValPair =
        Object.keys(props.model).
        filter(key=>!key.startsWith('_') && !['game'].includes(key)).
        map(key=>({key,val:val(props.model,key)})).
        filter(it=>it.val!==undefined);
    console.log(keyValPair);
    return (
        <div className={'propPanel'}>
            <table>
                {keyValPair.map(kv=>
                    <tr>
                        <td>{kv.key}</td>
                        <td>{kv.val}</td>
                    </tr>
                )}
            </table>
        </div>
    );
}

const NodeRoot = (props:{nested:boolean,opened:boolean,children?:any[]}&IBaseProps):VirtualNode=>{
    const className = `${props.nested?'nested':'root'} ${props.opened?'active':'inactive'}`;
    return (
        <ul className={className}>
            {props.children}
        </ul>
    );
}

const NodeLeafs = (props:{tagName:string,model:RenderableModel|Layer}&IBaseProps):VirtualNode=>{
    let opened = stateMap[props.model.id];
    if (props.model.getChildrenCount()===0 && opened===undefined) opened = true;
    opened??=false;
    stateMap[props.model.id] = opened;
    return (
        <li>
            <span onclick={()=>inspectorWidget.onClicked(props.model)} className={`caret ${opened?'caret-down':''}`}>{props.tagName}</span>
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
                            <NodeRoot nested={true} opened={opened}>
                                <NodeLeafs tagName={c.constructor.name} model={c}/>
                                {tooManyChildrenWarn && <div className={'tooManyChildrenWarn'}>{`too many children (${props.model.getChildrenCount()})...`}</div>}
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

    private _shown:boolean = true;

    constructor() {
        super(new HtmlTsxDOMRenderer());
    }

    render(): VirtualNode {
        if (!game || !this._shown) return <></>;
        return (
            <>
                <div className={'win-header'} >
                    <div className={'reload-btn'} onclick={_=>this.triggerRendering()}>↻</div>
                    <div className={'close-btn'} onclick={_=>this.hide()}>x</div>
                </div>
                <div className={'listWrap'}>
                    <table>
                        <tr>
                            <td style={{verticalAlign:'top'}}>
                                <NodeRoot nested={false} opened={true}>
                                    {game.getCurrentScene().getLayers().map(l=>
                                        <NodeLeafs tagName={l.constructor.name} model={l}/>
                                    )}
                                    {
                                        !game.getCurrentScene().getLayers().length &&
                                        '<'+'empty scene'+'>'
                                    }
                                </NodeRoot>
                            </td>
                            <td style={{verticalAlign:'top'}}>
                                {currentModel && <PropertyPanel model={currentModel}/>}
                            </td>
                        </tr>
                    </table>
                </div>
            </>
        );
    }

    @ReactiveMethod()
    public onClicked(model:RenderableModel|Layer):void {
        const id = model.id;
        currentModel = model;
        stateMap[id]??=false;
        stateMap[id]=!stateMap[id];
    }

    @ReactiveMethod()
    public show():void {
        this._shown = true;
    }

    @ReactiveMethod()
    public hide():void {
        this._shown = false;
    }

}

init();
const draggableElContainer = createDraggableElement({className:'panel'});
document.body.appendChild(draggableElContainer);
const inspectorWidget = new InspectorWidget();
inspectorWidget.mountTo(new HTMLElementWrap(draggableElContainer));
console.log(draggableElContainer);

window.addEventListener('keyup', function callback(e:KeyboardEvent) {
    if (e.ctrlKey && e.code==='KeyI') {
        inspectorWidget.show();
    }
});

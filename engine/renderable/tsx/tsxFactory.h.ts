import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {DebugError} from "@engine/debug/debugError";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Line} from "@engine/renderable/impl/geometry/line";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Image} from "@engine/renderable/impl/general/image";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {VirtualNode} from "@engine/renderable/tsx/virtualNode";
import {VEngineTsxComponent} from "@engine/renderable/tsx/vEngineTsxComponent";

const checkKeyPropertyForNodeInArray = (val:any[]):void=>{
    val.forEach(v=>{
        if (v && v?.props?.key===undefined) {
            throw new DebugError(`tsx element in array or loop must be tracked by "key" property`);
        }
    });
};

const flattenDeep = (arr:any[]):any[]=> {
    return arr.reduce((acc, val) => {
        if (Array.isArray(val)) {
            checkKeyPropertyForNodeInArray(val);
            return acc.concat(flattenDeep(val));
        } else return acc.concat(val);
    }, []);
};

export class VEngineReact {

    public static init(game:Game):void {
        VEngineReact.game = game;
    }

    public static createElement(item:string|{new():VEngineTsxComponent<any>}, props:Record<string, any>|null,...children: VirtualNode[]):VirtualNode|typeof VEngineTsxComponent{
        if (props===null) props = {};
        if ((item as typeof VEngineTsxComponent).bind!==undefined) {
            return new VirtualNode(props,{type:'component',ctor:item as {new():VEngineTsxComponent<any>}});
        }
        let element:VirtualNode;
        switch (item) {
            case 'v_circle':
                element = new VirtualNode(props,{type:'node',ctor:Circle});
                break;
            case 'v_ellipse':
                element = new VirtualNode(props,{type:'node',ctor:Ellipse});
                break;
            case 'v_rectangle':
                element = new VirtualNode(props,{type:'node',ctor:Rectangle});
                break;
            case 'v_line':
                element = new VirtualNode(props,{type:'node',ctor:Line});
                break;
            case 'v_null_game_object':
                element = new VirtualNode(props,{type:'node',ctor:NullGameObject});
                break;
            case 'v_image':
                element = new VirtualNode(props,{type:'node',ctor:Image});
                break;
            default:
                if (DEBUG) throw new DebugError(`unknown jsx tag: ${item}`);
                return undefined!;
        }
        element.children =
            flattenDeep(children). // flat
            map((it,i)=>{
                if (DEBUG && it?.substr) throw new DebugError(`wrong tsx node: "${it}". Text nodes are not supported`);
                if (it) {
                    it.index = i;
                    it.parent = element;
                }
                return it;
            }).
            filter(it=>!!it); // remove null, false and undefined
        return element;
    }

    public static getGame():Game{
        if (DEBUG && !VEngineReact.game) {
            throw new DebugError(`wrong VEngineReact context: VEngineReact.init() not called, or called after VEngineReact.createElement()`);
        }
        return VEngineReact.game;
    }

    private static game:Game;

}

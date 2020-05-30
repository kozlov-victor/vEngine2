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

export interface IElementRef<T> {
    current:T;
}

const flattenDeep = (arr:any[]):any[]=> {
    return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
};

export class VEngineReact {

    public static init(game:Game):void {
        VEngineReact.game = game;
    }

    public static createRef<T extends RenderableModel>():IElementRef<T>{
        return {current:undefined!};
    }

    public static createElement(item:string, props:Record<string, any>,...children: VirtualNode[]):VirtualNode{
        let element:VirtualNode;
        switch (item) {
            case 'v_circle':
                element = new VirtualNode(props,Circle);
                break;
            case 'v_ellipse':
                element = new VirtualNode(props,Ellipse);
                break;
            case 'v_rectangle':
                element = new VirtualNode(props,Rectangle);
                break;
            case 'v_line':
                element = new VirtualNode(props,Line);
                break;
            case 'v_null_game_object':
                element = new VirtualNode(props,NullGameObject);
                break;
            case 'v_image':
                element = new VirtualNode(props,Image);
                break;
            default:
                if (DEBUG) throw new DebugError(`unknown jsx tag: ${item}`);
                return undefined!;
        }
        element.children =
            flattenDeep(children). // flat
            filter(it=>!!it); // remove null, undefined and ''
        return element;
    }

    public static getGame():Game{
        if (DEBUG && !VEngineReact.game) {
            throw new DebugError(`bad VEngineReact context: VEngineReact.init() not called, or called after VEngineReact.createElement()`);
        }
        return VEngineReact.game;
    }

    private static game:Game;

}

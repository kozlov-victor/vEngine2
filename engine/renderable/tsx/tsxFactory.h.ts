import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {DebugError} from "@engine/debug/debugError";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Line} from "@engine/renderable/impl/geometry/line";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Image} from "@engine/renderable/impl/general/image";

export interface IElementRef<T> {
    current:T;
}

export class VEngineReact {

    public static init(game:Game):void {
        VEngineReact.game = game;
    }

    public static createRef<T extends RenderableModel>():IElementRef<T>{
        return {current:undefined!};
    }

    public static createElement(item:string, props:Record<string, any>,...children: RenderableModel[]):RenderableModel{
        VEngineReact.check();
        const game = VEngineReact.game;
        let element:RenderableModel;
        switch (item) {
            case 'v_circle':
                element = new Circle(game);
                break;
            case 'v_ellipse':
                element = new Ellipse(game);
                break;
            case 'v_rectangle':
                element = new Rectangle(game);
                break;
            case 'v_line':
                element = new Line(game);
                break;
            case 'v_null_game_object':
                element = new NullGameObject(game);
                break;
            case 'v_image':
                element = new Image(game);
                break;
            default:
                if (DEBUG) throw new DebugError(`unknown jsx tag: ${item}`);
                return undefined!;
        }
        element.setProps(props);
        VEngineReact.setGenericProps(element,props);
        children.forEach(c=>element.appendChild(c));
        return element;
    }

    private static game:Game;

    private static check(){
        if (!DEBUG) return;
        if (!VEngineReact.game) {
            throw new DebugError(`bad VEngineReact context: VEngineReact.init() not called, or called after VEngineReact.createElement()`);
        }
    }

    private static setGenericProps(model:RenderableModel,props:IGenericProps<unknown>){
        if (props.ref!==undefined) props.ref.current = model;
        if (props.click!==undefined) model.on(MOUSE_EVENTS.click, props.click);
    }
}

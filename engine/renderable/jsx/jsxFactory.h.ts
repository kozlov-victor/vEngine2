import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Color} from "@engine/renderer/common/color";
import {Shape} from "@engine/renderable/abstract/shape";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {DebugError} from "@engine/debug/debugError";

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

    public static createElement(item:string, props:Record<string, any>,...children: any[]):RenderableModel{
        let element:RenderableModel;
        switch (item) {
            case 'v_circle':
                element = VEngineReact.createCircle(props);
                break;
            default:
                return undefined!;
        }
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

    private static setGenericProps(model:RenderableModel,props:IGenericProps<RenderableModel>){
        if (props.ref!==undefined) props.ref.current = model;
        if (props.click!==undefined) model.on(MOUSE_EVENTS.click, props.click);
    }

    private static setTransformableProps(model:RenderableModel,props:ITransformableProps){
        if (props.pos!==undefined) model.pos.set(props.pos);
        if (props.scale!==undefined) model.scale.set(props.scale);
    }

    private static setShapeProps(model:Shape,props:IShapeProps){
        if (props.color!==undefined) model.color.setRGBA(props.color.r,props.color.g,props.color.b,props.color.a);
        if (props.fillColor!==undefined) (model.fillColor as Color).setRGBA(props.fillColor.r,props.fillColor.g,props.fillColor.b,props.fillColor.a);
        if (props.lineWidth!==undefined) model.lineWidth = props.lineWidth;
    }

    private static createCircle(props:Record<string, any>):Circle{
        const circle:Circle = new Circle(VEngineReact.game);
        VEngineReact.check();
        VEngineReact.setGenericProps(circle,props);
        VEngineReact.setTransformableProps(circle,props);
        VEngineReact.setShapeProps(circle,props);
        circle.radius = props.radius;
        (circle.fillColor as Color).setRGBA(props.color.r,props.color.g,props.color.b,props.color.a);
        return circle;
    }
}

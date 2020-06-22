import {AbstractElementCreator} from "@engine/renderable/tsx/genetic/abstractElementCreator";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Line} from "@engine/renderable/impl/geometry/line";
import {NullGameObject} from "@engine/renderable/impl/general/nullGameObject";
import {Image} from "@engine/renderable/impl/general/image";
import {DebugError} from "@engine/debug/debugError";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";

export class VEngineElementCreator extends AbstractElementCreator<RenderableModel>{

    constructor(protected game:Game) {
        super();
    }

    public createElementByTagName(tagName: string): RenderableModel {
        let element:RenderableModel;
        const game:Game = this.game;
        switch (tagName) {
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
                if (DEBUG) throw new DebugError(`unknown jsx tag: ${tagName}`);
                return undefined!;
        }
        return element;
    }

    public setProps(model: RenderableModel, virtualNode: VirtualNode): void {
        const props = virtualNode.props;
        model.setProps(props);
        if (props.click!==undefined) {
            model.off(MOUSE_EVENTS.click);
            model.on(MOUSE_EVENTS.click, props.click);
        }
    }






}

import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Game} from "@engine/core/game";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Color} from "@engine/renderer/common/color";

export class VEngineReact {

    public static init(game:Game):void {
        VEngineReact.game = game;
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

    private static createCircle(props:Record<string, any>):Circle{
        const circle:Circle = new Circle(VEngineReact.game);
        circle.pos.setXY(props.x,props.y);
        circle.radius = props.radius;
        (circle.fillColor as Color).setRGBA(props.color.r,props.color.g,props.color.b,props.color.a);
        return circle;
    }
}

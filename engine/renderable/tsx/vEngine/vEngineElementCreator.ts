import {AbstractElementCreator} from "@engine/renderable/tsx/genetic/abstractElementCreator";
import {RenderableModel} from "@engine/renderable/abstract/renderableModel";
import {Game} from "@engine/core/game";
import {Circle} from "@engine/renderable/impl/geometry/circle";
import {Ellipse} from "@engine/renderable/impl/geometry/ellipse";
import {Rectangle} from "@engine/renderable/impl/geometry/rectangle";
import {Line} from "@engine/renderable/impl/geometry/line";
import {SimpleGameObjectContainer} from "@engine/renderable/impl/general/simpleGameObjectContainer";
import {Image} from "@engine/renderable/impl/general/image";
import {DebugError} from "@engine/debug/debugError";
import {VirtualNode} from "@engine/renderable/tsx/genetic/virtualNode";
import {TextField} from "@engine/renderable/impl/ui/textField/simple/textField";
import {Button} from "@engine/renderable/impl/ui/button/button";
import {ScrollableTextField} from "@engine/renderable/impl/ui/textField/scrollable/scrollableTextField";
import {RichTextField} from "@engine/renderable/impl/ui/textField/rich/richTextField";
import {CheckBox} from "@engine/renderable/impl/ui/toggleButton/checkBox";
import {SelectBox} from "@engine/renderable/impl/ui/selectBox/selectBox";
import {RadioButton} from "@engine/renderable/impl/ui/toggleButton/radioButton";
import {ImageButton} from "@engine/renderable/impl/ui/button/imageButton";
import {HorizontalNumericSlider} from "@engine/renderable/impl/ui/numericSlider/horizontalNumericSlider";
import {VerticalNumericSlider} from "@engine/renderable/impl/ui/numericSlider/verticalNumericSlider";

export class VEngineElementCreator extends AbstractElementCreator<RenderableModel>{

    constructor(protected game:Game) {
        super();
    }

    public createElementByTagName(node: VirtualNode): RenderableModel {
        let element:RenderableModel;
        const game:Game = this.game;
        switch (node.tagName) {
            case 'v_textField':
                element = new TextField(game,node.props.font);
                break;
            case 'v_scrollableTextField':
                element = new ScrollableTextField(game,node.props.font);
                break;
            case 'v_richTextField':
                element = new RichTextField(game,node.props.font);
                break;
            case 'v_button':
                element = new Button(game,node.props.font);
                break;
            case 'v_checkBox':
                element = new CheckBox(game);
                break;
            case 'v_selectBox':
                element = new SelectBox(game,node.props.font);
                break;
            case 'v_radioButton':
                element = new RadioButton(game,node.props.radioGroup);
                break;
            case 'v_null_game_object':
                element = new SimpleGameObjectContainer(game);
                break;
            case 'v_image':
                element = new Image(game,node.props.texture);
                break;
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
            case 'v_imageButton':
                element = new ImageButton(game,node.props.imgOn(),node.props.imgOff());
                break;
            case 'v_horizontalNumericSlider':
                element = new HorizontalNumericSlider(game);
                break;
            case 'v_verticalNumericSlider':
                element = new VerticalNumericSlider(game);
                break;
            case undefined: {
                if (DEBUG) throw new DebugError(`text nodes are not supported (${node.text})`);
                return undefined!;
            }
            default:
                if (DEBUG) throw new DebugError(`unknown jsx tag: ${node.tagName}`);
                return undefined!;
        }
        return element!;
    }

    public setProps(model: RenderableModel, virtualNode: VirtualNode): void {
        model.setProps(virtualNode.props);
    }

}

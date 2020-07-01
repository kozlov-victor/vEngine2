import {AbstractRenderer} from "./abstractRenderer";
import {Game} from "../../core/game";


export abstract class AbstractCanvasRenderer extends AbstractRenderer {

    public container:HTMLCanvasElement;

    protected constructor(game:Game) {
        super(game);
        const container:HTMLCanvasElement = document.createElement('canvas');
        document.body.appendChild(container);
        container.setAttribute('width',game.size.width.toString());
        container.setAttribute('height',game.size.height.toString());
        container.ondragstart = (e)=>{
            e.preventDefault();
        };
        this.container = container;
    }

    public abstract setPixelPerfect(mode:boolean):void;

}

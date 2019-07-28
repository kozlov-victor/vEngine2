import {AbstractRenderer} from "./abstractRenderer";
import {Game} from "../../core/game";


export abstract class AbstractCanvasRenderer extends AbstractRenderer {


    protected constructor(game:Game) {
        super(game);
        const container:HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement;
        document.body.appendChild(container);
        container.setAttribute('width',game.width.toString());
        container.setAttribute('height',game.height.toString());
        container.ondragstart = (e)=>{
            e.preventDefault();
        };
        this.container = container;
    }

}
import {AbstractRenderer} from "./abstractRenderer";
import {Game} from "../../core/game";


export abstract class AbstractCanvasRenderer extends AbstractRenderer {

    public container:HTMLCanvasElement;

    protected constructor(game:Game) {
        super(game);
        const canvasElement:HTMLCanvasElement = document.createElement('canvas');
        if (game.rootContainerElement!==undefined) {
            game.rootContainerElement.appendChild(canvasElement);
        } else {
            document.body.appendChild(canvasElement);
        }
        canvasElement.setAttribute('width',game.size.width.toString());
        canvasElement.setAttribute('height',game.size.height.toString());
        canvasElement.ondragstart = (e)=>{
            e.preventDefault();
        };
        this.container = canvasElement;
    }

    public setPixelPerfect(mode:boolean):void {
        this.container.style.imageRendering = mode?'pixelated':'';
    }

}

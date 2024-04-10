import {AbstractRenderer} from "./abstractRenderer";
import {Game} from "../../core/game";


export abstract class AbstractCanvasRenderer extends AbstractRenderer {

    public override container:HTMLCanvasElement;
    private pixelPerfectMode = false;

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
        this.pixelPerfectMode = mode;
        if (mode) {
            this.container.style.cssText += 'image-rendering: optimizeSpeed;' + // FireFox < 6.0
                'image-rendering: -moz-crisp-edges;' + // FireFox
                'image-rendering: -o-crisp-edges;' +  // Opera
                'image-rendering: -webkit-crisp-edges;' + // Chrome
                'image-rendering: crisp-edges;' + // Chrome
                'image-rendering: -webkit-optimize-contrast;' + // Safari
                'image-rendering: pixelated; ' + // Future browsers
                '-ms-interpolation-mode: nearest-neighbor;'; // IE
        } else {
            this.container.style.imageRendering = '';
        }
    }

    public isPixelPerfect() {
        return this.pixelPerfectMode;
    }

}

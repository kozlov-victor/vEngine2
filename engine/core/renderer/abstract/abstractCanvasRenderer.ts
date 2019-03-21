
import {AbstractRenderer} from "./abstractRenderer";
import {Game, SCALE_STRATEGY} from "../../game";
import {GameObject} from "@engine/model/impl/gameObject";


export class AbstractCanvasRenderer extends AbstractRenderer {

    constructor(game:Game) {
        super(game);
        let container = document.createElement('canvas');
        document.body.appendChild(container);
        container.setAttribute('width',game.width.toString());
        container.setAttribute('height',game.height.toString());
        container.ondragstart = (e)=>{
            e.preventDefault();
        };
        this.container = container;
    }


    onResize(){
        let canvas = this.container as HTMLCanvasElement;
        if (this.game.scaleStrategy===SCALE_STRATEGY.NO_SCALE) return;
        else if (this.game.scaleStrategy===SCALE_STRATEGY.STRETCH) {
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            return;
        }
        let canvasRatio = canvas.height / canvas.width;
        let windowRatio = window.innerHeight / window.innerWidth;
        let width;
        let height;

        if (windowRatio < canvasRatio) {
            height = window.innerHeight;
            width = height / canvasRatio;
        } else {
            width = window.innerWidth;
            height = width * canvasRatio;
        }
        this.game.scale.setXY(width / this.game.width, height / this.game.height);
        this.game.pos.setXY(
            (window.innerWidth - width) / 2,
            (window.innerHeight - height) / 2
        );

        this.container.style.width = width + 'px';
        this.container.style.height = height + 'px';
        this.container.style.marginTop = `${this.game.pos.y}px`;
    }

}
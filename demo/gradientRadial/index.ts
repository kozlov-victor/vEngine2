import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game, SCALE_STRATEGY} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";

const htmlContainer = document.createElement('div');
const W = 320;
const H = 240;
htmlContainer.innerHTML = `
    <style>
        .table {
            display: table;
        }
        .row {
            display: table-row;
        }
        .cell {
            display: table-cell;
        }
        #divElement {
            width:${W}px;
            height:${H}px;
        }
    </style>
    <div class="table">
        <div class="row">
            <div class="cell" id="canvasElement"></div>
            <div class="cell">
                <div id="divElement"></div>
            </div>
        </div>
    </div>
`;
document.body.appendChild(htmlContainer);


const game = new Game({width:W,height:H,scaleStrategy: SCALE_STRATEGY.NO_SCALE,containerElement:document.getElementById('canvasElement')!});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





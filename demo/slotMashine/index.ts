import {Scene} from "@engine/model/impl/scene";
import {MainScene} from "./mainScene";
import {Game, SCALE_STRATEGY} from "@engine/game";
import {KeyboardControl} from "@engine/control/keyboardControl";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {Wheel} from "./entities/wheel";
import {DomRenderer} from "@engine/renderer/dom/domRenderer";

const W:number = Wheel.CELL_WIDTH*3+Wheel.CELL_PADDING*2; // 745;
const H:number = 433;
const game:Game = new Game(W,H);
game.scaleStrategy = SCALE_STRATEGY.STRETCH;
game.setRenderer(DomRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
const mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





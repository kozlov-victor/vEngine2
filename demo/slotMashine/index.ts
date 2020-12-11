import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {Game, SCALE_STRATEGY} from "@engine/core/game";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {Wheel} from "./entities/wheel";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";

const W:number = Wheel.CELL_WIDTH*3+Wheel.CELL_PADDING*2; // 745;
const H:number = 433;
const game:Game = new Game({width:W,height:H,scaleStrategy:SCALE_STRATEGY.STRETCH});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
const mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





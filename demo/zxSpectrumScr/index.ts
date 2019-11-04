import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";

export const W = 256;
export const H = 192;
export const BORDER = 10;

const game = new Game({width:W+BORDER*2,height:H+BORDER*2});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





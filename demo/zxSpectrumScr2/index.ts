import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {AbstractCanvasRenderer} from "@engine/renderer/abstract/abstractCanvasRenderer";

export const W = 256;
export const H = 192;
export const BORDER = 10;

const game = new Game({width:W+BORDER*2,height:H+BORDER*2});
game.setRenderer(WebGlRenderer);
//game.getRenderer<AbstractCanvasRenderer>().setPixelPerfect(true);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
const mainScene = new MainScene(game);
game.runScene(mainScene);




import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {MenuScene} from "./menuScene";

const game = new Game({width:640,height:320});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
const menuScene: Scene = new MenuScene(game);
(game.getRenderer() as WebGlRenderer).setPixelPerfect(true);
game.runScene(menuScene);





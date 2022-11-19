import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {MainScene} from "./mainScene";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";


const game = new Game({width:1024, height: 600});
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
game.addControl(KeyboardControl);
game.runScene(new MainScene(game));

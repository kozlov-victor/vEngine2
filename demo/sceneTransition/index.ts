import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";

const game = new Game({width:600,height:800});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
const mainScene: Scene = new MainScene(game);
game.pushScene(mainScene,undefined);





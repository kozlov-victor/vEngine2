import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";

const game = new Game();
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
const mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





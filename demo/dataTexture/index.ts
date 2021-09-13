import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";

const game = new Game({width:128,height:64});
game.setRenderer(WebGlRenderer);
(game.getRenderer() as WebGlRenderer).setPixelPerfect(true);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
const mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





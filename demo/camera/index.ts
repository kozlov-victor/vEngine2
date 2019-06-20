import {Scene} from "@engine/model/impl/general/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {KeyboardControl} from "@engine/control/keyboardControl";
import {GamePadControl} from "@engine/control/gamePadControl";

const game = new Game(800,600);
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
const mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





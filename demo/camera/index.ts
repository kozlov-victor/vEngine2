import {Scene} from "@engine/model/impl/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {KeyboardControl} from "@engine/control/keyboardControl";
import {GamePadControl} from "@engine/control/gamePadControl";

let game = new Game();
game.setRenderer(WebGlRenderer);
game.width = 1200;
game.height = 800;
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
let mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





import {Scene} from "@engine/model/impl/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {Keyboard} from "@engine/control/keyboard";
import {GamePad} from "@engine/control/gamePad";

let game = new Game();
game.setRenderer(WebGlRenderer);
game.addControl(Keyboard);
game.addControl(GamePad);
let mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





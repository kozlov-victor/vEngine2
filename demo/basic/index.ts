
import {Scene} from "@engine/model/impl/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/core/renderer/webGl/webGlRenderer";
import {Keyboard} from "@engine/core/control/keyboard";
import {GamePad} from "@engine/core/control/gamePad";
import {Mouse} from "@engine/core/control/mouse/mouse";

let game = new Game();
game.setRenderer(WebGlRenderer);
game.addControl(Keyboard);
game.addControl(GamePad);
let mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





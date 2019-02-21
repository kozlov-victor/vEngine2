
import {Scene} from "@engine/model/impl/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/core/renderer/webGl/webGlRenderer";
import {Mouse} from "@engine/core/control/mouse/mouse";

let game = new Game();
let mainScene:Scene = new MainScene(game);
game.setRenderer(WebGlRenderer);
game.addControl(Mouse);
game.runScene(mainScene);





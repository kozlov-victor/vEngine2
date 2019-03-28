import {Scene} from "@engine/model/impl/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {Mouse} from "@engine/control/mouse/mouse";

let game = new Game();
let mainScene:Scene = new MainScene(game);
game.setRenderer(WebGlRenderer);
game.addControl(Mouse);
game.runScene(mainScene);





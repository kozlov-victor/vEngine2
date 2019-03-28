import {Scene} from "@engine/model/impl/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";

let game = new Game();
game.setRenderer(WebGlRenderer);
let mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





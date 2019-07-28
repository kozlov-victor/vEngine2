import {Game} from "@engine/core/game";
import {Scene} from "@engine/core/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";

const game = new Game();
game.setRenderer(WebGlRenderer);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





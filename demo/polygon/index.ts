import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";

const game = new Game();
game.setRenderer(WebGlRenderer);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





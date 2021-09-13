import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";

const game = new Game();
game.setRenderer(WebGlRenderer);
const mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





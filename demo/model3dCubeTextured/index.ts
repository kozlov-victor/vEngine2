import {Scene} from "@engine/core/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";

const game = new Game({width:800,height:600});
game.setRenderer(WebGlRenderer);
const mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





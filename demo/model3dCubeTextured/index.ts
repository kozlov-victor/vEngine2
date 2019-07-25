import {Scene} from "@engine/model/impl/general/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";

const game = new Game({width:800,height:600});
game.setRenderer(WebGlRenderer);
const mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





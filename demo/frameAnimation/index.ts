import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";

const game = new Game();
console.log(Game.getInstance());
const mainScene:Scene = new MainScene(game);
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
game.runScene(mainScene);





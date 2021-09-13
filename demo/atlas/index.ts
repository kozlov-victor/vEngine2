import {MouseControl} from "@engine/control/mouse/mouseControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MainScene} from "./mainScene";

const game = new Game();
const mainScene: Scene = new MainScene(game);
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
game.runScene(mainScene);





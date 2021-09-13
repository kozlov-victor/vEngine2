import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {MainScene} from "./mainScene";

const game = new Game({width:800,height:600});
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





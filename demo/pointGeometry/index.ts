import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";

const game = new Game({width:420,height:800});
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
const mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";

const game = new Game({width:640,height:480});
const mainScene:Scene = new MainScene(game);
game.setRenderer(WebGlRenderer);
game.getRenderer<WebGlRenderer>().setPixelPerfect(true);
game.addControl(MouseControl);
game.runScene(mainScene);





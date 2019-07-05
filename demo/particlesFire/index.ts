import {Scene} from "@engine/model/impl/general/scene";
import {MainScene} from "./mainScene";
import {Game, SCALE_STRATEGY} from "@engine/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";

const game = new Game({scaleStrategy:SCALE_STRATEGY.STRETCH});
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
const mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





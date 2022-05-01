import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {Game, SCALE_STRATEGY} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";

const game = new Game({scaleStrategy:SCALE_STRATEGY.STRETCH_CANVAS_TO_SCREEN});
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
const mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





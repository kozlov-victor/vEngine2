import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {Game, SCALE_STRATEGY} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";

const game = new Game({width:240,height:320,scaleStrategy:SCALE_STRATEGY.STRETCH_CANVAS_TO_SCREEN});
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
game.addControl(KeyboardControl);
const mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





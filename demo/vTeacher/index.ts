import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game, SCALE_STRATEGY} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";

const game = new Game({width:1024,height:600,scaleStrategy: SCALE_STRATEGY.FIT});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);



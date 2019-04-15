import {Scene} from "@engine/model/impl/scene";
import {MainScene} from "./mainScene";
import {Game, SCALE_STRATEGY} from "@engine/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {KeyboardControl} from "@engine/control/keyboardControl";

const game:Game = new Game();
game.width = 660;
game.height = 384;
game.scaleStrategy = SCALE_STRATEGY.STRETCH;
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
const mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





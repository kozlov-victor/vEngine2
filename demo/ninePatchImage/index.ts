import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";

const game = new Game({width:800,height:600});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





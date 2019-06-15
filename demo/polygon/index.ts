import {KeyboardControl} from "@engine/control/keyboardControl";
import {Game} from "@engine/game";
import {Scene} from "@engine/model/impl/general/scene";
import {MainScene} from "./mainScene";
import {CanvasRenderer} from "@engine/renderer/canvas/canvasRenderer";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";

const game = new Game();
game.setRenderer(WebGlRenderer);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





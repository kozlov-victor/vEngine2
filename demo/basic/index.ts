import {KeyboardControl} from "@engine/control/keyboardControl";
import {Game} from "@engine/game";
import {Scene} from "@engine/model/impl/scene";
import {MainScene} from "./mainScene";
import {CanvasRenderer} from "@engine/renderer/canvas/canvasRenderer";

const game = new Game();
game.setRenderer(CanvasRenderer);
game.addControl(KeyboardControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





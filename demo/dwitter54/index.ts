import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {CanvasRenderer} from "@engine/renderer/canvas/canvasRenderer";

const game = new Game({width:1920,height:1080});
game.setRenderer(CanvasRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
game.getRenderer<WebGlRenderer>().setPixelPerfect(true);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);



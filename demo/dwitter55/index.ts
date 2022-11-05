import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {CanvasRenderer} from "@engine/renderer/canvas/canvasRenderer";
import {AbstractCanvasRenderer} from "@engine/renderer/abstract/abstractCanvasRenderer";

const game = new Game({width:218,height:140});
game.setRenderer(CanvasRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
game.getRenderer<AbstractCanvasRenderer>().setPixelPerfect(true);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);



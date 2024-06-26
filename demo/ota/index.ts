import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";

const game = new Game({width:800,height:600});
game.setRenderer(WebGlRenderer);
game.getRenderer<WebGlRenderer>().setPixelPerfect(true);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
game.addControl(MouseControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);






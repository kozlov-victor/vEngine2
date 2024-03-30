import {Game} from "@engine/core/game";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {CanvasRenderer} from "@engine/renderer/canvas/canvasRenderer";
import {IntroScene} from "./introScene";
import {ResourceLoader} from "@engine/resources/resourceLoader";

ResourceLoader.BASE_URL = './x0_5/assets';
const game = new Game({width:240,height:320});
game.setRenderer(CanvasRenderer);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
game.addControl(MouseControl);
const scene = new IntroScene(game);
game.runScene(scene);

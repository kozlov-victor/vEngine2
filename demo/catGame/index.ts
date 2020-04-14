import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import * as l1 from './level/l1.json';

const game = new Game({width: 640,height:480});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
game.addControl(MouseControl);
const mainScene: Scene = new MainScene(game,l1);
game.runScene(mainScene);





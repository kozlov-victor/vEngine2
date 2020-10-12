import {MouseControl} from "@engine/control/mouse/mouseControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {GameScene} from "./scenes/gameScene";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {GetReadyScene} from "./scenes/getReadyScene";
import {IntroScene} from "./scenes/introScene";

const game = new Game({width:600,height:460});
//const scene: Scene = new IntroScene(game);
const scene: Scene = new GameScene(game);
game.setRenderer(WebGlRenderer);
game.getRenderer<WebGlRenderer>().setPixelPerfect(true);
game.addControl(MouseControl);
game.addControl(KeyboardControl);
game.runScene(scene);





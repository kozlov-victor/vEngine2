import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {Scene1} from "./scenes/scene1";
import {Scene2} from "./scenes/scene2";
import {Scene3} from "./scenes/scene3";
import {Scene4} from "./scenes/scene4";
import {Scene5} from "./scenes/scene5";

const game = new Game({width:1024,height:600});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
const scene1 = new Scene1(game);
const scene2 = new Scene2(game);
const scene3 = new Scene3(game);
const scene4 = new Scene4(game);
const scene5 = new Scene5(game);
game.runScene(scene1);





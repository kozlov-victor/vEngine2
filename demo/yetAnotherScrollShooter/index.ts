import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {Scene1} from "./scenes/scene1";
import {Scene2} from "./scenes/scene2";

const game = new Game({width:1024,height:600});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
const scene1 = new Scene1(game);
const scene2 = new Scene2(game);
game.runScene(scene2);





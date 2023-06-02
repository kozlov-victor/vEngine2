import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";

ResourceLoader.BASE_URL = './fontTtf3'

const game = new Game({width:800,height:600});
const mainScene:Scene = new MainScene(game);
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
game.addControl(KeyboardControl);
game.runScene(mainScene);








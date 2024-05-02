import {Game} from "@engine/core/game";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";


const game = new Game({width:800,height:600});
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
const mainScene = new MainScene(game);
game.runScene(mainScene);





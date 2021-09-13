import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";

const game = new Game({width:1024,height:1024});
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
const mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





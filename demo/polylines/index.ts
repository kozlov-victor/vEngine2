import {Scene} from "@engine/model/impl/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";

const game = new Game();
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
let mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





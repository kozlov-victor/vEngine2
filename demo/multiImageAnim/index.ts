import {Scene} from "@engine/model/impl/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";

let game = new Game();
console.log(Game.getInstance());
let mainScene:Scene = new MainScene(game);
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
game.runScene(mainScene);





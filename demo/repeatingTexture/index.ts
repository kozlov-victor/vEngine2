
import {Scene} from "@engine/model/impl/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/core/renderer/webGl/webGlRenderer";
import {Keyboard} from "@engine/core/control/keyboard";

let game = new Game();
game.setRenderer(WebGlRenderer);
let mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





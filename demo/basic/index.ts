import {KeyboardControl} from "@engine/control/keyboardControl";
import {Game} from "@engine/game";
import {Scene} from "@engine/model/impl/scene";
import {MainScene} from "./mainScene";
import {DomRenderer} from "@engine/renderer/dom/domRenderer";

const game = new Game();
game.setRenderer(DomRenderer);
game.addControl(KeyboardControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





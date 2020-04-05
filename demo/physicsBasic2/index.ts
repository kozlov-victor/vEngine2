import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/ArcadePhysicsSystem";

const game = new Game();
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
game.setPhysicsSystem(ArcadePhysicsSystem);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





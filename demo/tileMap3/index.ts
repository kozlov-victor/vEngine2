import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";

const game = new Game();
game.setRenderer(WebGlRenderer);
game.getRenderer<WebGlRenderer>().setPixelPerfect(true);
game.addControl(KeyboardControl);
ArcadePhysicsSystem.gravity.setXY(0);
game.setPhysicsSystem(ArcadePhysicsSystem);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





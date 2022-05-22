import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";

const game = new Game({width:800,height:600});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
game.addControl(MouseControl);
game.setPhysicsSystem(ArcadePhysicsSystem);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





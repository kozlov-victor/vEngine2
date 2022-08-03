import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";

ResourceLoader.BASE_URL = './dudeUntitled/assets';
document.body.style.backgroundColor = 'black';

const game = new Game({width:848*2,height:414*2});
game.setPhysicsSystem(ArcadePhysicsSystem);
game.setRenderer(WebGlRenderer);
game.getRenderer<WebGlRenderer>().setPixelPerfect(true);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
game.addControl(MouseControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





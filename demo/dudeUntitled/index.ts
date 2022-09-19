import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game, SCALE_STRATEGY} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {CanvasRenderer} from "@engine/renderer/canvas/canvasRenderer";
import {AbstractCanvasRenderer} from "@engine/renderer/abstract/abstractCanvasRenderer";

// window.requestAnimationFrame =  (f:FrameRequestCallback):number=>{
//     return setTimeout(f,1000/25);
// };

document.body.style.backgroundColor = 'black';
ResourceLoader.BASE_URL = './dudeUntitled/assets';

const game = new Game({width:240,height:320, scaleStrategy: SCALE_STRATEGY.FIT_CANVAS_TO_SCREEN});
ArcadePhysicsSystem.SPATIAL_CELL_SIZE.setWH(128);
game.setPhysicsSystem(ArcadePhysicsSystem);
game.setRenderer(CanvasRenderer);
game.getRenderer<AbstractCanvasRenderer>().setPixelPerfect(true);
game.addControl(KeyboardControl);

game.getControl<GamePadControl>('KeyboardControl')!.reflectToSelf(
    {
        [KEYBOARD_KEY.ENTER]: KEYBOARD_KEY.SPACE,
        [KEYBOARD_KEY.DIGIT_5]: KEYBOARD_KEY.CONTROL,
    }
);

//game.addControl(GamePadControl);
//game.addControl(MouseControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





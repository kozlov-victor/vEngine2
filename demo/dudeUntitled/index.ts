import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game, SCALE_STRATEGY} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {Device} from "@engine/misc/device";
import {DI} from "@engine/core/ioc";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";


document.body.style.backgroundColor = '#052e5b';
ResourceLoader.BASE_URL = './dudeUntitled/assets';
ArcadePhysicsSystem.SPATIAL_CELL_SIZE.setWH(64);

const game = new Game(
    {
        width:600,height:280,
        scaleStrategy: SCALE_STRATEGY.FIT_CANVAS_TO_SCREEN,
        containerElement: Device.embeddedEngine?undefined:document.getElementById('canvas-wrap')!
    }
);
game.setPhysicsSystem(ArcadePhysicsSystem);
game.setRenderer(WebGlRenderer);
game.getRenderer(WebGlRenderer).setPixelPerfect(true);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
game.addControl(GamePadControl);

game.getControl(KeyboardControl).reflectToSelf(
    {
        [KEYBOARD_KEY.ENTER]: KEYBOARD_KEY.SPACE,
        [KEYBOARD_KEY.DIGIT_5]: KEYBOARD_KEY.CONTROL,
        [KEYBOARD_KEY.W]: KEYBOARD_KEY.UP,
        [KEYBOARD_KEY.A]: KEYBOARD_KEY.LEFT,
        [KEYBOARD_KEY.S]: KEYBOARD_KEY.DOWN,
        [KEYBOARD_KEY.D]: KEYBOARD_KEY.RIGHT,
    }
);
game.getControl(GamePadControl).reflectToControl(
    game.getControl(KeyboardControl),
    {
        [GAME_PAD_BUTTON.STICK_L_UP]: KEYBOARD_KEY.UP,
        [GAME_PAD_BUTTON.STICK_L_DOWN]: KEYBOARD_KEY.DOWN,
        [GAME_PAD_BUTTON.STICK_L_LEFT]: KEYBOARD_KEY.LEFT,
        [GAME_PAD_BUTTON.STICK_L_RIGHT]: KEYBOARD_KEY.RIGHT,
        [GAME_PAD_BUTTON.D_PAD_UP]: KEYBOARD_KEY.UP,
        [GAME_PAD_BUTTON.D_PAD_DOWN]: KEYBOARD_KEY.DOWN,
        [GAME_PAD_BUTTON.D_PAD_LEFT]: KEYBOARD_KEY.LEFT,
        [GAME_PAD_BUTTON.D_PAD_RIGHT]: KEYBOARD_KEY.RIGHT,
        [GAME_PAD_BUTTON.BTN_X]: KEYBOARD_KEY.SPACE,
        [GAME_PAD_BUTTON.BTN_Y]: KEYBOARD_KEY.CONTROL,
    }
);
DI.registerInstance(game);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);


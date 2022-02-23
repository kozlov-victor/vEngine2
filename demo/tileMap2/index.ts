import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";

const game = new Game({width:1024,height:600});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
game.addControl(GamePadControl);

game.getControl<GamePadControl>('GamePadControl')!.reflectToControl(
    game.getControl<KeyboardControl>('KeyboardControl')!,
    {
        [GAME_PAD_BUTTON.STICK_L_UP]: KEYBOARD_KEY.UP,
        [GAME_PAD_BUTTON.STICK_L_DOWN]: KEYBOARD_KEY.DOWN,
        [GAME_PAD_BUTTON.STICK_L_LEFT]: KEYBOARD_KEY.LEFT,
        [GAME_PAD_BUTTON.STICK_L_RIGHT]: KEYBOARD_KEY.RIGHT,
        [GAME_PAD_BUTTON.D_PAD_UP]: KEYBOARD_KEY.UP,
        [GAME_PAD_BUTTON.D_PAD_DOWN]: KEYBOARD_KEY.DOWN,
        [GAME_PAD_BUTTON.D_PAD_LEFT]: KEYBOARD_KEY.LEFT,
        [GAME_PAD_BUTTON.D_PAD_RIGHT]: KEYBOARD_KEY.RIGHT,
        [GAME_PAD_BUTTON.BTN_A]: KEYBOARD_KEY.SPACE,
        [GAME_PAD_BUTTON.BTN_B]: KEYBOARD_KEY.SPACE,
        [GAME_PAD_BUTTON.BTN_X]: KEYBOARD_KEY.SPACE,
        [GAME_PAD_BUTTON.BTN_Y]: KEYBOARD_KEY.SPACE,
    }
);

game.getControl<GamePadControl>('KeyboardControl')!.reflectToControl(
    game.getControl<KeyboardControl>('KeyboardControl')!,
    {
        [KEYBOARD_KEY.UP]: KEYBOARD_KEY.SPACE,
    }
);

ArcadePhysicsSystem.gravity.y = 10;
game.setPhysicsSystem(ArcadePhysicsSystem);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);

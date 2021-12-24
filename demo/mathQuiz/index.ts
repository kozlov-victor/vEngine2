import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {CellsAppearingTransition} from "@engine/scene/transition/appear/cells/cellsAppearingTransition";
import {Color} from "@engine/renderer/common/color";
import {SelectLevelScene} from "./scene/selectLevelScene";
import {AudioPlayer} from "@engine/media/audioPlayer";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {GAME_PAD_BUTTON} from "@engine/control/gamepad/gamePadKeys";

const game = new Game({width:1024, height: 600});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);

game.getControl<GamePadControl>('GamePadControl')!.
    reflectToControl(
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
            [GAME_PAD_BUTTON.BTN_A]: KEYBOARD_KEY.ENTER,
            [GAME_PAD_BUTTON.BTN_B]: KEYBOARD_KEY.ENTER,
            [GAME_PAD_BUTTON.BTN_X]: KEYBOARD_KEY.ENTER,
            [GAME_PAD_BUTTON.BTN_Y]: KEYBOARD_KEY.ENTER,
        }
    );


game.addControl(MouseControl);
game.setAudioPLayer(AudioPlayer);
const transition = new CellsAppearingTransition(game);
transition.setBackgroundColor(Color.GREY.clone());
game.runScene(new SelectLevelScene(game),transition);





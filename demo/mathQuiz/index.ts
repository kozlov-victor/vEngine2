import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {CellsAppearingTransition} from "@engine/scene/transition/appear/cells/cellsAppearingTransition";
import {Color} from "@engine/renderer/common/color";
import {SelectLevelScene} from "./scene/selectLevelScene";
import {ResultScene} from "./scene/resultScene";
import {AudioPlayer} from "@engine/media/audioPlayer";

const game = new Game({width:1024, height: 600});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
game.addControl(MouseControl);
game.setAudioPLayer(AudioPlayer);
const transition = new CellsAppearingTransition(game);
transition.setBackgroundColor(Color.GREY.clone());
game.runScene(new SelectLevelScene(game),transition);





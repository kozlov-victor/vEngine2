import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {MkIntroScene} from "./scenes/mkIntroScene";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {AudioPlayer} from "@engine/media/audioPlayer";
import {MkSelectHeroScene} from "./scenes/mkSelectHeroScene";
import {CellsAppearingTransition} from "@engine/scene/transition/appear/cells/cellsAppearingTransition";

const game = new Game({width: 1024,height: 768});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
game.addControl(GamePadControl);
game.setAudioPLayer(AudioPlayer);
game.runScene(new MkIntroScene(game), new CellsAppearingTransition(game));
//game.runScene(new MkSelectHeroScene(game));




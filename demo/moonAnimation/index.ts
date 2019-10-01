import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {Scene} from "@engine/scene/scene";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {AudioPlayer} from "@engine/media/audioPlayer";
import {IntroScene} from "./introScene";

const game = new Game({width:879,height:625});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
game.setAudioPLayer(AudioPlayer);
const mainScene: Scene = new IntroScene(game);
game.runScene(mainScene);





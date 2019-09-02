import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {AudioPlayer} from "@engine/media/audioPlayer";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {PreIntroScene} from "./scene/preIntroScene";

const game = new Game({width:800,height:600});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
game.setAudioPLayer(AudioPlayer);
game.runScene(new PreIntroScene(game));




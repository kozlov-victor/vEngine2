import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import * as l1 from './level/l1.json';
import {AudioPlayer} from "@engine/media/audioPlayer";
import {FREE_AUDIO_NODE_SEARCH_STRATEGY} from "@engine/media/interface/iAudioPlayer";

const game = new Game({width: 640,height:480});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
game.addControl(MouseControl);
game.setAudioPLayer(AudioPlayer);
game.getAudioPlayer().freeNodeSearchStrategy = FREE_AUDIO_NODE_SEARCH_STRATEGY.GET_OLDEST_NOT_LOOP;
const mainScene: Scene = new MainScene(game,l1);
game.runScene(mainScene);





import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {AudioPlayer} from "@engine/media/audioPlayer";
import {FREE_AUDIO_NODE_SEARCH_STRATEGY} from "@engine/media/interface/iAudioPlayer";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/ArcadePhysicsSystem";
import {PreIntroScene} from "./scene/preIntroScene";
import {GameManager} from "./gameManager";

const game = new Game({width: 640,height:480});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
game.addControl(MouseControl);
game.setAudioPLayer(AudioPlayer);
game.getAudioPlayer().freeNodeSearchStrategy = FREE_AUDIO_NODE_SEARCH_STRATEGY.GET_OLDEST_NOT_LOOP;
game.setPhysicsSystem(ArcadePhysicsSystem);
GameManager.instantiate(game);
game.runScene(new PreIntroScene(game));
//game.getRenderer<WebGlRenderer>().setPixelPerfectMode(true);



import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {IntroScene} from "./scenes/introScene";
import {AudioPlayer} from "@engine/media/audioPlayer";

const game = new Game({width:600,height:460});
const scene: Scene = new IntroScene(game);
//const scene: Scene = new GameScene(game);
game.setRenderer(WebGlRenderer);
game.setAudioPLayer(AudioPlayer);
game.getRenderer<WebGlRenderer>().setPixelPerfect(true);
game.addControl(KeyboardControl);
game.runScene(scene);




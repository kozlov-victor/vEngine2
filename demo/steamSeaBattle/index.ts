import {KeyboardControl} from "@engine/control/keyboardControl";
import {Game} from "@engine/game";
import {Scene} from "@engine/model/impl/general/scene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {IntroScene} from "./scene/introScene";
import {MainScene} from "./scene/mainScene";
import {AudioPlayer} from "@engine/media/audioPlayer";
import {MouseControl} from "@engine/control/mouse/mouseControl";

const game = new Game({width:800,height:600});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
game.setAudioPLayer(AudioPlayer);
const introScene: Scene = new IntroScene(game);
game.runScene(introScene);
//game.runScene(new MainScene(game));




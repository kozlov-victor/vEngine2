import {KeyboardControl} from "@engine/control/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/core/scene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {IntroScene} from "./scene/introScene";
import {MainScene} from "./scene/mainScene";
import {AudioPlayer} from "@engine/media/audioPlayer";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {PreIntroScene} from "./scene/preIntroScene";
import {ResultScene} from "./scene/resultScene";

const game = new Game({width:800,height:600});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
game.setAudioPLayer(AudioPlayer);
//game.runScene(new IntroScene(game));
//game.runScene(new MainScene(game));
game.runScene(new PreIntroScene(game));
//game.runScene(new ResultScene(game));




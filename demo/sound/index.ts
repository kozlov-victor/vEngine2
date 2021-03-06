import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {Game} from "@engine/core/game";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {AudioPlayer} from "@engine/media/audioPlayer";

const game = new Game();
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
game.setAudioPLayer(AudioPlayer);
const mainScene:Scene = new MainScene(game);
game.runScene(mainScene);





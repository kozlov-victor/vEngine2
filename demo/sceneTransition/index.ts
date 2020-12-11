import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {FadeInAppearanceTransition} from "@engine/scene/transition/appear/fade/fadeAppearanceTransition";
import {Color} from "@engine/renderer/common/color";

const game = new Game({width:600,height:800});
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(MouseControl);
const mainScene: Scene = new MainScene(game);
const transition = new FadeInAppearanceTransition(game,1000);
transition.setBackgroundColor(Color.RGB(233));
game.runScene(mainScene,transition);





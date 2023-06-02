import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {MainScene} from "./mainScene";
import {AbstractGradient} from "@engine/renderable/impl/fill/abstract/abstractGradient";

AbstractGradient.MAX_NUM_OF_GRADIENT_POINTS = 16;
const game = new Game({width:1024,height:600});
game.setRenderer(WebGlRenderer);
game.addControl(MouseControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/core/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/webGlRenderer";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";

let oneFrameTime:number = 1000;

(window as any).setOneFrameTime = (val:number)=>{
    if (val<17) val = 17;
    oneFrameTime = val;
};

window.requestAnimationFrame =  (f:FrameRequestCallback):number=>{
    return setTimeout(f,oneFrameTime) as any as number;
};

const game = new Game();
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





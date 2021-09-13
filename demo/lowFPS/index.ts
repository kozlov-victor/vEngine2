import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";

let oneFrameTime:number = 1000;

interface IWindowEx extends Window{
    setOneFrameTime(va:number):void;
}

(window as unknown as IWindowEx).setOneFrameTime = (val:number)=>{
    if (val<17) val = 17;
    oneFrameTime = val;
};

window.requestAnimationFrame =  (f:FrameRequestCallback):number=>{
    return setTimeout(f,oneFrameTime);
};

const game = new Game();
game.setRenderer(WebGlRenderer);
game.addControl(KeyboardControl);
game.addControl(GamePadControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





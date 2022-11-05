import {KeyboardControl} from "@engine/control/keyboard/keyboardControl";
import {Game, SCALE_STRATEGY} from "@engine/core/game";
import {Scene} from "@engine/scene/scene";
import {MainScene} from "./mainScene";
import {GamePadControl} from "@engine/control/gamepad/gamePadControl";
import {ResourceLoader} from "@engine/resources/resourceLoader";
import {ArcadePhysicsSystem} from "@engine/physics/arcade/arcadePhysicsSystem";
import {KEYBOARD_KEY} from "@engine/control/keyboard/keyboardKeys";
import {AbstractCanvasRenderer} from "@engine/renderer/abstract/abstractCanvasRenderer";
import {MouseControl} from "@engine/control/mouse/mouseControl";
import {WebGlRenderer} from "@engine/renderer/webGl/renderer/webGlRenderer";
import {CanvasRenderer} from "@engine/renderer/canvas/canvasRenderer";

// window.requestAnimationFrame =  (f:FrameRequestCallback):number=>{
//     return setTimeout(f,1000/25);
// };

// (WebGlRenderer as any).prototype.createTexture = (bitmap:ImageBitmap|HTMLImageElement|HTMLCanvasElement):ITexture=>{
//     const c = document.createElement('canvas');
//     c.width = bitmap.width;
//     c.height = bitmap.height;
//     const ctx = c.getContext('2d')!;
//     ctx.drawImage(bitmap,0,0);
//     const imgData = ctx.getImageData(0,0,bitmap.width,bitmap.height);
//     const dataTexture = new DataTexture(Game.getInstance(),bitmap.width,bitmap.height);
//     dataTexture.setNewData(new Uint8Array(imgData.data.buffer));
//     return dataTexture;
// }

document.body.style.backgroundColor = 'black';
ResourceLoader.BASE_URL = './dudeUntitled/assets';

const game = new Game({width:240,height:320, scaleStrategy: SCALE_STRATEGY.FIT_CANVAS_TO_SCREEN});
ArcadePhysicsSystem.SPATIAL_CELL_SIZE.setWH(64);
game.setPhysicsSystem(ArcadePhysicsSystem);
game.setRenderer(CanvasRenderer);
game.getRenderer<AbstractCanvasRenderer>().setPixelPerfect(true);
game.addControl(KeyboardControl);
game.addControl(MouseControl);

game.getControl<GamePadControl>('KeyboardControl')!.reflectToSelf(
    {
        [KEYBOARD_KEY.ENTER]: KEYBOARD_KEY.SPACE,
        [KEYBOARD_KEY.DIGIT_5]: KEYBOARD_KEY.CONTROL,
        [KEYBOARD_KEY.W]: KEYBOARD_KEY.UP,
        [KEYBOARD_KEY.A]: KEYBOARD_KEY.LEFT,
        [KEYBOARD_KEY.S]: KEYBOARD_KEY.DOWN,
        [KEYBOARD_KEY.D]: KEYBOARD_KEY.RIGHT,
    }
);

//game.addControl(GamePadControl);
//game.addControl(MouseControl);
const mainScene: Scene = new MainScene(game);
game.runScene(mainScene);





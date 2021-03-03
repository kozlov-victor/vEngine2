import {BaseAbstractIntroScene} from "./abstracts/baseAbstractIntroScene";
import {ITexture} from "@engine/renderer/common/texture";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IntroScene} from "./introScene";
import {Resource} from "@engine/resources/resourceDecorators";
import {Sound} from "@engine/media/sound";

export class GameOverScene extends BaseAbstractIntroScene {


    @Resource.Sound('./catGame/res/sound/gameOver.mp3')
    protected soundTheme:Sound;

    @Resource.Texture('./catGame/res/sprite/gameOver.png')
    protected spriteSheetLabel: ITexture;


    protected startSound(): void {
        super.startSound();
        this.soundTheme.loop = false;
    }


    protected listenUI():void {
        this.on(MOUSE_EVENTS.click, e=>{
            this.soundTheme.stop();
            this.camera.shake(5,200);
            this.game.runScene(new IntroScene(this.game));
        });
    }

}

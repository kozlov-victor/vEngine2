import {BaseAbstractIntroScene} from "./abstracts/baseAbstractIntroScene";
import {ITexture} from "@engine/renderer/common/texture";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IntroScene} from "./introScene";
import {Resource} from "@engine/resources/resourceDecorators";
import {Sound} from "@engine/media/sound";

export class WinScene extends BaseAbstractIntroScene {

    @Resource.Sound('./catGame/res/sound/win.mp3')
    public readonly soundTheme: Sound;

    @Resource.Texture('./catGame/res/sprite/win.png')
    public readonly spriteSheetLabel: ITexture;

    protected override startSound(): void {
        super.startSound();
        this.soundTheme.loop = false;
    }

    protected override listenUI():void {
        this.mouseEventHandler.on(MOUSE_EVENTS.click, e=>{
            this.soundTheme.stop();
            this.camera.shake(5,200);
            this.game.runScene(new IntroScene(this.game));
        });
    }

}

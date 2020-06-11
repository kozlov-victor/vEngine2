import {BaseAbstractIntroScene} from "./abstracts/baseAbstractIntroScene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IntroScene} from "./introScene";
import {Resource} from "@engine/resources/resourceDecorators";

export class WinScene extends BaseAbstractIntroScene {

    @Resource.Sound('./catGame/res/sound/win.mp3')
    protected soundThemeRes: ResourceLink<void>;

    @Resource.Texture('./catGame/res/sprite/win.png')
    protected spriteSheetLabel: ResourceLink<ITexture>;

    protected startSound(): void {
        super.startSound();
        this.snd.loop = false;
    }

    protected listenUI():void {
        this.on(MOUSE_EVENTS.click, e=>{
            this.snd.stop();
            this.game.camera.shake(5,200);
            this.game.runScene(new IntroScene(this.game));
        });
    }

}

import {BaseAbstractIntroScene} from "./abstracts/baseAbstractIntroScene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {IntroScene} from "./introScene";

export class WinScene extends BaseAbstractIntroScene {


    protected soundThemeRes: ResourceLink<void>;
    protected spriteSheetLabel: ResourceLink<ITexture>;


    public onPreloading(): void {
        this.soundThemeRes = this.resourceLoader.loadSound('./catGame/res/sound/win.mp3');
        this.spriteSheetLabel = this.resourceLoader.loadTexture('./catGame/res/sprite/win.png');
    }

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

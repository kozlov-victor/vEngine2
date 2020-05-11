import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {BaseAbstractIntroScene} from "./abstracts/baseAbstractIntroScene";
import {GameManager} from "../gameManager";

export class IntroScene extends BaseAbstractIntroScene {

    protected soundThemeRes: ResourceLink<void>;
    protected spriteSheetLabel: ResourceLink<ITexture>;

    public onPreloading(): void {
        this.soundThemeRes = this.resourceLoader.loadSound('./catGame/res/sound/theme1.mp3');
        this.spriteSheetLabel = this.resourceLoader.loadTexture('./catGame/res/sprite/pressKeyToStart.png');
    }

    protected listenUI():void {
        this.on(MOUSE_EVENTS.click, e=>{
            this.snd.stop();
            this.game.camera.shake(5,200);
            GameManager.getCreatedInstance().startGame();
        });
    }

}

import {ITexture} from "@engine/renderer/common/texture";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {BaseAbstractIntroScene} from "./abstracts/baseAbstractIntroScene";
import {GameManager} from "../gameManager";
import {Resource} from "@engine/resources/resourceDecorators";
import {Sound} from "@engine/media/sound";


export class IntroScene extends BaseAbstractIntroScene {

    @Resource.Sound('./catGame/res/sound/theme1.mp3')
    protected soundTheme: Sound;

    @Resource.Texture('./catGame/res/sprite/pressKeyToStart.png')
    protected spriteSheetLabel: ITexture;


    protected listenUI():void {
        this.mouseEventHandler.on(MOUSE_EVENTS.click, e=>{
            this.soundTheme.stop();
            this.camera.shake(5,200);
            GameManager.getCreatedInstance().startGame();
        });
    }

}

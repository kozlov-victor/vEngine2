import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {MOUSE_EVENTS} from "@engine/control/mouse/mouseEvents";
import {BaseAbstractIntroScene} from "./abstracts/baseAbstractIntroScene";
import {GameManager} from "../gameManager";
import {Resource} from "@engine/resources/resourceDecorators";


export class IntroScene extends BaseAbstractIntroScene {

    @Resource.Sound('./catGame/res/sound/theme1.mp3')
    protected soundThemeRes: ResourceLink<void>;

    @Resource.Texture('./catGame/res/sprite/pressKeyToStart.png')
    protected spriteSheetLabel: ResourceLink<ITexture>;


    protected listenUI():void {
        this.on(MOUSE_EVENTS.click, e=>{
            this.snd.stop();
            this.game.camera.shake(5,200);
            GameManager.getCreatedInstance().startGame();
        });
    }

}

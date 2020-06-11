import {BaseAbstractIntroScene} from "./abstracts/baseAbstractIntroScene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";

export class LevelCompletedScene extends BaseAbstractIntroScene {

    @Resource.Sound('./catGame/res/sound/levelCompleted.mp3')
    protected soundThemeRes: ResourceLink<void>;

    @Resource.Texture('./catGame/res/sprite/levelCompleted.png')
    protected spriteSheetLabel: ResourceLink<ITexture>;

    protected startSound(): void {
        super.startSound();
        this.snd.loop = false;
    }

    protected listenUI():void {

    }

}

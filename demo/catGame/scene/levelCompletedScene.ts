import {BaseAbstractIntroScene} from "./abstracts/baseAbstractIntroScene";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {Sound} from "@engine/media/sound";

export class LevelCompletedScene extends BaseAbstractIntroScene {

    @Resource.Sound('./catGame/res/sound/levelCompleted.mp3')
    public readonly soundTheme: Sound;

    @Resource.Texture('./catGame/res/sprite/levelCompleted.png')
    public readonly spriteSheetLabel: ITexture;

    protected override startSound(): void {
        super.startSound();
        this.soundTheme.loop = false;
    }

    protected override listenUI():void {

    }

}

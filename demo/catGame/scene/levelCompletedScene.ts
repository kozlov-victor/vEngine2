import {BaseAbstractIntroScene} from "./abstracts/baseAbstractIntroScene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";

export class LevelCompletedScene extends BaseAbstractIntroScene {


    protected soundThemeRes: ResourceLink<void>;
    protected spriteSheetLabel: ResourceLink<ITexture>;


    public onPreloading(): void {
        this.soundThemeRes = this.resourceLoader.loadSound('./catGame/res/sound/levelCompleted.mp3');
        this.spriteSheetLabel = this.resourceLoader.loadTexture('./catGame/res/sprite/levelCompleted.png');
    }

    protected startSound(): void {
        super.startSound();
        this.snd.loop = false;
    }

    protected listenUI():void {

    }

}

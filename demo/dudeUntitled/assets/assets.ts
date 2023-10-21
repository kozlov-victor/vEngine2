
import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITiledJSON} from "@engine/renderable/impl/general/tileMap/tileMap";
import {ITextureAtlasJSON} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {Font} from "@engine/renderable/impl/general/font/font";
import {TaskQueue} from "@engine/resources/taskQueue";
import {FontContextTtfFactory} from "@engine/renderable/impl/general/font/factory/fontContextTtfFactory";

export class Assets extends ResourceAutoHolder {

    @Resource.JSON('levels/level1.json') public readonly levelData:ITiledJSON;
    @Resource.Texture('levels/tiles.png') public readonly tilesTexture:ITexture;

    @Resource.Texture('sprites/sprites.png') public readonly spritesTexture:ITexture;
    @Resource.JSON('sprites/sprites.json') public readonly spritesAtlas:ITextureAtlasJSON;
    @Resource.Binary('font/zx.ttf') public readonly fontBuffer:ArrayBuffer;

    public font:Font;


    protected override onPreloading(taskQueue: TaskQueue) {
        super.onPreloading(taskQueue);
        taskQueue.addNextTask(async progress => {
            const fontTtfFactory = new FontContextTtfFactory(this.scene.getGame(), this.fontBuffer, 30);
            this.font = fontTtfFactory.createFont([], [], '', fontTtfFactory.getFontSize());
        });
    }
}

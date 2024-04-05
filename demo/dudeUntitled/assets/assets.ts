import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITiledJSON} from "@engine/renderable/impl/general/tileMap/tileMap";
import {ITextureAtlasJSON} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";
import {Font} from "@engine/renderable/impl/general/font/font";
import {TaskQueue} from "@engine/resources/taskQueue";
import {FontContextBdfFactory} from "@engine/renderable/impl/general/font/factory/fontContextBdfFactory";
import {BdfFontParser} from "@engine/misc/parsers/bdf/bdfFontParser";
import {DI} from "@engine/core/ioc";

@DI.Injectable()
export class Assets extends ResourceAutoHolder {

    @Resource.JSON('levels/level1.json') public readonly levelData:ITiledJSON;
    @Resource.Texture('levels/tiles.png') public readonly tilesTexture:ITexture;

    @Resource.Texture('sprites/sprites.png') public readonly spritesTexture:ITexture;
    @Resource.JSON('sprites/sprites.json') public readonly spritesAtlas:ITextureAtlasJSON;
    @Resource.Text('font/font.txt') private readonly fontSrc:string;

    public font:Font;


    protected override onPreloading(taskQueue: TaskQueue) {
        super.onPreloading(taskQueue);
        taskQueue.addNextTask(async progress => {
            const bdfFont = new BdfFontParser().parse(this.fontSrc);
            const fontBdfFactory = new FontContextBdfFactory(this.scene.getGame(), bdfFont);
            this.font = fontBdfFactory.createFont([], [], '', 8*3);
        });
    }
}

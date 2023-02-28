
import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITiledJSON} from "@engine/renderable/impl/general/tileMap/tileMap";
import {ITextureAtlasJSON} from "@engine/animation/frameAnimation/atlas/texturePackerAtlas";

export class Assets extends ResourceAutoHolder {

    @Resource.JSON('levels/level1.json') public readonly levelData:ITiledJSON;
    @Resource.Texture('levels/tiles.png') public readonly tilesTexture:ITexture;

    @Resource.Texture('sprites/sprites.png') public readonly spritesTexture:ITexture;
    @Resource.JSON('sprites/sprites.json') public readonly spritesAtlas:ITextureAtlasJSON;

}

import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITiledJSON} from "@engine/renderable/impl/general/tileMap/tileMap";

export class Assets extends ResourceAutoHolder {

    @Resource.JSON(`character/character.json`) public readonly characterAtlas:any;
    @Resource.JSON('levels/level1.json') public readonly levelData:ITiledJSON;
    @Resource.Texture(`character/character.png`) public readonly characterTexture:ITexture;
    @Resource.Texture('levels/tiles.png') public readonly tilesTexture:ITexture;

}

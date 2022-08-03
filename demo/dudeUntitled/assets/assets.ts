import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITiledJSON} from "@engine/renderable/impl/general/tileMap/tileMap";

export class Assets extends ResourceAutoHolder {

    @Resource.Texture(`character/character.png`) public readonly characterTexture:ITexture;
    @Resource.JSON(`character/character.json`) public readonly characterAtlas:any;

    @Resource.Texture('tiles/voda_pesok_trava_revision_2.png') public readonly tilesTexture:ITexture;
    @Resource.JSON('tiles/level.json') public readonly levelData:ITiledJSON;

}

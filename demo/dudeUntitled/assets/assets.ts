import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITiledJSON} from "@engine/renderable/impl/general/tileMap/tileMap";

export class Assets extends ResourceAutoHolder {

    @Resource.Texture(`character/character.png`) public characterTexture:ITexture;
    @Resource.JSON(`character/character.json`) public characterAtlas:any;

    @Resource.Texture('tiles/voda_pesok_trava_revision_2.png') public tilesTexture:ITexture;
    @Resource.JSON('tiles/level.json') public levelData:ITiledJSON;

}

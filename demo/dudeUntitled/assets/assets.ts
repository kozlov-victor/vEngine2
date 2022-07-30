import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {ITexture} from "@engine/renderer/common/texture";
import {Resource} from "@engine/resources/resourceDecorators";

export class Assets extends ResourceAutoHolder {

    @Resource.Texture('./dudeUntitled/assets/character/character.png') public characterTexture:ITexture;
    @Resource.JSON('./dudeUntitled/assets/character/character.json') public characterAtlas:any;

}

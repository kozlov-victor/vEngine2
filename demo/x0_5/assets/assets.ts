import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {Resource} from "@engine/resources/resourceDecorators";
import {Texture} from "@engine/renderer/webGl/base/texture/texture";

export class Assets extends ResourceAutoHolder {

    @Resource.Texture('images/bg.png') public readonly bg: Texture;
    @Resource.Texture('images/arrow.png') public readonly arrow: Texture;
    @Resource.Texture('images/logo.png') public readonly logo: Texture;

}

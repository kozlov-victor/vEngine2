import {Resource} from "@engine/resources/resourceDecorators";
import {ITexture} from "@engine/renderer/common/texture";
import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";

export abstract class AbstractResourceHolder extends ResourceAutoHolder {

    @Resource.Texture('./assets/logo.png') public logoTexture:ITexture;

}

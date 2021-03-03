import {AbstractResourceHolder} from "./abstractResourceHolder";
import {Resource} from "@engine/resources/resourceDecorators";
import {ITexture} from "@engine/renderer/common/texture";


export class ResourceHolder extends AbstractResourceHolder {

    @Resource.Texture('./assets/repeat.jpg')
    public bgTexture:ITexture;

}

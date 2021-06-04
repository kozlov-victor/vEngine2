import {Resource} from "@engine/resources/resourceDecorators";
import {Scene} from "@engine/scene/scene";
import {ITexture} from "@engine/renderer/common/texture";
import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";

export class LogoResources extends ResourceAutoHolder{

    @Resource.Texture('./assets/logo.png')
    public logoTexture:ITexture;

    constructor(scene:Scene) {
        super(scene);
    }

}

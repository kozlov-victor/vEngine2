import {Resource} from "@engine/resources/resourceDecorators";
import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";

export class LogoResources extends ResourceAutoHolder{

    @Resource.Texture('./assets/logo.png')
    public logoLink:ResourceLink<ITexture>;

    constructor(protected scene:Scene) {
        super(scene);
    }

}

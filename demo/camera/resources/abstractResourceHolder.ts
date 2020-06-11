import {Resource} from "@engine/resources/resourceDecorators";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Scene} from "@engine/scene/scene";
import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";

export abstract class AbstractResourceHolder extends ResourceAutoHolder {

    @Resource.Texture('./assets/logo.png') public logoLink:ResourceLink<ITexture>;

    protected constructor(scene:Scene) {
        super(scene);
    }
}

import {AbstractResourceHolder} from "./abstractResourceHolder";
import {Resource} from "@engine/resources/resourceDecorators";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";
import {Scene} from "@engine/scene/scene";


export class ResourceHolder extends AbstractResourceHolder {

    @Resource.Texture('./assets/repeat.jpg') public bgLink:ResourceLink<ITexture>;

    constructor(scene:Scene) {
        super(scene);
    }
}

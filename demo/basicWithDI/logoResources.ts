import {Resource} from "@engine/resources/resourceDecorators";
import {ITexture} from "@engine/renderer/common/texture";
import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {ISingleton, staticImplements} from "@engine/resources/singleton";

@staticImplements<ISingleton<LogoResources>>()
export class LogoResources extends ResourceAutoHolder{

    public static getInstance():LogoResources {
        return undefined!;
    }

    @Resource.Texture('./assets/logo.png')
    public logoTexture:ITexture;


}

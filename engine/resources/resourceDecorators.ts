import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ITexture} from "@engine/renderer/common/texture";

export const Source = {
    Texture: (src:string)=> {
        return (target: Scene, propertyKey: string):void => {
            target.preloadingTaskFromDecorators = target.preloadingTaskFromDecorators || [];
            target.preloadingTaskFromDecorators.push((currScene:Scene)=>{
                (currScene as unknown as Record<string, ResourceLink<ITexture>>)[propertyKey] = currScene.resourceLoader.loadTexture(src);
            });
        };
    },
};


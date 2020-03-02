import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {IURLRequest} from "@engine/resources/urlLoader";


export const Source = {
    Texture: (src:string|IURLRequest)=> {
        return (target: Scene, propertyKey: string):void => {
            target.preloadingTaskFromDecorators = target.preloadingTaskFromDecorators || [];
            target.preloadingTaskFromDecorators.push((currScene:Scene)=>{
                (currScene as unknown as Record<string, ResourceLink<ITexture>>)[propertyKey] = currScene.resourceLoader.loadTexture(src);
            });
        };
    },
    CubeTexture:  (leftSide: string|IURLRequest, rightSide:string|IURLRequest,
                   topSide: string|IURLRequest, bottomSide:string|IURLRequest,
                   frontSide: string|IURLRequest, backSide:string|IURLRequest)=>{
        return (target: Scene, propertyKey: string):void => {
            target.preloadingTaskFromDecorators = target.preloadingTaskFromDecorators || [];
            target.preloadingTaskFromDecorators.push((currScene:Scene)=>{
                (currScene as unknown as Record<string, ResourceLink<ICubeMapTexture>>)[propertyKey] =
                    currScene.resourceLoader.loadCubeTexture(
                        leftSide,rightSide,
                        topSide,bottomSide,
                        frontSide,backSide
                    );
            });
        };
    }
};


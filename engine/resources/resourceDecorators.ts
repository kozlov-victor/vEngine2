import {Scene} from "@engine/scene/scene";
import {ResourceLink} from "@engine/resources/resourceLink";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import {IURLRequest} from "@engine/resources/urlLoader";
import {ClazzEx} from "@engine/core/declarations";
import {Game} from "@engine/core/game";

export const PrefabFactory  = {
    createPrefab: (game:Game,clazz:ClazzEx<any,Game>)=>{
        return new clazz(game);
    }
};

export const Prefab =  ()=>{
    return (target: any):void => {
        target.prototype.doPrefabStuff = ()=>{

        };
    };
};

export const Source = {
    Test: (s:string)=> {
        return (target: any, propertyKey: string):void => {
            console.log('decorated field',target,propertyKey);
        };
    },
    Texture: (src:string|IURLRequest)=> {
        return (target: Scene, propertyKey: string):void => {
            target.preloadingTaskFromDecorators = target.preloadingTaskFromDecorators || [];
            target.preloadingTaskFromDecorators.push((currScene:Scene)=>{
                (currScene as unknown as Record<string, ResourceLink<ITexture>>)[propertyKey] = currScene.resourceLoader.loadTexture(src);
            });
        };
    },
    Sound: (src:string|IURLRequest)=> {
        return (target: Scene, propertyKey: string):void => {
            target.preloadingTaskFromDecorators = target.preloadingTaskFromDecorators || [];
            target.preloadingTaskFromDecorators.push((currScene:Scene)=>{
                (currScene as unknown as Record<string, ResourceLink<void>>)[propertyKey] = currScene.resourceLoader.loadSound(src);
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


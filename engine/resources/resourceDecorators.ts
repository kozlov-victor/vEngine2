import {Scene} from "@engine/scene/scene";
import {IURLRequest} from "@engine/resources/urlLoader";
import {DebugError} from "@engine/debug/debugError";
import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";


export const Resource = {
    Texture: (src:string|IURLRequest)=> {
        return (target: Scene|ResourceAutoHolder, fieldName: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler`);
        };
    },
    Sound: (src:string|IURLRequest)=> {
        return (target: Scene|ResourceAutoHolder, fieldName: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler`);
        };
    },
    Text: (src:string|IURLRequest)=> {
        return (target: Scene|ResourceAutoHolder, fieldName: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler`);
        };
    },
    CubeTexture:  (leftSide: string|IURLRequest, rightSide:string|IURLRequest,
                   topSide: string|IURLRequest, bottomSide:string|IURLRequest,
                   frontSide: string|IURLRequest, backSide:string|IURLRequest)=>{
        return (target: Scene, propertyKey: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler`);
        };
    }
};


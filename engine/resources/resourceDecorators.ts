import {Scene} from "@engine/scene/scene";
import {IURLRequest} from "@engine/resources/urlLoader";
import {DebugError} from "@engine/debug/debugError";
import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {IDocumentDescription} from "@engine/misc/xmlUtils";
import {ICssFontParameters} from "@engine/renderable/impl/general/font";


export const Resource = {
    Texture: (src:string|IURLRequest)=> {
        return (target: Scene|ResourceAutoHolder, fieldName: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Texture decorator`);
        };
    },
    Sound: (src:string|IURLRequest)=> {
        return (target: Scene|ResourceAutoHolder, fieldName: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Sound decorator`);
        };
    },
    Text: (src:string|IURLRequest)=> {
        return (target: Scene|ResourceAutoHolder, fieldName: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Text decorator`);
        };
    },
    CubeTexture:  (leftSide: string|IURLRequest, rightSide:string|IURLRequest,
                   topSide: string|IURLRequest, bottomSide:string|IURLRequest,
                   frontSide: string|IURLRequest, backSide:string|IURLRequest)=>{
        return (target: Scene, propertyKey: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for CubeTexture decorator`);
        };
    },
    Font: (params:ICssFontParameters)=>{
        return (target: Scene, propertyKey: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Font decorator`);
        };
    },
    FontFromAtlas: (atlasUrl:string|IURLRequest,doc:IDocumentDescription)=>{
        return (target: Scene, propertyKey: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Font decorator`);
        };
    },
    ResourceAutoHolder: ()=>{
        return (target:Scene, propertyKey:string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for ResourceAutoHolder decorator`);
        };
    }
};


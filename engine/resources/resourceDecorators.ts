import {Scene} from "@engine/scene/scene";
import {IURLRequest} from "@engine/resources/urlLoader";
import {DebugError} from "@engine/debug/debugError";
import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {XmlDocument} from "@engine/misc/xml/xmlELements";
import {FontTypes} from "@engine/renderable/impl/general/font/fontTypes";
import ICssFontParameters = FontTypes.ICssFontParameters;
import {IParser} from "@engine/misc/xml/iParser";


export const Resource = {
    Texture: (src:string|IURLRequest)=> {
        return (target: Scene|ResourceAutoHolder, fieldName: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Texture decorator`);
        };
    },
    Image: (src:string|IURLRequest)=> {
        return (target: Scene|ResourceAutoHolder, fieldName: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Image decorator`);
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
    JSON: (src:string|IURLRequest)=> {
        return (target: Scene|ResourceAutoHolder, fieldName: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Text decorator`);
        };
    },
    CubeTexture:  (leftSide: string|IURLRequest, rightSide:string|IURLRequest,
                   topSide: string|IURLRequest, bottomSide:string|IURLRequest,
                   frontSide: string|IURLRequest, backSide:string|IURLRequest)=>{
        return (target: Scene|ResourceAutoHolder, propertyKey: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for CubeTexture decorator`);
        };
    },
    FontFromCssDescription: (params:ICssFontParameters)=>{
        return (target: Scene|ResourceAutoHolder, propertyKey: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Font decorator`);
        };
    },
    FontFromAtlas: (baseUrl:string|IURLRequest,doc:XmlDocument)=>{
        return (target: Scene|ResourceAutoHolder, propertyKey: string):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Font decorator`);
        };
    },
    FontFromAtlasUrl: (baseUrl:string|IURLRequest,fileName:string,docParser:{new(s:string):IParser})=>{
        return (target: Scene|ResourceAutoHolder, propertyKey: string):void => {
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


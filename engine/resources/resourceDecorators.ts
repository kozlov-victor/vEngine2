import {Scene} from "@engine/scene/scene";
import {IURLRequest} from "@engine/resources/urlLoader";
import {DebugError} from "@engine/debug/debugError";
import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";
import {IXmlNode, XmlDocument} from "@engine/misc/parsers/xml/xmlELements";
import {FontTypes} from "@engine/renderable/impl/general/font/fontTypes";
import ICssFontParameters = FontTypes.ICssFontParameters;
import {IParser} from "@engine/misc/parsers/iParser";
import type {XmlParser} from "@engine/misc/parsers/xml/xmlParser";
import type {YamlParser} from "@engine/misc/parsers/yaml/yamlParser";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import type {Image} from "@engine/renderable/impl/general/image/image";
import type {Sound} from "@engine/media/sound";
import type {Font} from "@engine/renderable/impl/general/font/font";


export const Resource = {
    ResourceHolder: ()=>{
        return <K extends string,T extends Scene & Record<K, ResourceAutoHolder>>(target: T, fieldName: K):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Texture decorator`);
        };
    },
    Texture: (src:string|IURLRequest)=> {
        return<K extends string,T extends (Scene|ResourceAutoHolder) & Record<K, ITexture>> (target: T, fieldName: K):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Texture decorator`);
        };
    },
    Image: (src:string|IURLRequest)=> {
        return<K extends string,T extends (Scene|ResourceAutoHolder) & Record<K, Image>> (target: T, fieldName: K):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Image decorator`);
        };
    },
    Sound: (src:string|IURLRequest)=> {
        return<K extends string,T extends (Scene|ResourceAutoHolder) & Record<K, Sound>> (target: T, fieldName: K):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Sound decorator`);
        };
    },
    Text: (src:string|IURLRequest)=> {
        return<K extends string,T extends (Scene|ResourceAutoHolder) & Record<K, string>> (target: T, fieldName: K):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Text decorator`);
        };
    },
    JSON: (src:string|IURLRequest)=> {
        return<K extends string,T extends (Scene|ResourceAutoHolder) & Record<K, any>> (target: T, fieldName: K):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Text decorator`);
        };
    },
    XML: (xmlParserClass: typeof XmlParser,req: string|IURLRequest)=> {
        return<K extends string,T extends (Scene|ResourceAutoHolder) & Record<K, INode>> (target: T, fieldName: K):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Text decorator`);
        };
    },
    YAML: (yamlParserClass: typeof YamlParser,req: string|IURLRequest)=> {
        return<K extends string,T extends (Scene|ResourceAutoHolder) & Record<K, any>> (target: T, fieldName: K):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Text decorator`);
        };
    },
    Binary: (src:string|IURLRequest)=> {
        return<K extends string,T extends (Scene|ResourceAutoHolder) & Record<K, ArrayBuffer>> (target: T, fieldName: K):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Text decorator`);
        };
    },
    CubeTexture:  (leftSide: string|IURLRequest, rightSide:string|IURLRequest,
                   topSide: string|IURLRequest, bottomSide:string|IURLRequest,
                   frontSide: string|IURLRequest, backSide:string|IURLRequest)=>{
        return<K extends string,T extends (Scene|ResourceAutoHolder) & Record<K, ICubeMapTexture>> (target: T, propertyKey: K):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for CubeTexture decorator`);
        };
    },
    FontFromCssDescription: (params:ICssFontParameters)=>{
        return<K extends string,T extends (Scene|ResourceAutoHolder) & Record<K, Font>> (target: T, propertyKey: K):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Font decorator`);
        };
    },
    FontFromAtlas: (baseUrl:string|IURLRequest,doc:XmlDocument)=>{
        return<K extends string,T extends (Scene|ResourceAutoHolder) & Record<K, Font>> (target: T, propertyKey: K):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Font decorator`);
        };
    },
    FontFromAtlasUrl: (baseUrl:string|IURLRequest,fileName:string,docParser:{new(s:string):IParser<IXmlNode>})=>{
        return<K extends string,T extends (Scene|ResourceAutoHolder) & Record<K, Font>> (target: T, propertyKey: K):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Font decorator`);
        };
    },
};


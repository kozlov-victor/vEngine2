import {IURLRequest} from "@engine/resources/urlLoader";
import {DebugError} from "@engine/debug/debugError";
import {IXmlNode, XmlDocument} from "@engine/misc/parsers/xml/xmlELements";
import {FontTypes} from "@engine/renderable/impl/general/font/fontTypes";
import {IParser} from "@engine/misc/parsers/iParser";
import type {XmlParser} from "@engine/misc/parsers/xml/xmlParser";
import type {YamlParser} from "@engine/misc/parsers/yaml/yamlParser";
import {ICubeMapTexture, ITexture} from "@engine/renderer/common/texture";
import type {Image} from "@engine/renderable/impl/general/image/image";
import type {Sound} from "@engine/media/sound";
import type {Font} from "@engine/renderable/impl/general/font/font";
import ICssFontParameters = FontTypes.ICssFontParameters;


export const Resource = {
    ResourceHolder: ()=>{
        return <This,Value>(value: undefined, context: ClassFieldDecoratorContext<This,Value>):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Texture decorator`);
        };
    },
    Texture: (src:string|IURLRequest)=> {
        return <This,Value extends ITexture>(value: undefined, context: ClassFieldDecoratorContext<This,Value>):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Texture decorator`);
        };
    },
    Image: (src:string|IURLRequest)=> {
        return <This,Value extends Image>(value: undefined, context: ClassFieldDecoratorContext<This,Value>):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Image decorator`);
        };
    },
    Sound: (src:string|IURLRequest)=> {
        return <This,Value extends Sound>(value: undefined, context: ClassFieldDecoratorContext<This,Value>):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Sound decorator`);
        };
    },
    Text: (src:string|IURLRequest)=> {
        return <This,Value extends string>(value: undefined, context: ClassFieldDecoratorContext<This,Value>):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Text decorator`);
        };
    },
    JSON: (src:string|IURLRequest)=> {
        return <This,Value>(value: undefined, context: ClassFieldDecoratorContext<This,Value>):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Text decorator`);
        };
    },
    XML: (xmlParserClass: typeof XmlParser,req: string|IURLRequest)=> {
        return <This,Value extends IXmlNode>(value: undefined, context: ClassFieldDecoratorContext<This,Value>):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Text decorator`);
        };
    },
    YAML: (yamlParserClass: typeof YamlParser,req: string|IURLRequest)=> {
        return <This,Value>(value: undefined, context: ClassFieldDecoratorContext<This,Value>):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Text decorator`);
        };
    },
    Binary: (src:string|IURLRequest)=> {
        return <This,Value extends ArrayBuffer>(value: undefined, context: ClassFieldDecoratorContext<This,Value>):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Text decorator`);
        };
    },
    CubeTexture:  (leftSide: string|IURLRequest, rightSide:string|IURLRequest,
                   topSide: string|IURLRequest, bottomSide:string|IURLRequest,
                   frontSide: string|IURLRequest, backSide:string|IURLRequest)=>{
        return <This,Value extends ICubeMapTexture>(value: undefined, context: ClassFieldDecoratorContext<This,Value>):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for CubeTexture decorator`);
        };
    },
    FontFromCssDescription: (params:ICssFontParameters)=>{
        return <This,Value extends Font>(value: undefined, context: ClassFieldDecoratorContext<This,Value>):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Font decorator`);
        };
    },
    FontFromAtlas: (baseUrl:string|IURLRequest,doc:XmlDocument)=>{
        return <This,Value extends Font>(value: undefined, context: ClassFieldDecoratorContext<This,Value>):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Font decorator`);
        };
    },
    FontFromAtlasUrl: (baseUrl:string|IURLRequest,fileName:string,docParser:{new(s:string):IParser<IXmlNode>})=>{
        return <This,Value extends Font>(value: undefined, context: ClassFieldDecoratorContext<This,Value>):void => {
            // stub for precompiler only
            throw new DebugError(`something wrong with precompiler for Font decorator`);
        };
    },
};


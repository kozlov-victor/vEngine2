declare module "*.jpg" {
    const value: string;
    export = value;
}

declare module "*.png" {
    const value: string;
    export = value;
}

declare module "*.json" {
    const value: string;
    export = value;
}

declare interface IElementDescription {
    tagName:string;
    attributes:Record<string,string>;
    children:IElementDescription[];
}

declare module "*.xml" {
    const value:IElementDescription;
    export = value;
}

declare module "*.glsl" {
    const value: string;
    export = value;
}

declare const DEBUG:boolean;
declare const BUILD_AT:number;
declare type byte = number;

// tslint:disable-next-line:interface-name
interface Window {
    Image:typeof HTMLImageElement;
    globalThis:Window;
    __POLYFILLS_INCLUDED__:boolean;
}

declare const MACRO_GL_COMPRESS:(arg:TemplateStringsArray)=>string;



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

// tslint:disable-next-line:interface-name
interface Window {
    Image:typeof HTMLImageElement;
    globalThis:Window;
    __POLYFILLS_INCLUDED__:boolean;
}

declare const MACRO_GL_COMPRESS:(arg:TemplateStringsArray)=>string;

// class ClB {
//     public b(){}
// }
//
// class ClE {
//     public e(){}
// }
//
// class ClF {
//     public f(){}
// }
//
// class ClC extends  mix(ClB,ClE,ClF){
//     public c() {}
// }
//
// const c = new ClC();


type FaceType<T> = {
    [K in keyof T]: T[K];
};

type Constructor<T> = {
    new(): T;
};




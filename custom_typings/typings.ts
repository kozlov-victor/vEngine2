declare module "*.jpg" {
    const value: string;
    export = value;
}

declare module "*.png" {
    const value: string;
    export = value;
}

declare module "*.json" {
    const value: any;
    export = value;
}

declare module "*.xml" {
    const value:any;
    export = value;
}

declare module "*.glsl" {
    const value: string;
    export = value;
}

declare const DEBUG:boolean;

// tslint:disable-next-line:interface-name
interface Window {
    globalThis:Window;
}
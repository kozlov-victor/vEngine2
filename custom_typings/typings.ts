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

declare const DEBUG:boolean;
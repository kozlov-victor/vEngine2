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

declare type Optional<T> = T | undefined;

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

function mix<O, A, B, C, D, E, F, G, H, Mix = O & A & B & C & D & E & F & G & H>(o: Constructor<O>, t: Constructor<A>, t1?: Constructor<B>, t2?: Constructor<C>, t3?: Constructor<D>, t4?: Constructor<E>, t5?: Constructor<F>, t6?: Constructor<G>, t7?: Constructor<H>): FaceType<Mix> & Constructor<Mix> {
    function MixinClass(this:O|A|B|C|D|E|F|G|H,...args: any) {
        o.apply(this, args);
        [t, t1, t2, t3,t4, t5, t6, t7].forEach((baseCtor) => {
            if (baseCtor===undefined) return;
            baseCtor.apply(this, args);
        });
    }
    const ignoreNamesFilter = (name: string) => ["constructor"].indexOf(name) === -1;
    [o, t, t1, t2, t3,t4, t5, t6, t7].forEach((baseCtor) => {
        if (baseCtor===undefined) return;
        Object.getOwnPropertyNames(baseCtor.prototype).filter(ignoreNamesFilter).forEach(name => {
            MixinClass.prototype[name] = baseCtor.prototype[name];
        });
    });
    return MixinClass as unknown as FaceType<Mix> & Constructor<Mix>;
}




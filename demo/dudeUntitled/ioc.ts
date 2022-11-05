import {DebugError} from "@engine/debug/debugError";

export interface Injectable {
    postConstruct:()=>void;
}

export namespace DiContainer {

    const ctx:Record<string, any> = {};
    let completed:boolean = false;

    export const register = (instance:any,tkn:string):void=>{
        ctx[tkn!] = instance;
    }

    export const complete = ():void=>{
        completed = true;
        Object.keys(ctx).forEach(key=>{
            ctx[key].postConstruct?.();
        });
    }

    export const get = (tkn:string):any=> {
        return ctx[tkn];
    }

    export const Inject = (tkn:string)=>{
        return <K extends string,T extends Injectable>(target: T, fieldName: K):void => {
            Object.defineProperty(target, fieldName,{
                get: ()=>{
                    if (DEBUG && !completed) {
                        throw new DebugError(`DI container is not completed`);
                    }
                    const obj = DiContainer.get(tkn);
                    if (DEBUG && obj===undefined) {
                        throw new DebugError(`can not retrieve object by token "${tkn}"`);
                    }
                    return obj;
                }
            });
        };
    }

}


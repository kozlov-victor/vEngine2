import {DebugError} from "@engine/debug/debugError";

export interface Injectable {
    postConstruct:()=>void;
}

export namespace DiContainer {

    const ctx:Record<string, any> = {};
    let completed:boolean = false;

    export const register = (instance:any):void=>{
        const tkn = instance.constructor.name;
        ctx[tkn] = instance;
    }

    export const complete = ():void=>{
        completed = true;
        Object.keys(ctx).forEach(key=>{
            ctx[key].postConstruct?.();
            const injectedTokens:string[] = ctx[key]?.__injected;
            if (!injectedTokens) return;
            injectedTokens.forEach(tkn=>{
                if (!ctx[tkn]) {
                    throw new Error(
                        `Injection error for object with name "${key}": dependency with token "${tkn}" is not provided.
                        tokens provided: ${Object.keys(ctx).join(',')}`
                    );
                }
            });
            delete ctx[key]?.__injected;
        });
    }

    const get = (tkn:string):any=> {
        return ctx[tkn];
    }

    export const Inject = (clazz:{new(...args:any):any})=>{
        return <K extends string,T extends Injectable>(target: T, fieldName: K):void => {
            const tkn = clazz.name;
            (target as any).__injected ??=[];
            (target as any).__injected.push(tkn);

            Object.defineProperty(target, fieldName,{
                get: ()=>{
                    if (DEBUG && !completed) {
                        throw new DebugError(`DI container is not completed`);
                    }
                    const obj = get(tkn);
                    if (DEBUG && obj===undefined) {
                        throw new DebugError(`can not retrieve object by token "${tkn}"`);
                    }
                    return obj;
                }
            });
        };
    }

}


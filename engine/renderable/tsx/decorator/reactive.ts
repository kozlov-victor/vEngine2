import {VEngineTsxComponent} from "@engine/renderable/tsx/_genetic/vEngineTsxComponent";
import {VEngineTsxRootHolder} from "@engine/renderable/tsx/_genetic/vEngineTsxRootHolder";

export const Reactive = {
    Method: function() {
        return (originalMethod:any,context:ClassMethodDecoratorContext) => {
            context.addInitializer(function(){
                (this as any)[context.name] = ((...args: any[])=>{
                    const result = originalMethod.apply(this, args);
                    (this as VEngineTsxComponent)._triggerRendering();
                    if (result instanceof Promise) {
                        result.then(()=>{
                            (this as VEngineTsxComponent)._triggerRendering();
                        });
                    }
                    return result;
                });
            });
        };
    },
    Property: function() {
        return (originalProperty:any,context:ClassFieldDecoratorContext) => {
            context.addInitializer(function(){
                let _val:any = undefined;
                Object.defineProperty(this, context.name,{
                    get: ()=>{
                        // Promise.resolve().then(()=>{
                        //     (this as VEngineTsxComponent)._triggerRendering();
                        // });
                        return _val;
                    },
                    set:val=>{
                        _val = val;
                        (this as VEngineTsxComponent)._triggerRendering();
                    }
                });
            });
        };
    },
    Function: function <K extends unknown[],U>(fn:(...args:[...K]) => U):(...args:[...K])=>U {
        return (...args: [...K]) => {
            const res = fn(...args);
            VEngineTsxRootHolder.ROOT._triggerRendering();
            if (res instanceof Promise) {
                res.then(()=>{
                    VEngineTsxRootHolder.ROOT._triggerRendering();
                });
            }
            return res;
        };
    }
}

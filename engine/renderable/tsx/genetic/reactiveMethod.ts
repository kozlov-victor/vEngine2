import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";

export const ReactiveMethod = function(){
    return (originalMethod:any,context:ClassMethodDecoratorContext) => {
        context.addInitializer(function(){
            (this as any)[context.name] = (...args: any[])=>{
                const result = originalMethod.apply(this, args);
                (this as VEngineTsxComponent & {triggerRendering:()=>void}).triggerRendering();
                if (result instanceof Promise) {
                    result.then(()=>{
                        (this as VEngineTsxComponent & {triggerRendering:()=>void}).triggerRendering();
                    });
                }
                return result;
            }
        });
    };
};

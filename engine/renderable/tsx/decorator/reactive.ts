import {VEngineTsxComponent} from "@engine/renderable/tsx/_genetic/vEngineTsxComponent";

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
                        console.log('set',val);
                        (this as VEngineTsxComponent)._triggerRendering();
                    }
                });
            });
        };
    }
}

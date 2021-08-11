import {VEngineTsxComponent} from "@engine/renderable/tsx/genetic/vEngineTsxComponent";

// tslint:disable-next-line:only-arrow-functions typedef
export const ReactiveMethod = function(){
    return (target: VEngineTsxComponent, fieldName: string,descriptor: PropertyDescriptor):PropertyDescriptor => {
        const childFunction = descriptor.value;
        // tslint:disable-next-line:only-arrow-functions typedef
        descriptor.value = function(...args: any[]) {
            const result = childFunction.apply(this, args);
            if (result instanceof Promise) {
                result.then(()=>{
                    (this as VEngineTsxComponent & {triggerRendering:()=>void}).triggerRendering();
                });
            } else {
                (this as VEngineTsxComponent & {triggerRendering:()=>void}).triggerRendering();
            }
            return result;
        };
        return descriptor;
    };
};

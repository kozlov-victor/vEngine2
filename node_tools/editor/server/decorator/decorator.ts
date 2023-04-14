import {IRegistryItem} from "../registry/registry";

export interface IMethodParam {
    url?: string;
    contentType?:string;
}

export const Controller = function(url:string) {
    return function<Value>(value:Value, context:ClassDecoratorContext) {
        context.addInitializer(function(){
            (this as any).meta ??={};
            (this as any).meta.baseUrl = url;
        });
    }
}

export const Post = function(param:IMethodParam) {
    return function (
        originalMethod:any, context:ClassMethodDecoratorContext
    ) {
        context.addInitializer(function(){
            const ctor = (this as any).constructor as any;
            ctor.meta ??= {};
            ctor.meta.methods ??=[];
            ctor.meta.methods.push({
                    method: 'POST',
                    url: param.url ?? context.name,
                    controllerMethodName: context.name,
                    controllerInstance: undefined,
                    contentType: param.contentType,
                } as IRegistryItem
            );
        });
    };
}

export const Get = function(param:IMethodParam = {}) {
    return function(
        originalMethod:any, context:ClassMethodDecoratorContext
    ) {
        context.addInitializer(function(){
            const ctor = (this as any).constructor as any;
            ctor.meta ??= {};
            ctor.meta.methods ??=[];
            ctor.meta.methods.push({
                    method: 'GET',
                    url: param.url ?? context.name,
                    controllerMethodName: context.name,
                    controllerInstance: ctor,
                    contentType: param.contentType,
                } as IRegistryItem
            );
        });
    };
}

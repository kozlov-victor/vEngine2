import {IRegistryItem} from "../registry/registry";

export interface IMethodParam {
    url?: string;
    contentType?:string;
}

export const Controller = function(url:string) {
    return function<Value>(value:Value, context:ClassDecoratorContext) {
        context.addInitializer(function(){
            context.metadata!.baseUrl = url;
        });
    }
}

export const Post = function(param:IMethodParam = {}) {
    return function (
        originalMethod:any, context:ClassMethodDecoratorContext
    ) {
        context.addInitializer(function(){
            context.metadata!.methods ??=[];
            (context.metadata!.methods as any).push({
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
            context.metadata!.methods ??=[];
            (context.metadata!.methods as any).push({
                    method: 'GET',
                    url: param.url ?? context.name,
                    controllerMethodName: context.name,
                    controllerInstance: this,
                    contentType: param.contentType,
                } as IRegistryItem
            );
        });
    };
}

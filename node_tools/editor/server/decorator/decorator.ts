import {IRegistryItem} from "../registry/registry";

export interface IMethodParam {
    url?: string;
    contentType?:string;
}

export const Controller = function(url:string) {
    return function<T extends { new (...args: any[]): any }>(constructor: T) {
        (constructor as any).meta ??={};
        (constructor as any).meta.baseUrl = url;
        return constructor;
    }
}

export const Post = function(param:IMethodParam) {
    return function (
        instance: any,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {

        instance.constructor.meta ??= {};
        instance.constructor.meta.methods ??=[];
        instance.constructor.meta.methods.push({
                method: 'POST',
                url: param.url ?? key,
                controllerMethodName: key,
                controllerInstance: instance,
                contentType: param.contentType,
            } as IRegistryItem
        );
        return descriptor;
    };
}

export const Get = function(param:IMethodParam = {}) {
    return function (
        instance: any,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        instance.constructor.meta ??= {};
        instance.constructor.meta.methods ??=[];
        instance.constructor.meta.methods.push({
                method: 'GET',
                url: param.url ?? key,
                controllerMethodName: key,
                controllerInstance: instance,
                contentType: param.contentType,
            } as IRegistryItem
        );
        return descriptor;
    };
}

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
        constructor: any,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        constructor.meta = constructor.meta || {};
        constructor.meta[param.url ?? key] = {
            method: 'POST',
            controllerMethodName: key,
            controllerInstance: constructor,
            contentType: param.contentType,
        } as IRegistryItem;
        return descriptor;
    };
}

export const Get = function(param:IMethodParam = {}) {
    return function (
        constructor: any,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        constructor.meta = constructor.meta || {};
        constructor.meta[param.url ?? key] = {
            method: 'GET',
            controllerMethodName: key,
            controllerInstance: constructor,
            contentType: param.contentType,
        } as IRegistryItem;
        return descriptor;
    };
}

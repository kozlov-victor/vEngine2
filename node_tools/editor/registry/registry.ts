
export interface IRegistryItem {
    method: string;
    controllerMethodName: string;
    controllerInstance: any;
    contentType?: string;
}

export class Registry {

    private static instance:Registry;

    public registry:Record<string, IRegistryItem> = {};


    public static getInstance():Registry {
        if (!Registry.instance) Registry.instance = new Registry();
        return Registry.instance;
    }

    public registerController(c:any) {
        const instance = new c();
        const methodMaps:Record<string, IRegistryItem> = instance.meta;
        const baseUrl = instance.constructor?.meta?.baseUrl ?? '/';
        Object.keys(methodMaps).forEach(key=>{
            const url = `/`+(`${baseUrl}/${key}`).split('/').filter(it=>!!it).join('/');
            this.registry[url] = methodMaps[key];
        });
    }



}

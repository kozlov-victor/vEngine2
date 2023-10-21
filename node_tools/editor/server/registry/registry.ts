
(Symbol as any).metadata = 'metadata';

export interface IRegistryItem {
    method: string;
    url: string;
    controllerMethodName: string;
    controllerInstance: any;
    contentType?: string;
}

export class Registry {

    private static instance:Registry;

    public registry:IRegistryItem[] = [];


    public static getInstance():Registry {
        if (!Registry.instance) Registry.instance = new Registry();
        return Registry.instance;
    }

    public registerController(c:any) {
        const instance = new c();
        const metadata:{baseUrl:string,methods:IRegistryItem[]} = c.metadata;
        const baseUrl = metadata?.baseUrl ?? '/';
        (metadata.methods ?? []).forEach(m=>{
            let url = `/`+(`${baseUrl}/${m.url}`).split('/').filter(it=>!!it).join('/');
            if (!url.endsWith('/')) url = url + '/';
            m.url = url;
            m.controllerInstance = instance;
            this.registry.push(m);
        });
    }

}

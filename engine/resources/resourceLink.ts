
export class ResourceLink {

    constructor(private url:string){}

    private target:any;

    getUrl():string{
        return this.url;
    }

    setTarget(t:any):void{
        this.target = t;
    }

    getTarget<T>():T{
        return this.target as T;
    }

}
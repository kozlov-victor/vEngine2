
export class ResourceLink<T> {

    constructor(private url:string){}

    private target:T;

    getUrl():string{
        return this.url;
    }

    setTarget(t:T):void{
        this.target = t;
    }

    getTarget():T{
        return this.target;
    }

}
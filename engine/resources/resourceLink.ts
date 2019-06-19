

export class ResourceLink<T> {

    private target:T;

    constructor(public readonly url:string){}

    public getUrl():string{
        return this.url;
    }

    public setTarget(t:T):void{
        this.target = t;
    }

    public getTarget():T{
        return this.target;
    }

}


export class ResourceLink<T> {
    
    public static create<T>():ResourceLink<T>{
        const url:string = 'url'+Math.random()+'_'+Math.random();
        return new ResourceLink<T>(url);
    }

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
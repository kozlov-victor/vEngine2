

export class ResourceLink<T> {

    public static create<T>(target:T):ResourceLink<T>{
        const url:string = 'url'+Math.random()+'_'+Math.random();
        const link:ResourceLink<T> = new ResourceLink<T>(url);
        link.setTarget(target);
        return link;
    }

    public type:'ResourceLink';

    private _target:T;

    constructor(public readonly url:string){}

    public getUrl():string{
        return this.url;
    }

    public setTarget(t:T):void{
        this._target = t;
    }

    public getTarget():T{
        return this._target;
    }

}

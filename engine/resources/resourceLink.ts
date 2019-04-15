
export class ResourceLink {

    constructor(private id:string){}

    private target:any;

    getId():string{
        return this.id;
    }

    setTarget(t:any):void{
        this.target = t;
    }

    getTarget<T>():T{
        return this.target as T;
    }

}
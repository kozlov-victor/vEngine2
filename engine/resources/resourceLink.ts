import {Incrementer} from "@engine/resources/incrementer";
export class ResourceLink {

    private constructor(private id:string){}
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

    static create():ResourceLink {
        return new ResourceLink((Incrementer.getValue()).toString());
    }

}
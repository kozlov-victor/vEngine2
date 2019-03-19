

import {Incrementer} from "@engine/core/resources/incrementer";
export class ResourceLink {

    private constructor(private id:string){}
    private target:any;

    getId(){
        return this.id;
    }

    setTarget(t:any){
        this.target = t;
    }

    getTarget<T>():T{
        return this.target as T;
    }

    static create () {
        return new ResourceLink((Incrementer.getValue()).toString());
    }

}
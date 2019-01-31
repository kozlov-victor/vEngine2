

export class CommonObject {

    fromJSON(params:any = {}){
        Object.keys(params).forEach((key:string)=>{
            this[key] = params[key];
        });
        this.revalidate();
        return this;
    }

    revalidate(){}

    clone():CommonObject{
        return this;
    }



}
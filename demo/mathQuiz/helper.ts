import {ResourceAutoHolder} from "@engine/resources/resourceAutoHolder";

export const waitFor = (time:number):Promise<void>=> {
    return new Promise(resolve=>{
        setTimeout(()=>resolve(),time);
    });
}


const singletons:Record<string, any> = {}
export const singleton = <T extends ResourceAutoHolder>(key:string,factory:()=>T)=>{
    if (!singletons[key]) {
        singletons[key] = factory();
        console.log(singletons);
    }
    return singletons[key];
}

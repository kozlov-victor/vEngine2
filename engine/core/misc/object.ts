export const isObjectMatch =(obj:any,query:{[key:string]:any}):boolean=>{
    if (!(obj && query)) return false;
    let match:boolean = true;
    let keys:string[] = Object.keys(query);
    if (!keys.length) return false;
    keys.some((key:string)=>{
        if (obj[key]!=query[key]) {
            match = false;
            return true;
        }
    });
    return match;
};

export interface IKeyVal {
    [key:string]:any
}

export const isObject = (obj:any):boolean=>{
    return obj === Object(obj);
};

export const isArray = (a:any):a is any[]=> {
    return !!(a.splice);
};

let isEqualArray = (a:any[],b:any[]):boolean=>{
    for (let i=0,max=a.length;i<max;i++) {
        if (a[i]!==b[i]) return false;
    }
    return true;
};

let isEqualObject = (a:any,b:any):boolean=>{
    throw 'not implemented';
};

export const isEqual = (a:any,b:any):boolean=>{
    if (a===undefined) return false;
    if (isArray(a) && isArray(b)) return isEqualArray(a as any[],b as any[]);
    else if (isObject(a) && isObject(b)) return isEqualObject(a,b);
    return a===b;
};

export const removeFromArray = (arr:any[],predicate:(item:any)=>boolean):number=> {
    let i:number = this.length;
    let cnt:number = 0;
    while (i--) {
        if (predicate(arr[i])) {
            arr.splice(i, 1);
            cnt++;
        }
    }
    return cnt;
};
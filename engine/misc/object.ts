
export interface IKeyVal<T> {
    [key:string]:T;
}

export const isObject = (obj:any):boolean=>{
    return obj === Object(obj);
};

export const isArray = (a:any):a is any[]=> {
    return !!(a.splice);
};

const isEqualArray = (a:any[],b:any[]):boolean=>{
    for (let i:number=0,max=a.length;i<max;i++) {
        if (a[i]!==b[i]) return false;
    }
    return true;
};

const isEqualObject = (a:any,b:any):boolean=>{
    throw new Error('not implemented');
};

export const isEqual = (a:any,b:any):boolean=>{
    if (a===null || a===undefined) return false;
    if (isArray(a) && isArray(b)) return isEqualArray(a as any[],b as any[]);
    else if (isObject(a) && isObject(b)) return isEqualObject(a,b);
    return a===b;
};

export const removeFromArray = (arr:any[],predicate:(item:any)=>boolean):number=> {
    let i:number = arr.length;
    let cnt:number = 0;
    while (i--) {
        if (predicate(arr[i])) {
            arr.splice(i, 1);
            cnt++;
        }
    }
    return cnt;
};

export const noop = (arg?:any):any=>{};
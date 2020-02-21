
export interface IKeyVal<T> {
    [key:string]:T;
}

export const isObject = (obj:unknown):boolean=>{
    return obj === Object(obj);
};

export const isCommonArray = (a:unknown):a is unknown[]=> {
    return !!((a as Array<unknown>).splice);
};

export const isTypedArray = (a:unknown):a is Float32Array|Int32Array=> {
    return !!((a as {buffer:ArrayBufferLike}).buffer);
};

export const isArray = (a:unknown):a is Float32Array|Int32Array|unknown[]=> {
    return isCommonArray(a) || isTypedArray(a);
};

const isEqualArray = (a:Float32Array|Int32Array|unknown[],b:Float32Array|Int32Array|unknown[]):boolean=>{
    for (let i:number=0,max=a.length;i<max;i++) {
        if (a[i]!==b[i]) return false;
    }
    return true;
};

const isEqualObject = (a:unknown,b:unknown):boolean=>{
    throw new Error('not implemented');
};

export const isEqual = (a:unknown,b:unknown):boolean=>{
    if (a===null || a===undefined) return false;
    if (isArray(a) && isArray(b)) return isEqualArray(a as unknown[],b as unknown[]);
    else if (isObject(a) && isObject(b)) return isEqualObject(a,b);
    return a===b;
};

export const removeFromArray = (arr:unknown[],predicate:(item:unknown)=>boolean):number=> {
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

export const parametrizeString = (source:string,args:Record<string,string|number|boolean>):string=>{
    Object.keys(args).forEach((key:string)=>{
        source = source.split(key).join(''+args[key]);
    });
    return source;
};

export const noop = (arg?:unknown)=>{};


export interface IKeyVal<T> {
    [key:string]:T;
}

export const isString = (s:unknown):s is string=>{
    return (s as string)?.substr!==undefined;
};

export const isCommonArray = (a:unknown):a is unknown[]=> {
    return (a as Array<unknown>).push!==undefined;
};

export const isTypedArray = (a:unknown):a is Float32Array|Int32Array=> {
    return !!((a as {buffer:ArrayBufferLike}).buffer);
};

export const isArray = (a:unknown):a is Float32Array|Int32Array|unknown[]=> {
    return isCommonArray(a) || isTypedArray(a);
};

export const isObject = (a:unknown):a is Record<any, any>=> {
    return a!==null && !Array.isArray(a) && typeof a === 'object';
}

export const isNumber = (value:unknown):value is number=> {
    if (value===null || value===undefined) return false;
    if ((value as number).toFixed===undefined) return false;
    if (Number.isNaN(value)) return false;
    if (value===Infinity) return false;
    return value !== -Infinity;
};

export const isNotNumber = (value:unknown):boolean=> {
    return !isNumber(value);
};


export const isEqualArray = (a:Float32Array|Int32Array|unknown[],b:Float32Array|Int32Array|unknown[]):boolean=>{
    for (let i:number=0,max=a.length;i<max;++i) {
        if (a[i]!==b[i]) return false;
    }
    return true;
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

export const createRange = ({from,to}:{from?:number,to:number}):number[]=>{
    from??=0;
    const l = Math.abs(to-from);
    const res:number[] = [];
    const delta = from<to?1:-1;
    let cnt = from;
    for (let i=0;i<l;i++) {
        res.push(cnt);
        cnt+=delta;
    }
    return res;
}

export const noop = (arg?:unknown):any=>{};

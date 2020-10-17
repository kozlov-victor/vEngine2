
export const arr = (n:number):number[]=>{
    const array:number[] = new Array(n);
    for (let i:number = 0; i < n; i++) {
        array[i] = 0;
    }
    return array;
};

export const arraycopy = (src:number[],  srcPos:number, dest:number[], destPos:number, length:number):void=> {
    for (let i:number = 0; i < length; i++) {
        dest[destPos+i] = src[srcPos+i];
    }
};

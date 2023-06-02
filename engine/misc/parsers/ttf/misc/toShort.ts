
export const toShort = (n:number):number=>{
    return (n << 16) >> 16;
}


export class Ram {

    private readonly arr:Uint8[];

    constructor(size:number) {
        this.arr = new Array<Uint8>(size);
        this.arr.fill(0);
    }

    public get(addr:number) {
        if (addr<0 || addr>this.arr.length-1) throw new Error(`wrong memory address: ${addr}`);
        return this.arr[addr];
    }

    public set(addr:number, val: Uint8) {
        if (addr<0 || addr>this.arr.length-1) throw new Error(`wrong memory address: ${addr}`);
        this.arr[addr] = val;
    }

}

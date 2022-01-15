import {isCommonArray} from "@engine/misc/object";

export class BinBuffer {

    private readonly view:DataView;
    private pointer:number = 0;

    public static arrayToArrayBuffer(array:number[]):Uint8Array {
        const length:number = array.length;
        const buffer:ArrayBuffer = new ArrayBuffer(length);
        const view:Uint8Array = new Uint8Array(buffer);
        for (let i:number = 0; i < length; i++) {
            view[i] = array[i];
        }
        return view;
    }

    public static isBitSet(nBit:number,n:number):boolean {
        const mask:number = 1<<nBit;
        return (n & mask) > 0;
    }

    constructor(arrOrSize:number|number[]|ArrayBuffer){
        if (isCommonArray(arrOrSize)) {
            const buffer:ArrayBuffer = new ArrayBuffer(arrOrSize.length);
            this.view = new DataView(buffer);
            this.inflate(arrOrSize);
        } else if ((arrOrSize as ArrayBuffer).byteLength) {
            this.view = new DataView(arrOrSize as ArrayBuffer);
        } else {
            const buffer:ArrayBuffer = new ArrayBuffer(arrOrSize as number);
            this.view = new DataView(buffer);
        }
    }

    public getPointer():number{
        return this.pointer;
    }

    public setPointer(n:number):void{
        this.pointer = n;
    }

    public resetPointer():void{
        this.pointer = 0;
    }

    public getView():DataView{
        return this.view;
    }

    public getInt8Array():byte[]{
        const res:byte[] = new Array(this.view.buffer.byteLength);
        for (let i:number = 0; i < this.view.buffer.byteLength; i++) {
            res[i] = this.view.getInt8(i) as byte;
        }
        return res;
    }

    public getUint8Array():byte[]{
        const res:byte[] = new Array(this.view.buffer.byteLength);
        for (let i:number = 0; i < this.view.buffer.byteLength; i++) {
            res[i] = this.view.getUint8(i) as byte;
        }
        return res;
    }

    public getRestUints8():byte[]{
        const restSize:number = this.getByteLength() - this.getPointer();
        const res:byte[] = new Array<byte>(restSize);
        for (let i:number = 0; i < restSize; i++) {
            res[i] = this.readUint8();
        }
        return res;
    }

    public getByteLength():number {
        return this.view.byteLength;
    }

    private inflate(arr:number[]):void{
        for (let i = 0; i < arr.length; i++) {
            this.writeUint8(arr[i]);
        }
        this.resetPointer();
    }

    public writeString(str:string):void {
        for (let i = 0; i < str.length; i++) {
            this.view.setUint8(this.pointer + i, str.charCodeAt(i));
        }
        this.pointer+=str.length;
    }

    public writeUInt32(n:number,littleEndian?: boolean):void {
        this.view.setUint32(this.pointer,n,littleEndian);
        this.pointer+=4;
    }

    public writeUInt16(n:number,littleEndian?: boolean):void {
        this.view.setUint16(this.pointer,n,littleEndian);
        this.pointer+=2;
    }

    public writeUint8(n:number):void {
        this.view.setUint8(this.pointer,n);
        this.pointer++;
    }

    public readString(size:number):string{
        let res:string = '';
        for (let i = 0; i < size; i++) {
            res+=String.fromCharCode(this.view.getUint8(this.pointer + i));
        }
        this.pointer+=size;
        return res;
    }

    public readNTString():string{
        let res:string = '';
        let size:number = 0;
        let uint8:number;

        while ((uint8 = this.view.getUint8(this.pointer + size))!==0) {
            res+=String.fromCharCode(uint8);
            size++;
        }
        this.pointer+=++size;
        return res;
    }

    public readUint8():byte{
        const res:byte = this.view.getUint8(this.pointer) as byte;
        this.pointer++;
        return res;
    }

    public readInt8():byte{
        const res:byte = this.view.getInt8(this.pointer) as byte;
        this.pointer++;
        return res;
    }

    public readUint8At(pos:number):number{
        return this.view.getUint8(pos);
    }

    public readUints8(n:number):byte[]{
        if (n<0) throw new Error(`wont argument: ${n}`);
        const res:byte[] = [];
        for (let i = 0; i < n; i++) {
            res.push(this.readUint8());
        }
        return res;
    }

    public readInts8(n:number):byte[]{
        if (n<0) throw new Error(`wont argument: ${n}`);
        const res:byte[] = [];
        for (let i = 0; i < n; i++) {
            res.push(this.readInt8());
        }
        return res;
    }

    public readUints8ToArray(arr:number[], off:number, length:number):number{
        let readed:number = 0;
        for (let i = 0; i < length; i++) {
            const pos:number = i + off;
            if (this.pointer<this.view.byteLength-1) {
                arr[pos] = this.readUint8();
                readed++;
            }

        }
        return readed;
    }

    public readUints8ToArray_2(arr:number[]):number{
        return this.readUints8ToArray(arr,0,arr.length);
    }

    public readUInt64(littleEndian?: boolean):bigint {
        const data:bigint = this.view.getBigUint64(this.pointer,littleEndian);
        this.pointer+=8;
        return data;
    }

    public readUInt32(littleEndian?: boolean):number {
        const data:number = this.view.getUint32(this.pointer,littleEndian);
        this.pointer+=4;
        return data;
    }

    public readUInt16(littleEndian?: boolean):number {
        const data:number = this.view.getUint16(this.pointer,littleEndian);
        this.pointer+=2;
        return data;
    }

    public readInt64(littleEndian?: boolean):bigint {
        const data:bigint = this.view.getBigInt64(this.pointer,littleEndian);
        this.pointer+=8;
        return data;
    }

    public readInt32(littleEndian?: boolean):number {
        const data:number = this.view.getInt32(this.pointer,littleEndian);
        this.pointer+=4;
        return data;
    }

    public readInt16(littleEndian?: boolean):number {
        const data:number = this.view.getInt16(this.pointer,littleEndian);
        this.pointer+=2;
        return data;
    }

    public readFloat64(littleEndian?: boolean):number {
        const data:number = this.view.getFloat64(this.pointer,littleEndian);
        this.pointer+=8;
        return data;
    }

    public readFloat32(littleEndian?: boolean):number {
        const data:number = this.view.getFloat32(this.pointer,littleEndian);
        this.pointer+=4;
        return data;
    }

    public skip(n:number):number{
        this.pointer+=n;
        return n;
    }

}

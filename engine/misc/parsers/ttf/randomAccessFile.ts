
export abstract class RandomAccessFile {
    public abstract readUnsignedShort():number;
    public abstract readUnsignedByte():number;
    public abstract readInt():number;
    public abstract readShort():number;
    public abstract seek(n:number):void;
    public abstract getFilePointer():number;
}

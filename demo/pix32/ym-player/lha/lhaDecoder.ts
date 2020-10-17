
export interface LhaDecoder {
    read(b:number[], off:number, len:number):number;
    close():void;
}

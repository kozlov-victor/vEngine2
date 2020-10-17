import {LhaDecoder} from "./lhaDecoder";

export class LhdDecoder implements LhaDecoder {
    public constructor() {
    }

    public read(b:number[], off:number, len:number):number {
        return (-1);
    }

    public close():void {
    }
}

import {LhaDecoder} from "./lhaDecoder";
import {LhaFileInputStream} from "./lhaFile";

/**
 *
 * @author Nobuyasu SUEHIRO <nosue@users.sourceforge.net>
 */
export class NocompressDecoder implements LhaDecoder {
    private _in:LhaFileInputStream;
    private originalSize:number;

    public constructor(_in:LhaFileInputStream, originalSize:number) {
        this._in = _in;
        this.originalSize = originalSize;
    }

    public read(b:number[], off:number, len:number):number {
        if (len <= 0) {
            return (0);
        }

        if (this.originalSize <= 0) {
            return (-1);
        }

        const sl:number = len;

        while ((this.originalSize > 0) && (len > 0)) {
            b[off++] = this._in.read();

            --this.originalSize;
            --len;
        }

        return (sl - len);
    }

    public close():void {
        // tslint:disable-next-line:no-null-keyword
        this._in = null!;
    }
}

import {Checksum} from "./checksum";

export class Sum implements Checksum {

    private sum:number;

    /**
     * Creates a new check this.sum class.
     *
     */
    public constructor() {
        this.sum = 0;
    }

    /**
     * Updates check this.sum with specified byte.
     *
     * @param b
     *            data element
     */
    public update(b:number):void {
        this.sum += b;
    }

    /**
     * Updates check this.sum with specified array of bytes.
     *
     * @param b
     *            data element array
     * @param off
     *            data element array offset
     * @param len
     *            data element array length from offset
     */
    public update_2(b:number[], off:number, len:number) {
        while (len-- > 0) {
            this.sum += b[off++];
        }
    }

    /**
     * Returns check this.sum to initial value.
     *
     * @return sum value
     */
    public getValue():number {
        return this.sum & 0xFF;
    }

    /**
     * Resets check this.sum to initial value.
     *
     */
    public reset():void {
        this.sum = 0;
    }
}

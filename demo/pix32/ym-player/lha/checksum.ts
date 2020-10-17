/**
 * An interface representing a data checksum.
 * translated from package java.util.zip;
 */
export interface Checksum {
    /**
     * Updates the current checksum with the specified byte.
     *
     * @param b the byte to update the checksum with
     */
    update(b: number): void;

    /**
     * Updates the current checksum with the specified array of bytes.
     * @param b the byte array to update the checksum with
     * @param off the start offset of the data
     * @param len the number of bytes to use for the update
     */
    update_2(b: number[], off: number, len: number):void;

    /**
     * Returns the current checksum value.
     * @return the current checksum value
     */
    getValue(): number;

    /**
     * Resets the checksum to its initial value.
     */
    reset():void;
}

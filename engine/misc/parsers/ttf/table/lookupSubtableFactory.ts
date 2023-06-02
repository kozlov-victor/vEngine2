
import {LookupSubtable} from "@engine/misc/parsers/ttf/table/lookupSubtable";
import {RandomAccessFile} from "@engine/misc/parsers/ttf/misc/randomAccessFile";

export interface LookupSubtableFactory {
    read(type: number, raf: RandomAccessFile, offset: number):LookupSubtable;
}

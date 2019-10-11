import {Optional} from "@engine/core/declarations";

export class Stack<T> {

    private _array:T[] = [];

    public push(obj:T) {
        this._array.push(obj);
    }

    public pop():Optional<T>{
        return this._array.pop();
    }

    public replaceLast(obj:T):void{
        if (!this._array.length) this._array.push(obj);
        else this._array[this._array.length-1] = obj;
    }

    public getLast():Optional<T>{
        if (!this._array) return undefined;
        else return this._array[this._array.length-1];
    }

}
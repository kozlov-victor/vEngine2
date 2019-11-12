import {Optional} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";

export class Stack<T> {

    private _array:Optional<T>[] = new Array(16);
    private stackPointer:number = 0;

    public push(obj:T) {
        this._array[this.stackPointer++] = obj;
    }

    public pop():Optional<T>{
        if (DEBUG && this.stackPointer===0) throw new DebugError(`empty stack`);
        this.stackPointer--;
        const res = this._array[this.stackPointer];
        this._array[this.stackPointer] = undefined;
        return res;
    }

    public replaceLast(obj:T):void{
        if (!this._array.length) this.push(obj);
        else this._array[this.stackPointer-1] = obj;
    }

    public getLast():Optional<T>{
        if (!this._array) return undefined;
        else return this._array[this.stackPointer-1];
    }

    public getAt(i:number):Optional<T>{
        return this._array[i];
    }

    public size():number{
        return this.stackPointer;
    }

    public isEmpty():boolean{
        return this.stackPointer===0;
    }

}
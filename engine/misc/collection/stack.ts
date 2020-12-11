import {Optional} from "@engine/core/declarations";
import {DebugError} from "@engine/debug/debugError";

export class Stack<T> {

    private _array:Optional<T>[] = new Array(16);
    private _stackPointer:number = 0;

    public push(obj:T):void {
        this._array[this._stackPointer++] = obj;
    }

    public pop():Optional<T>{
        if (DEBUG && this._stackPointer===0) throw new DebugError(`empty stack`);
        this._stackPointer--;
        const res = this._array[this._stackPointer];
        this._array[this._stackPointer] = undefined;
        return res;
    }

    public replaceLast(obj:T):void{
        if (!this._array.length) this.push(obj);
        else this._array[this._stackPointer-1] = obj;
    }

    public getLast():Optional<T>{
        if (!this._array) return undefined;
        else return this._array[this._stackPointer-1];
    }

    public getAt(i:number):Optional<T>{
        return this._array[i];
    }

    public size():number{
        return this._stackPointer;
    }

    public isEmpty():boolean{
        return this._stackPointer===0;
    }

}

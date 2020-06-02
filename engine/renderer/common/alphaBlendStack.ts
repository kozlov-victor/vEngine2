import {IPropertyStack} from "@engine/renderer/common/propertyStack";
import {Stack} from "@engine/misc/collection/stack";

export class AlphaBlendStack implements IPropertyStack<number>{

    private _stack:Stack<number> = new Stack();

    constructor(){
        this._stack.push(1);
    }

    public getCurrentValue(): number {
        return this._stack.getLast()!;
    }

    public restore(): void {
        if (this._stack.isEmpty()) this._stack.push(1);
        else this._stack.pop();
    }

    public save(): void {
        const last:number = this._stack.getLast()!;
        this._stack.push(last);
    }

    public mult(alpha:number):void{
        this.setCurrentValue(this.getCurrentValue()*alpha);
    }

    public setCurrentValue(v: number): void {
        this._stack.replaceLast(v);
    }



}

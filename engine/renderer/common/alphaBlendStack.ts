import {IPropertyStack} from "@engine/renderer/common/propertyStack";
import {Stack} from "@engine/misc/collection/stack";

export class AlphaBlendStack implements IPropertyStack<number>{

    private stack:Stack<number> = new Stack();

    constructor(){
        this.stack.push(1);
    }

    public getCurrentValue(): number {
        return this.stack.getLast()!;
    }

    public restore(): void {
        if (this.stack.isEmpty()) this.stack.push(1);
        else this.stack.pop();
    }

    public save(): void {
        const last:number = this.stack.getLast()!;
        this.stack.push(last);
    }

    public mult(alpha:number):void{
        this.setCurrentValue(this.getCurrentValue()*alpha);
    }

    public setCurrentValue(v: number): void {
        this.stack.replaceLast(v);
    }



}
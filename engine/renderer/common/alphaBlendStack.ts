import {IPropertyStack} from "@engine/renderer/common/propertyStack";

export class AlphaBlendStack implements IPropertyStack<number>{

    public getCurrentValue(): number {
        return 0;
    }

    public restore(): void {
    }

    public save(): void {
    }

    public setCurrentValue(v: number): void {
    }



}